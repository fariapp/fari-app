import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid, { GridSize } from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import { CharactersContext } from "../../contexts/CharactersContext/CharactersContext";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../contexts/MyBinderContext/MyBinderContext";
import { SettingsContext } from "../../contexts/SettingsContext/SettingsContext";
import { ICharacter, ISection } from "../../domains/character/types";
import { ManagerBox } from "../Character/components/CharacterDialog/CharacterV3Dialog";
import { BlockByType } from "../Character/components/CharacterDialog/components/BlockByType";
import {
  MiniThemeContext,
  useMiniTheme,
} from "../Character/components/CharacterDialog/MiniThemeContext";

export const CharacterPrintRoute: React.FC<{
  match: {
    params: { id: string };
  };
}> = (props) => {
  const theme = useTheme();
  const history = useHistory();
  const charactersManager = useContext(CharactersContext);
  const settingsManager = useContext(SettingsContext);
  const [character, setCharacter] = useState<ICharacter | undefined>(undefined);
  const myBinderManager = useContext(MyBinderContext);
  const logger = useLogger();

  useEffect(() => {
    logger.track("character.print");

    settingsManager.actions.setThemeModeTemporarily("light");
  }, []);

  useEffect(() => {
    const characterToLoad = charactersManager.state.characters.find(
      (s) => s.id === props.match.params.id
    );

    if (characterToLoad) {
      setCharacter(characterToLoad);
    } else {
      history.replace("/");
      myBinderManager.actions.open({ folder: "characters" });
    }
  }, [props.match.params.id, charactersManager.state.characters]);

  const maxWidth = character?.wide ? "lg" : "md";

  return (
    <>
      <PageMeta title={character?.name} />

      <Box bgcolor={theme.palette.background.paper} mt="1rem">
        <Container maxWidth={maxWidth}>
          <PrintCharacter character={character} />
        </Container>
      </Box>
    </>
  );
};

CharacterPrintRoute.displayName = "CharacterPrintRoute";
export default CharacterPrintRoute;

function PrintCharacter(props: { character: ICharacter | undefined }) {
  const theme = useTheme();
  const miniTheme = useMiniTheme({
    character: props.character,
    enforceBackground: theme.palette.background.paper,
  });
  return (
    <>
      <MiniThemeContext.Provider value={miniTheme}>
        <style>{miniTheme.style}</style>
        <Box mb="1rem">
          <Grid container justifyContent="center">
            <Grid item>
              <FateLabel uppercase={false} variant="h4">
                {props.character?.name}
              </FateLabel>
            </Grid>
          </Grid>
        </Box>
        <Box>
          {props.character?.pages.map((page, pageIndex) => {
            return (
              <Box
                key={pageIndex}
                className={css({
                  pageBreakAfter: "always",
                  marginBottom: "1rem",
                })}
              >
                <Box
                  className={css({
                    borderBottom: `1px solid ${miniTheme.borderColor}`,
                    width: "100%",
                    display: "flex",
                  })}
                >
                  <Box
                    className={css({
                      marginRight: "1rem",
                      width: "auto",
                      padding: ".5rem 1rem",
                      borderBottom: `4px solid ${miniTheme.textPrimary}`,
                    })}
                  >
                    <Typography
                      noWrap
                      className={css({
                        fontFamily: miniTheme.pageHeadingFontFamily,
                        fontSize: `${miniTheme.pageHeadingFontSize}rem`,
                        fontWeight: miniTheme.pageHeadingFontWeight,
                      })}
                    >
                      {previewContentEditable({ value: page.label })}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  {page.rows.map((row, rowIndex) => {
                    const columnSize = Math.floor(12 / row.columns.length);
                    return (
                      <ManagerBox
                        key={rowIndex}
                        readonly={true}
                        label={<>Row #{rowIndex + 1}</>}
                      >
                        {row.columns.length > 0 && (
                          <Grid container>
                            {row.columns.map((column, columnIndex) => {
                              return (
                                <Grid
                                  item
                                  key={columnIndex}
                                  // xs={12}
                                  xs={columnSize as GridSize}
                                >
                                  <ManagerBox
                                    readonly={true}
                                    label={<>Column #{columnIndex + 1}</>}
                                  >
                                    {column.sections.map((section) => {
                                      return (
                                        <PrintSections
                                          key={section.id}
                                          section={section}
                                        />
                                      );
                                    })}
                                  </ManagerBox>
                                </Grid>
                              );
                            })}
                          </Grid>
                        )}
                      </ManagerBox>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </MiniThemeContext.Provider>
    </>
  );
}

function PrintSections(props: { section: ISection }) {
  const miniTheme = useContext(MiniThemeContext);

  return (
    <>
      <Box
        className={css({
          pageBreakInside: "avoid",
        })}
      >
        <Grid container>
          <Grid item xs>
            <Box
              className={css({
                background: miniTheme.hideSectionBackground
                  ? undefined
                  : miniTheme.textPrimary,

                color: miniTheme.hideSectionBackground
                  ? miniTheme.textPrimary
                  : miniTheme.textPrimaryInverted,
                width: "100%",
                padding: miniTheme.hideSectionBackground ? "0 .5rem" : ".5rem",
              })}
            >
              <Typography
                noWrap
                className={css({
                  fontFamily: miniTheme.sectionHeadingFontFamily,
                  fontSize: `${miniTheme.sectionHeadingFontSize}rem`,
                  fontWeight: miniTheme.sectionHeadingFontWeight,
                })}
              >
                {previewContentEditable({
                  value: props.section.label,
                }) || " "}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid container>
          {props.section.blocks.map((block) => {
            const width: GridSize = !!block.meta.width
              ? ((block.meta.width * 12) as GridSize)
              : 12;
            return (
              <Grid
                item
                xs={width}
                key={block.id}
                className={css({
                  pageBreakInside: "avoid",
                })}
              >
                <Box my=".5rem" px=".5rem">
                  <BlockByType
                    advanced={false}
                    readonly={true}
                    dataCy={`character-card.${props.section.label}.${block.label}`}
                    block={block}
                    onChange={() => undefined}
                    onRoll={() => undefined}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}
