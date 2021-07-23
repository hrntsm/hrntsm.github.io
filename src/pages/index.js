import React from "react"

import LandingBio from "../components/landing-bio"
import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO
      title="Home"
      keywords={[`Rhinoceros`, `Grasshopper`, `Rhino`, `Grasshopper3d`]}
    />
    <LandingBio />
  </Layout>
)

export default IndexPage
