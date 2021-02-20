import { css, cx } from "@emotion/css";
import Box from "@material-ui/core/Box";
import ButtonBase from "@material-ui/core/ButtonBase";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {
  Dice,
  DiceCommandOptions,
  IDiceRollWithBonus,
} from "../../domains/dice/Dice";
import { Font } from "../../domains/font/Font";
import { useDiceRolls } from "../../hooks/useDiceRolls/useDiceRolls";
import { useTextColors } from "../../hooks/useTextColors/useTextColors";

type IProps = {
  rolls: Array<IDiceRollWithBonus>;
  size: string;
  fontSize: string;
  borderSize: string;
  tooltipOpen?: boolean;
  tooltipPlacement?: TooltipProps["placement"];
  disabled?: boolean;
  showDetails?: boolean;
  onClick: () => void;
  onRolling?: (rolling: boolean) => void;
  onFinalResult?: (realRoll: IDiceRollWithBonus) => void;
};

export const DiceBox: React.FC<IProps> = (props) => {
  const theme = useTheme();
  const diceTextColors = useTextColors(theme.palette.background.paper);
  const diceRollsManager = useDiceRolls(props.rolls, {
    onRolling: props.onRolling,
    onFinalResult: props.onFinalResult,
  });
  const tooltipBackground = "#182026";
  const tooltipColor = useTextColors(tooltipBackground);

  function handleButtonBoxClick() {
    if (diceRollsManager.state.rolling) {
      return;
    }
    props.onClick();
  }

  const diceStyle = css({
    fontSize: props.fontSize,
    fontFamily: Font.monospace,
    lineHeight: "normal",
    color: diceRollsManager.state.color,
    background: theme.palette.background.paper,
    border: `${props.borderSize} solid ${theme.palette.text.primary}`,
    borderRadius: "4px",
    padding: ".2rem",
    minWidth: props.size,
    height: props.size,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow:
      "3px 5px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
  });
  const diceRollingAnimationStyle = css({
    animationName: "spin",
    animationDuration: "250ms",
    animationIterationCount: "infinite",
    animationTimingFunction: "linear",
  });

  const tooltipStyle = css({
    background: tooltipBackground,
    borderRadius: "6px",
    maxWidth: "none",
    color: tooltipColor.primary,
    padding: "0",
    boxShadow: theme.shadows[4],
  });

  const tooltipContent = !diceRollsManager.state.finalResultHidden ? (
    <Box p="1rem">
      <Grid container alignItems="center" wrap="nowrap" spacing={4}>
        <Grid item xs className={css({ maxWidth: "18rem" })}>
          <Box
            fontSize=".8rem"
            fontWeight="bold"
            lineHeight={Font.lineHeight(0.8)}
            className={css({
              textTransform: "uppercase",
              color: theme.palette.secondary.light,
            })}
          >
            {"Roll"}
          </Box>
          <Box
            fontSize="1.3rem"
            color={tooltipColor.primary}
            lineHeight={Font.lineHeight(1.5)}
            fontWeight="bold"
            className={css({
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            })}
          >
            {diceRollsManager.state.finalResultRolls.map((r, i) => {
              const group = DiceCommandOptions[r.type];
              const isFirst = i === 0;
              const isFate = r.type === "1dF";
              return (
                <span key={i}>
                  {!isFirst && <span>{" + "}</span>}
                  <span
                    className={css({
                      fontFamily: isFate ? "fate" : "inherit",
                    })}
                  >
                    {group.formatDetailedResult(r.value)}
                  </span>
                </span>
              );
            })}
            {diceRollsManager.state.finalResultBonusLabel && (
              <span>
                {" + "} {diceRollsManager.state.finalResultBonus}
              </span>
            )}
          </Box>
          <Box
            fontSize="1rem"
            className={css({
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            })}
            color={tooltipColor.secondary}
            lineHeight={Font.lineHeight(1)}
          >
            {Dice.simplifyRolls(diceRollsManager.state.finalResultRolls).map(
              (r, i) => {
                const isFirst = i === 0;
                return (
                  <span key={i} className={css({})}>
                    {!isFirst && <span>{" + "}</span>}
                    {r.type}
                  </span>
                );
              }
            )}
            {diceRollsManager.state.finalResultBonusLabel && (
              <span>
                {" + "} {diceRollsManager.state.finalResultBonusLabel}
              </span>
            )}
          </Box>
        </Grid>
        <Divider
          orientation="vertical"
          flexItem
          className={css({ background: tooltipColor.disabled })}
        />
        <Grid item xs>
          <Box
            fontSize="2rem"
            fontWeight="bold"
            textAlign="center"
            lineHeight={Font.lineHeight(2)}
            color={tooltipColor.primary}
          >
            {diceRollsManager.state.finalResultTotal}
          </Box>
        </Grid>
      </Grid>
    </Box>
  ) : (
    ""
  );

  if (props.showDetails) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        {renderDice()}
        {renderDetails()}
      </Box>
    );
  }

  const keyForTooltipForceRerender = `dicebox-tooltip-${props.tooltipOpen}`;
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Tooltip
        arrow
        key={keyForTooltipForceRerender}
        open={props.tooltipOpen}
        placement={props.tooltipPlacement}
        title={tooltipContent}
        classes={{
          arrow: css({
            color: tooltipBackground,
          }),
          tooltip: tooltipStyle,
        }}
      >
        {renderDice()}
      </Tooltip>
    </Box>
  );

  function renderDice() {
    return (
      <div>
        <ButtonBase
          className={css({
            borderRadius: "50%",
            color: diceTextColors.primary,
          })}
          disabled={props.disabled || diceRollsManager.state.rolling}
          onClick={(e) => {
            e.stopPropagation();
            handleButtonBoxClick();
          }}
        >
          <Typography
            component="span"
            data-cy="dice"
            data-cy-value={diceRollsManager.state.finalResultTotal}
            data-cy-rolling={diceRollsManager.state.rolling}
            className={cx(diceStyle, {
              [diceRollingAnimationStyle]: diceRollsManager.state.rolling,
            })}
          >
            {diceRollsManager.state.finalResultHidden
              ? ""
              : diceRollsManager.state.finalResultTotal}
          </Typography>
        </ButtonBase>
      </div>
    );
  }

  function renderDetails() {
    if (!props.showDetails) {
      return null;
    }

    return (
      <Grow in={!!tooltipContent}>
        <Box mt="1rem" className={tooltipStyle}>
          {tooltipContent}
        </Box>
      </Grow>
    );
  }
};
