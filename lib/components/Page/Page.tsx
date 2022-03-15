import { css } from "@emotion/css";
import BugReportIcon from "@mui/icons-material/BugReport";
import CasinoIcon from "@mui/icons-material/Casino";
import ChatIcon from "@mui/icons-material/Chat";
import ComputerIcon from "@mui/icons-material/Computer";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import ForumIcon from "@mui/icons-material/Forum";
import GitHubIcon from "@mui/icons-material/GitHub";
import InfoIcon from "@mui/icons-material/Info";
import LightModeIcon from "@mui/icons-material/LightMode";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import MenuIcon from "@mui/icons-material/Menu";
import StorageIcon from "@mui/icons-material/Storage";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import TranslateIcon from "@mui/icons-material/Translate";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Select from "@mui/material/Select";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { env } from "../../constants/env";
import { Images } from "../../constants/Images";
import { useZIndex } from "../../constants/zIndex";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { MyBinderContext } from "../../contexts/MyBinderContext/MyBinderContext";
import { SettingsContext } from "../../contexts/SettingsContext/SettingsContext";
import { Icons } from "../../domains/Icons/Icons";
import { useHighlight } from "../../hooks/useHighlight/useHighlight";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import {
  IPossibleLanguages,
  PossibleLanguagesNames
} from "../../services/internationalization/InternationalizationService";
import { AppButtonLink, AppLink } from "../AppLink/AppLink";
import { CannyChangelog } from "../CannyChangelog/CannyChangelog";
import { CookieConsent } from "../CookieConsent/CookieConsent";
import { Kofi } from "../Kofi/Kofi";
import { Patreon } from "../Patreon/Patreon";
import { ScrollToTop } from "../ScrollToTop/ScrollToTop";
import { NavLink, NavLinkCategory } from "./NavLink";

let gameIdSingleton: string | undefined = undefined;

export const FariMaxWidth = "1920px";
export const FariToolbarMaxWidth = "1280px";

export enum LiveMode {
  Connecting,
  Live,
}

