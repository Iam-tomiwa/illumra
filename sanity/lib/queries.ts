import { defineQuery, groq } from "next-sanity";

// Reusable SEO query fragment to avoid duplication
const seoFields = `
	seo{
		title,
		titleTemplate,
		description,
		keywords,
		siteUrl,
		ogImage{
			source,
			altText,
			externalUrl,
			image{
				asset,
				crop,
				hotspot
			}
		},
		favicon{
			source,
			altText,
			externalUrl,
			image{
				asset,
				crop,
				hotspot
			}
		},
		twitterCard,
		twitterSite,
		twitterCreator,
		locale
	}
`;

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
	logo{
		source,
		altText,
		externalUrl,
		image{
			asset,
			crop,
			hotspot
		}
	},
	ctaButton{
		label,
		href,
		icon
	},
	${seoFields}
}`);

export const homePageQuery = defineQuery(`
  *[_type == "homePage"][0]{
    hero{
      visible,
      attentionLabel,
      attentionIcon,
      headline,
      summary,
      primaryAction{
        label,
        href,
        icon
      },
      secondaryAction{
        label,
        href,
        icon
      },
      backgroundImage{
        source,
        altText,
        externalUrl,
        image{
          asset,
          crop,
          hotspot
        }
      }
    },
    controlSolutions{
      visible,
      title,
      subtitle,
      features[]{
        icon,
        title,
        description,
        url
      }
    },
    trustedBy{
      visible,
      heading,
      logos[]{
        name,
        href,
        logo{
          source,
          altText,
          externalUrl,
          image{
            asset,
            crop,
            hotspot
          }
        }
      }
    },
    about{
      visible,
      title,
      body[]{
        ...,
        children[]{
          ...
        }
      },
      cta{
        label,
        href,
        icon
      },
      background{
        source,
        altText,
        externalUrl,
        image{
          asset,
          crop,
          hotspot
        }
      },
      features[]{
        icon,
        title,
        description
      }
    },
    featuredProductsVisible,
    testimonialsVisible,
    testimonials[]{
      author->{
        "name": coalesce(name, "Anonymous"),
        picture{
          source,
          altText,
          externalUrl,
          image{
            asset,
            crop,
            hotspot
          }
        },
        role
      },
      testimony,     
    },
    projectsVisible,
    projectsHeading,
    projectsSubheading,
    projects[]{
      picture{
        source,
        altText,
        externalUrl,
        image{
          asset,
          crop,
          hotspot
        }
      },
      title,
      projectCategory,
      url
    },
    cta{
      visible,
      title,
      description,
      action{
        label,
        href,
        icon
      }
    },
    ${seoFields}
  }
`);

export const projectsQuery = defineQuery(`
  *[_type == "homePage"][0].projects[]{
    picture{
      source,
      altText,
      externalUrl,
      image{
        asset,
        crop,
        hotspot
      }
    },
    title,
    projectCategory,
    url
  }
`);

export const ctaSectionQuery = defineQuery(`
  *[_type == "homePage"][0]{
   cta{
      visible,
      title,
      description,
      action{
        label,
        href,
        icon
      }
    }
  }
  `);

export const categoryQuery = defineQuery(`
  *[_type == "productCategory"] {
    _id,
    "slug": slug.current,
    title,
    description
  } | order(_createdAt desc)  
`);

export const productFrequencyQuery = defineQuery(`
  *[_type == "productFrequency"] {
    _id,
    "value": value,
    label
  } | order(_createdAt desc)  
`);

export const productProtocolQuery = defineQuery(`
  *[_type == "productProtocol"] {
    _id,
    "value": value,
    label
  } | order(_createdAt desc)
`);
export const productVoltageQuery = defineQuery(`
  *[_type == "productVoltage"] {
    _id,
    "value": value,
    label
  } | order(_createdAt desc)
