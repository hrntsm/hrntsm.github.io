(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{t9sR:function(t,e,n){"use strict";n.r(e);n("q1tI");var a=n("Wbzz"),o=n("vrFN"),r=n("Bl7J"),i=n("qKvR");e.default=function(t){var e=t.pageContext,n=t.data,c=e.tag,l=n.allMarkdownRemark,s=l.edges,p=l.totalCount,b=p+" post"+(1===p?"":"s")+' tagged with "'+c+'"';return Object(i.b)(r.a,null,Object(i.b)(o.a,{title:c}),Object(i.b)("div",null,Object(i.b)("h1",null,b),Object(i.b)("ul",null,s.map((function(t){var e=t.node,n=e.frontmatter.path,o=e.frontmatter.title;return Object(i.b)("li",{key:n},Object(i.b)(a.Link,{to:n},o))}))),Object(i.b)(a.Link,{to:"/article-tags"},"All tags")))}},vrFN:function(t,e,n){"use strict";n("q1tI");var a=n("TJpk"),o=n("Wbzz"),r=n("qKvR");function i(t){var e=t.description,n=t.lang,i=t.meta,c=t.keywords,l=t.title,s=t.image,p=Object(o.useStaticQuery)("32046230").site,b=e||p.siteMetadata.description;return Object(r.b)(a.Helmet,{htmlAttributes:{lang:n},title:l,titleTemplate:"%s | "+p.siteMetadata.title,meta:[{name:"description",content:b},{property:"og:title",content:l},{property:"og:image",content:s||p.siteMetadata.image},{property:"og:description",content:b},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:p.siteMetadata.author},{name:"twitter:title",content:l},{name:"twitter:description",content:b}].concat(c.length>0?{name:"keywords",content:c.join(", ")}:[]).concat(i)})}i.defaultProps={lang:"ja",meta:[],keywords:[]},e.a=i}}]);
//# sourceMappingURL=component---src-templates-article-tags-js-a2a6a9eb33c317eea28b.js.map