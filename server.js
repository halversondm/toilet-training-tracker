/* eslint no-console: 0 */
import path from "path";
import express from "express";
import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import config from "./webpack.config.js";
import morgan from "morgan";
import bodyParser from "body-parser";

const isDeveloping = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 80;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

if (isDeveloping) {
  console.log("Running the 'hot' version of the code");
  const compiler = webpack(config);

  app.use(webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: "src",
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  }));

  app.use(webpackHotMiddleware(compiler));
} else {
  console.log("Running the 'production' version of the code");
  app.use(express.static(__dirname + "/dist"));
}

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.listen(port, "localhost", (err) => {
  if (err) {
    console.log(err);
  }
  console.info("==> Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
});