export const Page: React.FC<{
  notFound?: JSX.Element;
  gameId?: string;
  isLive?: boolean;
  drawerWidth?: string;
  maxWidth?: string;
  marginTop?: string;
  pb?: string;
  debug?: Record<string, string>;
  hideHeaderLogo?: boolean;
  disableAutomaticScrollTop?: boolean;
}> = (props) => {
  const history = useHistory();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [gameId, setGameId] = useState(gameIdSingleton);
  const shouldDisplayRejoinButton = gameId && !props.gameId;
  const { t, i18n, currentLanguage } = useTranslate();

  const myBinderManager = useContext(MyBinderContext);
  const settingsManager = useContext(SettingsContext);
  const logger = useLogger();
  const zIndex = useZIndex();

  const isLive = props.isLive;
  const highlight = useHighlight();

  useEffect(() => {
    if (props.gameId) {
      setGameId(props.gameId);
      gameIdSingleton = props.gameId;
    }
  }, [props.gameId]);

  return (
    <>
      {!props.disableAutomaticScrollTop && <ScrollToTop />}

      {renderHeader()}
      {renderContent()}
    </>
  );

  function renderContent() {
    return (
      <Fade in timeout={250}>
        <div>
          <div
            className={css({
              height: "100%",
              paddingBottom: "4rem",
              minHeight: "calc(100vh - 56px)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            })}
          >
            {!!props.notFound ? (
              props.notFound
            ) : (
              <div
                className={css({
                  maxWidth: props.drawerWidth
                    ? undefined
                    : props.maxWidth ?? FariMaxWidth,
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: props.marginTop || "2rem",
                  width: "100%",
                  flex: "1 0 auto",
                })}
              >
                {props.children}
              </div>
            )}
          </div>

          {renderFooter()}
        </div>
      </Fade>
    );
  }

  function renderFooter() {
    return (
      <Box
        // TODO: https://github.com/fariapp/fari/issues/212
        pb={props.pb ?? "0"}
        displayPrint="none"
        className={css({
          paddingTop: "1rem",
          marginLeft: props.drawerWidth ?? undefined,
          borderTop: "1px solid #e0e0e0",
        })}
      >
        <CookieConsent />

        <Container>
          {env.isDev && props.debug && (
            <pre
              className={css({
                whiteSpace: "break-spaces",
              })}
            >
              {Object.keys(props.debug).map((label) => {
                return (
                  <Box key={label}>
                    {label}: {props.debug?.[label]}
                  </Box>
                );
              })}
            </pre>
          )}
          <Box py="1rem">
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              spacing={4}
            >
              <Grid item xs={isSmall ? 12 : undefined}>
                <AppButtonLink
                  to="https://farirpgs.com/discord"
                  target="_blank"
                  color="secondary"
                  startIcon={<ChatIcon />}
                >
                  {t("home-route.sections.join-community.cta")}
                </AppButtonLink>
              </Grid>
            </Grid>
          </Box>
          <Box py="1rem">
            <Grid
              container
              justifyContent="space-between"
              spacing={4}
              alignItems="center"
            >
              <Grid item xs={isSmall ? 12 : undefined}>
                <Typography>
                  <Link
                    href="https://www.netlify.com"
                    target="_blank"
                    rel="noreferrer"
                    underline="hover"
                    color="secondary"
                  >
                    This site is powered by Netlify
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={isSmall ? 12 : undefined}>
                <Typography>
                  <AppLink
                    to="/changelog"
                    underline="always"
                    color="secondary"
                  >{`v${env.version}`}</AppLink>
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box py="1rem">
            <Grid
              container
              justifyContent="space-between"
              spacing={4}
              alignItems="center"
            >
              <Grid item xs={isSmall ? 12 : undefined}>
                <Kofi />
              </Grid>

              <Grid item>
                <Patreon />
              </Grid>
            </Grid>
          </Box>

          <Grid container justifyContent="center">
            <Grid item>
              <a
                href="https://farirpgs.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  alt="Made By Fari RPGs"
                  className={css({
                    width: "400px",
                    maxWidth: "100%",
                  })}
                  src={
                    theme.palette.mode === "dark"
                      ? Images.madeByFariRPGsWhite
                      : Images.madeByFariRPGsBlack
                  }
                />
              </a>
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Grid item xs>
              <Box mb=".5rem">
                <Typography variant="caption" align="justify">
                  The Fari RPGs, Fari App, Fari Games and Fari Community logos
                  were designed by Ron Müller.
                </Typography>
              </Box>
              <Box mb=".5rem">
                <Typography variant="caption" align="justify">
                  This site is not affiliated with Evil Hat Productions, LLC.
                </Typography>
              </Box>
              <Box mb=".5rem">
                <Typography variant="caption" align="justify">
                  This work is based on Fate Core System and Fate Accelerated
                  Edition (found at http://www.faterpg.com/), products of Evil
                  Hat Productions, LLC, developed, authored, and edited by
                  Leonard Balsera, Brian Engard, Jeremy Keller, Ryan Macklin,
                  Mike Olson, Clark Valentine, Amanda Valentine, Fred Hicks, and
                  Rob Donoghue, and licensed for our use under the Creative
                  Commons Attribution 3.0 Unported license
                  (http://creativecommons.org/licenses/by/3.0/).
                </Typography>
              </Box>
              <Box mb=".5rem">
                <Typography variant="caption" align="justify">
                  This work is based on Fate Condensed (found at
                  http://www.faterpg.com/), a product of Evil Hat Productions,
                  LLC, developed, authored, and edited by PK Sullivan, Lara
                  Turner, Leonard Balsera, Fred Hicks, Richard Bellingham,
                  Robert Hanz, Ryan Macklin, and Sophie Lagacé, and licensed for
                  our use under the Creative Commons Attribution 3.0 Unported
                  license (http://creativecommons.org/licenses/by/3.0/).
                </Typography>
              </Box>
              <Box mb=".5rem">
                <Typography variant="caption" align="justify">
                  The Fate Core font is © Evil Hat Productions, LLC and is used
                  with permission. The Four Actions icons were designed by
                  Jeremy Keller.
                </Typography>
              </Box>
              <Box mb=".5rem">
                <Typography variant="caption" align="justify">
                  Fari uses icons available at{" "}
                  <Link
                    href="http://game-icons.net"
                    target="_blank"
                    rel="noreferrer"
                    color={"secondary"}
                    underline="hover"
                  >
                    http://game-icons.net
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="https://icons8.com/icon/569/dice"
                    target="_blank"
                    color={"secondary"}
                    rel="noreferrer"
                    underline="hover"
                  >
                    Icons8
                  </Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item>
              <Box my=".5rem">
                <Link
                  href="https://www.iubenda.com/privacy-policy/97549620"
                  target="_blank"
                  rel="noreferrer"
                  data-cy="page.privacy-policy"
                  underline="hover"
                  color={"secondary"}
                >
                  {t("page.privacy-policy")}
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  function renderHeader() {
    const background = highlight.linearBackground;
    const color = highlight.color;
    return (
      <Box
        displayPrint="none"
        className={css({
          color: color,
          background: background,
          transition: theme.transitions.create(["color", "background"]),
        })}
      >
        <AppBar
          position="relative"
          className={css({
            color: "inherit",
            background: "inherit",
            boxShadow: "none",
            zIndex: zIndex.navBar,
          })}
        >
          <Box className={css({ padding: ".5rem 2.5rem" })}>
            <Toolbar
              className={css({
                margin: "0 auto",
                maxWidth: FariToolbarMaxWidth,
                minHeight: "72px",
                width: "100%",
                padding: "0",
                position: "relative",
                zIndex: zIndex.navBar,
              })}
            >
              <Box
                sx={{
                  textTransform: "none",
                  marginRight: "1rem",
                  textDecoration: "none",
                  display: props.hideHeaderLogo ? "none" : "inherit",
                }}
              >
                <NavLink to="/" data-cy="page.menu.home">
                  <Grid container wrap="nowrap" alignItems="center">
                    <Grid item sx={{ display: "flex" }}>
                      <img
                        alt="Fari"
                        className={css({
                          height: "3.5rem",
                          cursor: "pointer",
                        })}
                        src={Images.logoWhiteSvg}
                      />
                    </Grid>
                    <Grid item sx={{ display: "flex" }}>
                      <Typography
                        noWrap
                        className={css({
                          color: "#fff",
                          whiteSpace: "nowrap",
                          fontSize: "1.1rem",
                          fontWeight: theme.typography.fontWeightBold,
                        })}
                      >
                        Fari{" "}
                        <Typography
                          component="span"
                          className={css({
                            fontSize: "1.1rem",
                            fontWeight: theme.typography.fontWeightRegular,
                          })}
                        >
                          App
                        </Typography>
                      </Typography>
                    </Grid>
                  </Grid>
                </NavLink>
              </Box>

              <Hidden mdDown>{renderMenu(false)}</Hidden>
              <Hidden mdUp>
                {!isLive && (
                  <IconButton
                    color="inherit"
                    className={css({ padding: "0" })}
                    onClick={() => {
                      setMenuOpen(true);
                    }}
                    size="large"
                  >
                    <MenuIcon color="inherit" />
                  </IconButton>
                )}
              </Hidden>
              <Drawer
                anchor="bottom"
                classes={{
                  paper: css({
                    maxHeight: "80vh",
                  }),
                }}
                open={menuOpen}
                onClose={() => {
                  setMenuOpen(false);
                }}
              >
                <Box
                  p="1.5rem"
                  color={"#fff"}
                  bgcolor={theme.palette.primary.main}
                >
                  {renderMenu(true)}
                </Box>
              </Drawer>
              <Typography
                className={css({
                  flex: "1 1 auto",
                })}
              />
              <Hidden mdDown>
                {!shouldDisplayRejoinButton && (
                  <Box width="250px">
                    <Patreon />
                  </Box>
                )}
              </Hidden>
              {shouldDisplayRejoinButton && (
                <ThemeProvider theme={highlight.highlightTheme}>
                  <Button
                    color="primary"
                    onClick={() => {
                      history.push(`/play/${gameId}`);
                    }}
                    variant={"outlined"}
                    className={css({
                      minWidth: "10rem",
                    })}
                  >
                    <Typography variant="button" noWrap>
                      Rejoin&nbsp;Game
                    </Typography>
                  </Button>
                </ThemeProvider>
              )}
            </Toolbar>
          </Box>
        </AppBar>
      </Box>
    );
  }

  function renderMenu(mobile: boolean) {
    const itemClass = mobile
      ? css({ textAlign: "center" })
      : css({ flex: "0 1 auto" });

    const smSize = 8;
    const xsSize = 12;

    return (
      <Grid
        container
        spacing={3}
        justifyContent={mobile ? "center" : undefined}
        alignItems="center"
      >
        {!isLive && (
          <>
            <Grid item xs={xsSize} sm={smSize} className={itemClass}>
              <NavLink
                data-cy="page.menu.my-binder"
                onClick={() => {
                  myBinderManager.actions.open();
                }}
              >
                {t("menu.my-binder")}
              </NavLink>
            </Grid>
            <Grid item xs={xsSize} sm={smSize} className={itemClass}>
              <NavLinkCategory
                label={t("menu.tools")}
                data-cy="page.menu.tools"
                subNav={[
                  {
                    label: t("menu.tools"),
                    links: [
                      {
                        to: "/data",
                        label: t("menu.data"),
                        icon: <StorageIcon />,
                      },
                      {
                        to: "/dice",
                        label: t("menu.dice"),
                        icon: <Icons.FateDice />,
                        ["data-cy"]: "page.menu.tools.dice",
                      },
                      {
                        to: "/dice-pool",
                        label: t("menu.dice-pool"),
                        icon: <Icons.ThrowDice />,
                      },
                      {
                        to: "/story-builder",
                        label: "Story Builder",
                        icon: <LocalLibraryIcon />,
                      },
                      {
                        to: "/story-dice",
                        label: "Story Dice",
                        icon: <CasinoIcon />,
                      },
                      {
                        to: "/oracle",
                        label: t("menu.oracle"),
                        icon: <Icons.EyeIcon />,
                      },
                    ],
                  },
                ]}
              />
            </Grid>
            <Grid item xs={xsSize} sm={smSize} className={itemClass}>
              <NavLinkCategory
                label={t("menu.resources")}
                subNav={[
                  {
                    label: "Fari",
                    links: [
                      {
                        to: "https://fari.canny.io/changelog",
                        label: t("menu.whats-new"),
                        icon: <FiberNewIcon />,
                        target: "_blank",
                      },
                      {
                        to: "/feature-requests",
                        label: t("menu.feature-requests"),
                        icon: <EmojiObjectsIcon />,
                      },
                      {
                        to: "/bugs",
                        label: t("menu.report-a-bug"),
                        icon: <BugReportIcon />,
                      },
                      {
                        to: "https://farirpgs.com/discord",
                        label: t("menu.discord"),
                        icon: <ForumIcon />,
                        target: "_blank",
                      },
                    ],
                  },
                  {
                    label: "Documents",
                    links: [
                      {
                        to: "https://fari.games/en/resources/fari-rpgs/fari-app-wiki",
                        label: t("menu.fari-wiki"),
                        icon: <InfoIcon />,
                      },
                    ],
                  },
                  {
                    label: "Support",
                    links: [
                      {
                        to: "https://www.patreon.com/bePatron?u=43408921",
                        label: t("menu.patreon"),
                        icon: <ThumbUpIcon />,
                        target: "_blank",
                      },
                      {
                        to: "https://ko-fi.com/rpdeshaies",
                        label: t("menu.ko-fi"),
                        icon: <LocalCafeIcon />,
                        target: "_blank",
                      },
                      {
                        to: "https://github.com/fariapp/fari",
                        label: t("menu.github"),
                        icon: <GitHubIcon />,
                        target: "_blank",
                      },
                    ],
                  },
                ]}
              />
            </Grid>
          </>
        )}

        <Grid item xs={xsSize} sm={smSize} className={itemClass}>
          <NavLinkCategory
            data-cy="page.menu.languages"
            tooltip={t("menu.languages")}
            label={<TranslateIcon />}
          >
            <Box>
              <Select
                fullWidth
                native
                value={currentLanguage}
                inputProps={{
                  ["data-cy"]: "app.languages",
                }}
                onChange={(e) => {
                  const newLanguage = e.target.value as string;
                  i18n.changeLanguage(newLanguage);
                  logger.setTag("language", newLanguage);
                }}
                variant="standard"
              >
                {Object.keys(PossibleLanguagesNames).map((languageKey) => {
                  const shouldRenderDev = languageKey === "dev" && env.isDev;
                  if (languageKey !== "dev" || shouldRenderDev) {
                    return (
                      <option key={languageKey} value={languageKey}>
                        {
                          PossibleLanguagesNames[
                            languageKey as IPossibleLanguages
                          ]
                        }
                      </option>
                    );
                  }
                })}
              </Select>
            </Box>
          </NavLinkCategory>
        </Grid>

        <Grid item xs={xsSize} sm={smSize} className={itemClass}>
          <NavLink
            data-cy="page.use-theme-from-system-preferences"
            tooltip={t("menu.use-theme-from-system-preferences")}
            onClick={() => {
              settingsManager.actions.setThemeMode(undefined);
            }}
          >
            <ComputerIcon />
          </NavLink>
        </Grid>
        <Grid item xs={xsSize} sm={smSize} className={itemClass}>
          <NavLink
            data-cy="page.toggle-dark-mode"
            tooltip={t("menu.toggle-theme")}
            onClick={() => {
              if (settingsManager.state.themeMode === "dark") {
                settingsManager.actions.setThemeMode("light");
              } else {
                settingsManager.actions.setThemeMode("dark");
              }
            }}
          >
            {settingsManager.state.themeMode === "dark" ? (
              <LightModeIcon />
            ) : (
              <DarkModeIcon />
            )}
          </NavLink>
        </Grid>
        <Grid item xs={xsSize} sm={smSize} className={itemClass}>
          <NavLink
            tooltip={t("menu.whats-new")}
            onClick={() => {
              // ignore
            }}
          >
            <CannyChangelog mobile={mobile} />
          </NavLink>
        </Grid>
      </Grid>
    );
  }
};
