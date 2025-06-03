const fs = require('fs');
const Path = require("path");
const sass = require("sass"); // Dart Sass

const outputFile = Path.resolve("src/lib/global.css");

fs.mkdirSync(Path.dirname(outputFile), { recursive: true });

const getComponents = () => {
  let allComponents = [];
  const types = ["atoms", "molecules", "organisms"];

  types.forEach((type) => {
    const allFiles = fs.readdirSync(`src/${type}`).map((file) => ({
      input: `src/${type}/${file}`,
      output: `src/lib/${file.slice(0, -4) + "css"}`,
    }));

    const newFile = fs.readdirSync(`src/${type}`).map((file) => {
      console.log("Type:", type, "File:", file);
      return {
        input: `src/${type}/${file}`,
        output: `src/lib/${file.slice(0, -4) + "css"}`,
      };
    });
    console.log("Print newFile", newFile);
    allComponents = [...allComponents, ...allFiles];
  });

  return allComponents;
};

const compile = (path, fileName) => {
  sass.render(
    {
      file: "src/global.scss",
      outputStyle: "expanded",
      includePaths: [Path.resolve("src")],
    },
    (err, result) => {
      if (err) {
        console.error("Sass compilation failed:", err);
        process.exit(1);
      } else {
        fs.writeFileSync(Path.resolve(fileName), result.css.toString());
        console.log("✅ SCSS compiled successfully →", outputFile);
      }
    }
  );
};

compile("src/global.scss", "src/lib/global.css");
console.log(getComponents());

getComponents().forEach((component) => {
  compile(component.input, component.output);
});