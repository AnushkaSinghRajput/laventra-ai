import path from "node:path"
import { fileURLToPath } from "node:url"
import type { NextConfig } from "next"

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  // Prefer this app when multiple lockfiles exist higher in the tree
  turbopack: { root: projectRoot },
}

export default nextConfig
