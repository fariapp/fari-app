/**
 * @jest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react-hooks";
import { CharacterFactory } from "../../../../domains/character/CharacterFactory";
import { DefaultTemplates } from "../../../../domains/character/DefaultTemplates";
import { ICharacter } from "../../../../domains/character/types";
import { useCharacter } from "../useCharacter";

describe("useCharacter", () => {
  describe("sanitizeCharacter", () => {
    it("should sanitize the character", async () => {
      const defaultCahracter = await CharacterFactory.make(
        DefaultTemplates.FateCondensed
      );
      // GIVEN
      const character = {
        ...defaultCahracter,
        id: "1",
        lastUpdated: 1,
      };
      // WHEN
      const { result } = renderHook(
        () => {
          return useCharacter(character);
        },
        {
          initialProps: { character: character },
        }
      );
      // THEN
      expect(result.current.state.character).toEqual(character);
      // WHEN the name is updated
      act(() => {
        result.current.actions.setName("Luke Skywalker");
      });
      expect(
        result.current.actions.getCharacterWithNewTimestamp().name
      ).toEqual("Luke Skywalker");
      expect(
        result.current.actions.getCharacterWithNewTimestamp().lastUpdated
      ).not.toEqual(1);
    });
  });

  describe("sync props with state", () => {
    it("should not crash if characters in props in undefined", async () => {
      // GIVEN
      const initialRenderCharacter = undefined as unknown as ICharacter;
      // WHEN
      const { result } = renderHook(
        (props) => {
          return useCharacter(props.character);
        },
        {
          initialProps: { character: initialRenderCharacter },
        }
      );
      expect(result.current.state.character).toEqual(undefined);
    });
    it("should not update state if character in props lastTimeUpdated is older than current state", async () => {
      // GIVEN
      const initialRenderCharacter = {
        name: "Luke",
        lastUpdated: 5,
      } as ICharacter;
      // WHEN
      const { result, rerender } = renderHook(
        (props) => {
          return useCharacter(props.character);
        },
        {
          initialProps: { character: initialRenderCharacter },
        }
      );
      // CHARACTER UPDATED IN DIALOG
      const newName = "Luke Skywalker";
      act(() => {
        result.current.actions.setName(newName);
      });
      expect(result.current.state.character!.name).toEqual(newName);

      // GM SYNC SCENE WITH PLAYER WITH OUTDATED CHARACTER
      rerender({
        character: { name: "Luke", lastUpdated: 4 } as ICharacter,
      });
      // THEN
      expect(result.current.state.character!.name).toEqual("Luke Skywalker");
    });
    it("should update state if character in props lastTimeUpdated is older than current state but id is different", async () => {
      // GIVEN
      const initialRenderCharacter = {
        id: "1-luke",
        name: "Luke",
        lastUpdated: 5,
      } as ICharacter;
      // WHEN
      const { result, rerender } = renderHook(
        (props) => {
          return useCharacter(props.character);
        },
        {
          initialProps: { character: initialRenderCharacter },
        }
      );
      const newName = "Luke Skywalker";
      act(() => {
        result.current.actions.setName(newName);
      });
      expect(result.current.state.character!.name).toEqual(newName);

      rerender({
        character: {
          id: "2-chewie",
          name: "Chewie",
          lastUpdated: 4,
        } as ICharacter,
      });
      // THEN
      expect(result.current.state.character!.name).toEqual("Chewie");
    });
    it("should not update state if character in props lastUpdatedTime is same as current state", async () => {
      // GIVEN
      const initialRenderCharacter = {
        name: "Luke",
        lastUpdated: 5,
      } as ICharacter;
      // WHEN
      const { result, rerender } = renderHook(
        (props) => {
          return useCharacter(props.character);
        },
        {
          initialProps: { character: initialRenderCharacter },
        }
      );
      // CHARACTER UPDATED IN DIALOG
      const newName = "Luke Skywalker";
      act(() => {
        result.current.actions.setName(newName);
      });
      expect(result.current.state.character!.name).toEqual(newName);

      // GM SYNC SCENE WITH PLAYER WITH OUTDATED CHARACTER
      rerender({
        character: { name: "Luke", lastUpdated: 5 } as ICharacter,
      });
      // THEN
      expect(result.current.state.character!.name).toEqual("Luke Skywalker");
    });
    it("should update state if character in props is newer than current state", async () => {
      // GIVEN
      const initialRenderCharacter = {
        name: "Luke",
        lastUpdated: 5,
      } as ICharacter;
      // WHEN
      const { result, rerender } = renderHook(
        (props) => {
          return useCharacter(props.character);
        },
        {
          initialProps: { character: initialRenderCharacter },
        }
      );
      // CHARACTER UPDATED IN DIALOG
      const newName = "Luke Skywalker";
      act(() => {
        result.current.actions.setName(newName);
      });
      expect(result.current.state.character!.name).toEqual(newName);

      // GM SYNC SCENE WITH PLAYER WITH NEW VERSION CHARACTER
      rerender({
        character: { name: "Leia", lastUpdated: 6 } as ICharacter,
      });
      // THEN
      expect(result.current.state.character!.name).toEqual("Leia");
    });
  });

  describe("load template", () => {
    it("should load the new template but keep the id and the name as is", async () => {
      const defaultCharacter = await CharacterFactory.make(
        DefaultTemplates.FateCondensed
      );
      // GIVEN
      const character = {
        ...defaultCharacter,
        id: "1",
        name: "Luke Skywalker",
        lastUpdated: 1,
      };
      // WHEN
      const { result, waitForNextUpdate } = renderHook(
        () => {
          return useCharacter(character);
        },
        {
          initialProps: { character: character },
        }
      );
      // THEN
      expect(result.current.state.character).toEqual(character);

      // WHEN a template is loading
      act(() => {
        result.current.actions.loadTemplate(DefaultTemplates.FateAccelerated);
      });

      // Wait for JSON download
      await waitForNextUpdate();
      expect(result.current.state.character?.lastUpdated).not.toEqual(
        character.lastUpdated
      );

      // id: "1", // kept ID
      // name: "Luke Skywalker", // kept name
      expect(result.current.state.character?.id).toEqual("1");
      expect(result.current.state.character?.name).toEqual("Luke Skywalker");
    });
  });
});
