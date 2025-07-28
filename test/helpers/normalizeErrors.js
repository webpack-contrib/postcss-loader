import stripAnsi from "strip-ansi";

function removeCWD(str) {
  const isWin = process.platform === "win32";
  let cwd = process.cwd();

  if (isWin) {
    str = str.replaceAll("\\", "/");

    cwd = cwd.replaceAll("\\", "/");
  }

  return stripAnsi(str)
    .replace(/\(from .*?\)/, "(from `replaced original path`)")
    .replaceAll(new RegExp(cwd, "g"), "");
}

export default (errors, shortError) =>
  errors.map((error) => {
    let errorMessage = error.toString();

    if (shortError) {
      errorMessage = errorMessage.split("\n").slice(0, 2).join("\n");
    }

    return removeCWD(errorMessage.split("\n").slice(0, 12).join("\n"));
  });
