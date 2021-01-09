import { css } from "@emotion/css";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import useTheme from "@material-ui/core/styles/useTheme";
import Typography from "@material-ui/core/Typography";
import HelpIcon from "@material-ui/icons/Help";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import React from "react";
import { AppLink } from "../../components/AppLink/AppLink";
import { FateLabel } from "../../components/FateLabel/FateLabel";
import { Heading } from "../../components/Heading/Heading";
import { Page } from "../../components/Page/Page";
import { PageMeta } from "../../components/PageMeta/PageMeta";
import accelerated from "./images/accelerated.jpg";
import bookImage from "./images/books.jpeg";
import condensed from "./images/condensed.jpg";
import core from "./images/core.jpg";
import seelieSquireImage from "./images/seelie-squire.png";

export const SrdsRoute: React.FC = (props) => {
  return (
    <Page>
      <PageMeta
        title="Fate System Reference Documents (SRDs)"
        description="Read and search through the Fate System Reference Documents (SRDs) with ease using Fari, The Fate Companion App"
      />
      <Container maxWidth="md">
        <Heading
          icon={MenuBookIcon}
          title={"Fate System Reference Documents (SRDs)"}
          subtitle="Select a Fate variation to get started"
        />
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <SrdCard
              title="Fate Condensed"
              description={
                <>
                  The latest version of the Fate System.
                  <br />
                  <strong>Compact, stand-alone and streamlined</strong> for
                  clarity and ease of reference.
                </>
              }
              bgColor="#007fda"
              imageSrc={condensed}
              link="/srds/condensed"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SrdCard
              title="Fate Core"
              description={
                <>
                  A <strong>Complete guide to Fate</strong> with rules, examples
                  and tips. A most if your thirst for knowledge was not
                  satisfied with Fate Condensed.
                </>
              }
              bgColor="#00409d"
              imageSrc={core}
              link="/srds/core"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SrdCard
              title="Fate Accelerated"
              description={
                <>
                  If you want to <strong>get started quickly</strong>, this
                  dialed-down version of Fate Core will get you going in no
                  time.
                </>
              }
              bgColor="#005aba"
              imageSrc={accelerated}
              link="/srds/accelerated"
            />
          </Grid>
        </Grid>
        <Box pt="1rem" />
        <Heading icon={HelpIcon} title={"Other Resources"} />
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <SrdCard
              title="Book of Monsters"
              description={
                <>
                  Brought to you by <strong>Seelie Squire</strong>, this is
                  ultimate resource if you are looking for the closest thing to
                  a Fate Compendium.
                </>
              }
              bgColor="#3c5c39"
              imageSrc={seelieSquireImage}
              link="/seelie-squire"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SrdCard
              title="Fate Stunts"
              description={
                <>
                  A big list of stunt examples to get you started with character
                  creation.
                </>
              }
              bgColor="#223031"
              imageSrc={bookImage}
              link="/fate-stunts"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SrdCard
              title="The Big List of RPG Plots"
              description={
                <>
                  A big list of stunt examples to get you started with character
                  creation.
                </>
              }
              bgColor="#3f4947"
              imageSrc={`https://images.unsplash.com/photo-1557218351-1a230b6e5650?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80`}
              link="/the-big-list-of-rpg-plots"
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};
SrdsRoute.displayName = "SrdsRoute";

export const SrdCard: React.FC<{
  title: string | JSX.Element;
  description: string | JSX.Element;
  bgColor?: string;
  imageSrc?: string;
  link: string;
}> = (props) => {
  const theme = useTheme();
  const backgroundColor = props.bgColor ?? theme.palette.background.paper;
  const color = theme.palette.getContrastText(backgroundColor);

  return (
    <Card
      className={css({
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: backgroundColor,
      })}
    >
      <Box height="100%">
        <AppLink to={props.link}>
          <CardMedia
            image={props.imageSrc ?? ""}
            title={props.title as string}
            className={css({
              "height": "8rem",
              "mask-image":
                "linear-gradient(to bottom, black 50%, transparent 100%)",
            })}
          />
        </AppLink>
        <CardContent className={css({ height: "100%" })}>
          <Box pb="1rem">
            <Typography gutterBottom variant="h5" component="h2">
              <AppLink to={props.link}>
                <FateLabel textColor={color} underline>
                  {props.title}
                </FateLabel>
              </AppLink>
            </Typography>
            <Typography
              variant="body2"
              component="p"
              className={css({ color: color })}
            >
              {props.description}
            </Typography>
          </Box>
        </CardContent>
      </Box>
      {/* <CardActions className={css({ flex: "1 0 auto" })}>
        <Grid container justify="flex-end" alignItems="flex-end">
          <Grid item>
            <AppButtonLink to={props.link} className={css({ color: color })}>
              {"Read"}
            </AppButtonLink>
          </Grid>
        </Grid>
      </CardActions> */}
    </Card>
  );
};