`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{
    "name": coalesce(name, "Anonymous"),
    picture{
      source,
      altText,
      externalUrl,
      image{
        asset,
        crop,
        hotspot
      }
    },
    role
  },
  ${seoFields},
`;

export const heroQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0] {
    content,
    ${postFields}
  }
`);

export const moreStoriesQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content,
    ${postFields}
  }
`);

export const productsQuery = /* groq */ `
   _id,
    title,
    "slug": slug.current,
    shortDescription,
    "image": images[0]{ 
        source,
        altText,
        externalUrl,
        image{
          asset,
          crop,
          hotspot
        }
    },
    "categories": categories[]->slug.current,
    "category": categories[0]->slug.current,
    "sku": sku,
     colors[]{
      name,
      partNumber,
      hex
    },
`;
export const featuredProductsQuery = defineQuery(`
  *[_type == "product" && featureTag == "featured"]{
   ${productsQuery}
  } | order(_createdAt desc)[0...8]
`);

export const relevantProductsQuery = defineQuery(`
  *[_type == "product" && count((categories[]->slug.current)[@ == $category]) > 0 && _id != $excludeId]{
   ${productsQuery}
  } | order(_createdAt desc)[0...4]
`);

export const allProductsQuery = defineQuery(`
  *[_type == "product"]{
   ${productsQuery}
  } | order(_createdAt desc)
`);

export const FILTERED_PRODUCTS_COUNT_QUERY = defineQuery(`
  count(
    *[
      _type == "product" &&
      (
        !defined($search) ||
        $search == "" ||
        coalesce(title, "") match $searchWildcard ||
        coalesce(sku.current, "") match $searchWildcard
      ) &&
      (
        !defined($category) ||
        $category == "" ||
        count((categories[]->slug.current)[@ == $category]) > 0
      ) &&
      (
        !defined($voltages) ||
        count($voltages) == 0 ||
        voltage->value in $voltages
      ) &&
      (
        !defined($frequencies) ||
        count($frequencies) == 0 ||
        frequency->value in $frequencies
      ) &&
      (
        !defined($protocols) ||
        count($protocols) == 0 ||
        count((protocols[]->value)[@ in $protocols]) > 0
      )
    ]
  )
  `);

export const PRODUCT_QUERY = defineQuery(`
    *[_type == "product" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      sku,
      shortDescription,
      body[]{
        ...,
        children[]{
          ...
        }
      },
      "categories": categories[]->{
        _id,
        title,
        "slug": slug.current
      },
      "category": categories[0]->{
        _id,
        title,
        "slug": slug.current
      },
      "voltage": voltage->{ _id, label, value },
      "frequency": frequency->{ _id, label, value },
      "protocols": protocols[]->{ _id, label, value },
      featureTag,
      colors[]{
        name,
        partNumber,
        hex
      },
      images[]{
        source,
        altText,
        externalUrl,
        image{
          asset,
          crop,
          hotspot
        }
      },
      videos[]{
        title,
        externalUrl
      },
      specifications[defined(label) && defined(value)]{
        _type,
        label,
        value
      },
      downloads[defined(title)]{
        _type,
        title,
        file{
          asset->{
            _id,
            url,
            originalFilename,
            size
          }
        },
        externalUrl
      },
      applications[defined(url)]{
        _type,
        title,
        url
      },
      wiringDiagrams[defined(title)]{
        _type,
        title,
        file{
          asset->{
            _id,
            url,
            originalFilename,
            size
          }
        },
        externalUrl
      },
      seo{
        title,
        titleTemplate,
        description,
        keywords,
        siteUrl,
        ogImage{
          source,
          altText,
          externalUrl,
          image{
            asset,
            crop,
            hotspot
          }
        },
        favicon{
          source,
          altText,
          externalUrl,
          image{
            asset,
            crop,
            hotspot
          }
        },
        twitterCard,
        twitterSite,
        twitterCreator,
        locale
      }
    }
    `);

