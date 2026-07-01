import fs from "node:fs";
import path from "node:path";

type PackageJson = Record<"dependencies" | "devDependencies", Record<string, string> | undefined>;

const hasPackageJSON = (root: string) => {
  return fs.existsSync(path.resolve(root, "package.json"));
};

const searchForPackageRoot = (current: string, root: string = current): string => {
  if (hasPackageJSON(current)) {
    return path.resolve(root, "package.json");
  }

  const dir = path.dirname(current);

  if (!dir || dir === current) {
    return path.resolve(root, "package.json");
  }

  return searchForPackageRoot(dir, root);
};

const hasDependency = (name: string): boolean => {
  const pkgPath = searchForPackageRoot(process.cwd());

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8")) as PackageJson;

  return !!pkg.dependencies?.[name] || !!pkg.devDependencies?.[name];
};

export default hasDependency("vue");
