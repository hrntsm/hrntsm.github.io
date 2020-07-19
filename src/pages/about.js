import React from "react"
import { Link, graphql } from "gatsby"
import { css } from "@emotion/core"
import styled from "@emotion/styled"

import Layout from "../components/layout"
import SEO from "../components/seo"

const Content = styled.div`
  margin: 0 auto;
  max-width: 860px;
  padding: 1.45rem 1.0875rem;
`

const ArticleDate = styled.h5`
  display: inline;
  color: #606060;
`

const MarkerHeader = styled.h3`
  display: inline;
  border-radius: 1em 0 1em 0;
  background-image: linear-gradient(
    -100deg,
    rgba(255, 250, 150, 0.15),
    rgba(255, 250, 150, 0.8) 100%,
    rgba(255, 250, 150, 0.25)
  );
`

const ReadingTime = styled.h5`
  display: inline;
  color: #606060;
`

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <SEO title="About" />
      <Content>
        <h1>About</h1>
        <p>
          ちょっと間違った建築の未来を探してます。<br/>
          Looking for the future of architecture that is slightly out from the norm.
        </p>
        <MarkerHeader>Profile</MarkerHeader>
        <p>
          Freelance<br/>
          Live in Tokyo<br/>
        </p>
        <MarkerHeader>Interest</MarkerHeader>
        <p>
          Connect between structure, geometry and XR.
        </p>
        <MarkerHeader>Skills</MarkerHeader>
        <p>
          C#、Python<br/>
          Unity、Rhinoceros、Grasshopper<br/>
          Creating VR content<br/>
          Operating Vtuber <br/>
          一級建築士
        </p>
        <MarkerHeader>Works</MarkerHeader>
        <h4>Software</h4>
        <h5>MISE (Grasshopper Component)</h5>
        <a href={"https://www.food4rhino.com/app/mise"}>
          <img src={"https://static.food4rhino.com/s3fs-public/users-files/hironrgkr/app/kiyaputiya.png"} alt="MISE" />
        </a>
        <p>Miseは、梁理論にもとづいて梁の応力と変形、建築学会基準による許容応力度計算を行います。<br/>
          <a href={"https://www.food4rhino.com/app/mise"}>
              more information
          </a>
        </p>
        <h5>STEVIA (Made with Unity)</h5>
        <a href={"https://github.com/hrntsm/STEVIA-Stb2U/wiki"}>
          <img src={"https://pbs.twimg.com/media/EbcCYv0U4AI3yrY?format=jpg&name=medium"} alt={"STEVIA"}/>
        </a>
        <p>
          建築構造BIMデータのST-Bridgeのビューアー。<br/>
          VRにも対応しVRMを読み込むことでアバターを使って建築を見ることができる建築構造系唯一のVRM対応ソフトです。（自分調べ）<br/>
          <a href={"https://github.com/hrntsm/STEVIA-Stb2U/wiki"}>
            more information
          </a>
        </p>
        <h4>Hands-on</h4>
        <h5>How to use RhinoInside.Unity</h5>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/9MHYbnm__MU" frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
        </iframe><br/>
        <p>
          RhinoInsideをUnityで使うための導入についてのハンズオンのアーカイブです。
        </p>
        <MarkerHeader>Contact</MarkerHeader>
        <p>
          <a href="https://twitter.com/hiron_rgkr">Twitter DM</a><br/>
          or Mail: contact(a)hrntsm.com (change (a) to @)
        </p>
        <MarkerHeader>History</MarkerHeader>
        <p>
          2020~ フリーランス<br/>
          ~2019 組織設計事務所 構造設計部勤務
        </p>
      </Content>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { eq: false } } }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
            rawDate: date
            path
          }
          fields {
            slug
            readingTime {
              text
            }
          }
          excerpt
        }
      }
    }
  }
`
