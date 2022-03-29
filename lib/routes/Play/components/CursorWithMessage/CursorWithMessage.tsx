import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import { css } from "@emotion/css";
import Box from "@mui/material/Box";
import Grow from "@mui/material/Grow";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import { ContentEditable } from "../../../../components/ContentEditable/ContentEditable";
import { FontFamily } from "../../../../constants/FontFamily";
import { useZIndex } from "../../../../constants/zIndex";
import { ThemedLabel } from "../../../Character/components/CharacterDialog/components/ThemedLabel";
import {
  MiniThemeContext,
  useMiniTheme,
} from "../../../Character/components/CharacterDialog/MiniThemeContext";
import { DefaultPlayerColor } from "../../consts/PlayerColors";
import { IPlayerCursorRollOutput } from "../../types/IPlayerCursorState";

let topTenLatestRollCommandsSingleton: Array<string> = [];

export default function CursorWithMessage(props: {
  color: string | null | undefined;
  x: number;
  y: number;
  message: string | null | undefined;
  rollOutput: IPlayerCursorRollOutput | null | undefined;
  readonly?: boolean;
  label: string | null | undefined;
  onRollOutputChange?(roll: IPlayerCursorRollOutput | null | undefined): void;
  onMessageChange?(message: string): void;
}) {
  const textPlaceholder = "Type a message...";

  const zIndex = useZIndex();
  const theme = useTheme();
  const color = props.color || DefaultPlayerColor;
  const miniTheme = useMiniTheme({
    enforceBackground: color,
  });
  const textColor = theme.palette.getContrastText(color);
  const [topTenLatestRollCommands, setTopTenLatestRollCommands] =
    React.useState<Array<string>>(topTenLatestRollCommandsSingleton);
  const [commandToPopIndex, setCommandtoPopIndex] = React.useState(0);
  const shouldRenderPopover =
    props.message || props.rollOutput || !props.readonly;

  useEffect(() => {
    topTenLatestRollCommandsSingleton = topTenLatestRollCommands;
  }, [topTenLatestRollCommands]);

  function handleDiceRoll() {
    try {
      const command = props.message || "";
      const roll = new DiceRoll(command);
      props.onRollOutputChange?.({
        text: roll.output,
        total: roll.total.toString(),
      });
      setTopTenLatestRollCommands(
        [command, ...topTenLatestRollCommands].slice(0, 10)
      );
      setCommandtoPopIndex(0);
    } catch (error) {
      props.onRollOutputChange?.(undefined);
    }
  }

  function handleMessage(message: string) {
    props.onMessageChange?.(message);
    setCommandtoPopIndex(0);
  }

  function handleRollHistoryPrevious() {
    const poppedCommand = topTenLatestRollCommands[commandToPopIndex];
    if (poppedCommand) {
      props.onMessageChange?.(poppedCommand);
      const newIndex = Math.min(
        commandToPopIndex + 1,
        topTenLatestRollCommands.length - 1
      );
      setCommandtoPopIndex(newIndex);
    }
  }

  function handleRollHistoryNext() {
    const poppedCommand = topTenLatestRollCommands[commandToPopIndex];
    if (poppedCommand) {
      props.onMessageChange?.(poppedCommand);
      const newIndex = Math.max(commandToPopIndex - 1, 0);
      setCommandtoPopIndex(newIndex);
    }
  }

  return (
    <MiniThemeContext.Provider value={miniTheme}>
      <div
        className={css({
          label: "CursorWithMessage",
          position: "absolute",
          pointerEvents: "none",
          top: "-10px",
          left: "-10px",
          zIndex: zIndex.cursor,
        })}
        style={{
          transition: "transform 0.5s cubic-bezier(.17,.93,.38,1)",
          transform: `translateX(${props.x}px) translateY(${props.y}px)`,
        }}
      >
        {props.readonly && renderCursor()}

        <Grow in={!!shouldRenderPopover}>{renderPopover()}</Grow>
      </div>
    </MiniThemeContext.Provider>
  );

  function renderCursor() {
    return (
      <svg
        className={css({
          position: "relative",
          width: "4rem",
          height: "4rem",
        })}
        width="24"
        height="36"
        viewBox="0 0 24 36"
        fill="none"
        stroke="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={color}
        />
      </svg>
    );
  }

  function renderPopover() {
    return (
      <div
        className={css({
          position: "absolute",
          top: "2rem",
          left: "1.5rem",
          padding: "1rem",
        })}
        style={{ backgroundColor: color, borderRadius: 4 }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{
              display: "flex",
              color: textColor,
            }}
          >
            {props.label}
          </Typography>
        </Box>
        <ThemedLabel
          className={css({
            fontSize: "1.5rem",
          })}
        >
          <ContentEditable
            autoFocus
            className={css({
              color: textColor,
              background: "transparent",
              outline: "none",
              minWidth: "12rem",
            })}
            noDelay
            value={props.message || ""}
            onChange={(message) => {
              handleMessage(message);
            }}
            border
            borderColor={textColor}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                handleDiceRoll();
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                e.stopPropagation();
                handleRollHistoryPrevious();
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                e.stopPropagation();
                handleRollHistoryNext();
              }
            }}
            readonly={props.readonly}
            placeholder={textPlaceholder}
            // maxLength={50}
          />
        </ThemedLabel>
        {!props.readonly && (
          <Box pt=".5rem">
            <Typography
              variant="caption"
              sx={{ color: textColor, margin: "0", display: "block" }}
            >
              {"ESC to close."}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: textColor, margin: "0", display: "block" }}
            >
              {"Supports roll commands."}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: textColor, margin: "0", display: "block" }}
            >
              {"Arrow Up/Down for roll history."}
            </Typography>
          </Box>
        )}
        {renderRollOutput()}
      </div>
    );
  }

  function renderRollOutput() {
    return (
      <Grow in={!!props.rollOutput}>
        <Box
          py=".5rem"
          sx={{
            padding: ".5rem",
            marginTop: ".5rem",
            background: "#fff",
            fontSize: "1.5rem",
            fontFamily: FontFamily.Console,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "2rem",
                color: "#000",
              }}
              variant="caption"
            >
              {props.rollOutput?.total}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                color: "#000",
              }}
              variant="caption"
            >
              {props.rollOutput?.text}
            </Typography>
          </Box>
        </Box>
      </Grow>
    );
  }
}