export const aboutPageQuery = defineQuery(`*[_type == "aboutPage"][0]{
      backgroundImage{
        source,
        altText,
        externalUrl,
        image{
          asset,
          crop,
        }
      },
      featuresTitle,
      features[]{
        icon,
        title,
        description
      },
      becomeADistributor{
        title,
        description,
        email
      },
      becomeARep{
        title,
        description[]{
          ...,
          children[]{
            ...
          }
        },
        button{
          label,
          href,
          icon
        }
      },
      enoceanVisible,
      enoceanTitle,
      enoceanDescription,
      enoceanAction{
        label,
        href,
        icon
      },
      enoceanImage{
        source,
        altText,
        externalUrl,
        image{
          asset,
          crop,
          hotspot
        }
      },
    companyInfo{
      visible,
      overviewTitle,
      overview[]{
        ...,
        children[]{
          ...
        }
      },
      email,
      phone,
      headquarters,
      satelliteOffice
    },
    seo{
      title,
      titleTemplate,
      description,
      keywords,
      siteUrl,
      ogImage{
        source,
        altText,
        externalUrl,
        image{
          asset,
          crop,
          hotspot
        }
      },
      favicon{
        source,
        altText,
        externalUrl,
        image{
          asset,
          crop,
          hotspot
        }
      },
      twitterCard,
      twitterSite,
      twitterCreator,
      locale
    }
  }`);

export const PRODUCTS_WITH_VIDEOS_QUERY = defineQuery(`
  *[_type == "product" && count(videos[defined(externalUrl)]) > 0]{
    _id,
    title,
    "slug": slug.current,
    "productUrl": "/products/" + slug.current,
    videos[]{
      title,
      externalUrl
    }
  } | order(_createdAt desc)
`);

export const STORES_QUERY = defineQuery(`
  *[_type == "store"] | order(name asc) {
    _id,
    name,
    storeType,
    address,
    city,
    state,
    zipCode,
    country,
    phone,
    email,
    website,
    location
  }
`);

export const FAQ_QUERY = defineQuery(`
  *[_type == "faq"][0]{
    visible,
    title,
    description,
    items[]{
      group,
      question,
      answer
    },
    ${seoFields}
  }
`);

export const becomeARepQuery = defineQuery(`
  *[_type == "aboutPage"][0].becomeARep{
    title,
    description[]{
      ...,
      children[]{
        ...
      }
    },
    button{
      label,
      href,
      icon
    }
  }
`);

export const becomeADistributorQuery = defineQuery(`
  *[_type == "aboutPage"][0].becomeADistributor{
    title,
    description,
    email
  }
`);

export const caseStudiesPageQuery =
  defineQuery(`*[_type == "caseStudiesPage"][0]{
	backgroundImage{
		source,
		altText,
		externalUrl,
		image{
			asset,
			crop,
			hotspot
		}
	},
	pageTitle,
	description,
	${seoFields}
}`);

export const distributorsPageQuery =
  defineQuery(`*[_type == "distributorsPage"][0]{
	backgroundImage{
		source,
		altText,
		externalUrl,
		image{
			asset,
			crop,
			hotspot
		}
	},
	pageTitle,
	description,
	${seoFields}
}`);

export const contactPageQuery = defineQuery(`*[_type == "contactPage"][0]{
	quoteFormTitle,
	quoteFormDescription,
	contactFormTitle,
	contactFormDescription,
	${seoFields}
}`);

export const legalQuery =
  defineQuery(`*[_type == "legal" && slug.current == $slug][0]{
	_id,
	title,
	"slug": slug.current,
	_updatedAt,
	content[]{
		...,
		children[]{
			...
		},
		_type == "contentImage" => {
			_type,
			_key,
			media{
				source,
				altText,
				externalUrl,
				image{
					asset,
					crop,
					hotspot
				}
			},
			caption
		}
	},
	${seoFields}
}`);

export const legalSlugsQuery = defineQuery(
  `*[_type == "legal" && defined(slug.current)]{"slug": slug.current, title}`
);
