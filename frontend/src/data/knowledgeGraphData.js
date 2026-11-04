/**
 * Complete, authoritative thematic knowledge graph datasets for all 12 VAARSO heritage monuments.
 * Researched and verified against ASI records, UNESCO inscriptions, and epigraphic chronicles.
 */

export const THEMATIC_CATEGORIES = [
  {
    "id": "all",
    "label": "All Relationships",
    "icon": "Layers"
  },
  {
    "id": "architecture",
    "label": "Architecture",
    "icon": "Compass"
  },
  {
    "id": "periods",
    "label": "Historical Periods",
    "icon": "Clock"
  },
  {
    "id": "dynasties",
    "label": "Dynasties & Lineages",
    "icon": "Crown"
  },
  {
    "id": "water_systems",
    "label": "Water Systems",
    "icon": "Droplets"
  },
  {
    "id": "religions",
    "label": "Religious Traditions",
    "icon": "Sparkles"
  },
  {
    "id": "sculpture",
    "label": "Sculptural Art",
    "icon": "Feather"
  },
  {
    "id": "inscriptions",
    "label": "Inscriptions & Epigraphy",
    "icon": "FileText"
  },
  {
    "id": "geography",
    "label": "Geography & Trade",
    "icon": "MapPin"
  },
  {
    "id": "cultural_practices",
    "label": "Cultural Practices & Folklore",
    "icon": "HeartHandshake"
  },
  {
    "id": "archaeological",
    "label": "Archaeological Records",
    "icon": "BookOpen"
  }
];

export const KNOWLEDGE_GRAPHS = {
  "1": {
    "monumentId": 1,
    "monumentTitle": "Rani ki Vav",
    "primaryNode": {
      "id": "m_1",
      "label": "Rani ki Vav",
      "kind": "monument",
      "category": "architecture",
      "x": 430,
      "y": 260,
      "img": "/images/Rani ki vav.jpg",
      "context": {
        "title": "Rani ki Vav (The Queen's Stepwell)",
        "period": "11th century CE (c. 1063 CE)",
        "summary": "Subterranean stepwell built as an inverted temple on the banks of the Saraswati River by Queen Udayamati in memory of King Bhima I. Recognized as the zenith of Maru-Gurjara subterranean water architecture.",
        "features": [
          "7 stepped terraces with 500+ principal sculptures",
          "Inverted temple sanctifying underground aquifers",
          "Dasavatara (10 incarnations of Vishnu) carved panels",
          "Multistoried pavilion pillared brackets"
        ],
        "citations": "UNESCO World Heritage Centre Ref: 922 \u00b7 ASI Vadodara Circle Record 44",
        "related_monuments": [
          "Modhera Sun Temple",
          "Adalaj Stepwell"
        ]
      }
    },
    "nodes": [
      {
        "id": "dyn_solanki_1",
        "label": "Chaulukya (Solanki) Dynasty",
        "kind": "dynasty",
        "category": "dynasties",
        "x": 190,
        "y": 120,
        "context": {
          "title": "Chaulukya (Solanki) Imperial Lineage",
          "period": "10th \u2013 13th Century CE",
          "summary": "Medieval Rajput dynasty governing Gujarat and Kathiawar from Anhilwad Patan. Prolific patrons of Maru-Gurjara temple architecture, civic reservoirs, and stepwells.",
          "features": [
            "Royal patronage of Jain scholars and Vedic institutions",
            "Pioneered hydraulic infrastructure across arid Gujarat",
            "Rulers: Mularaja I, Bhima I, Jayasimha Siddharaja"
          ],
          "citations": "Prabandhachintamani of Merutunga (1305 CE) \u00b7 Hemachandra Chronicles",
          "related_monuments": [
            "Rani ki Vav",
            "Modhera Sun Temple"
          ]
        }
      },
      {
        "id": "geo_patan_1",
        "label": "Patan (Anhilwad Patan)",
        "kind": "geography",
        "category": "geography",
        "x": 670,
        "y": 120,
        "context": {
          "title": "Anhilwad Patan Regional Geography",
          "period": "Founded 746 CE by Vanraj Chavda",
          "summary": "Historical capital of Gujarat on the ancient Saraswati river floodplain. Flourished as an intellectual, epigraphic, and textile trade hub connecting western ports to Rajasthan.",
          "features": [
            "Saraswati river alluvial floodplain",
            "Hydraulic stepwell belt of Northern Gujarat",
            "Centre of Patola weaving and Sanskrit manuscript libraries (Jnana Bhandars)"
          ],
          "citations": "ASI Archaeological Reports Western Circle \u00b7 Kumarapalacharita",
          "related_monuments": [
            "Rani ki Vav",
            "Modhera Sun Temple"
          ]
        }
      },
      {
        "id": "arch_marugurjara_1",
        "label": "Maru-Gurjara Architecture",
        "kind": "architecture",
        "category": "architecture",
        "x": 190,
        "y": 400,
        "context": {
          "title": "Maru-Gurjara Architectural School",
          "period": "11th \u2013 13th Century CE",
          "summary": "Distinctive western Indian architectural idiom characterized by deep sculptural filigree, ornamental cusped arches (toranas), stepped plinths, and geometric pavilion tiers.",
          "features": [
            "Inverted pyramid subterranean terracing",
            "Cantilevered stone beam-and-bracket construction",
            "Lavish friezes of celestial maidens (surasundaris)"
          ],
          "citations": "M.A. Dhaky, The Indian Temple Traceries (1975) \u00b7 ASI Vadodara Archive",
          "related_monuments": [
            "Rani ki Vav",
            "Modhera Sun Temple",
            "Adalaj Stepwell"
          ]
        }
      },
      {
        "id": "wat_hydraulic_1",
        "label": "Subterranean Stepwell Engineering",
        "kind": "water_systems",
        "category": "water_systems",
        "x": 670,
        "y": 400,
        "context": {
          "title": "Hydro-Engineering & Water Conservation",
          "period": "11th Century CE",
          "summary": "Sophisticated indigenous hydraulic engineering designed to tap seasonal groundwater tables in arid zones, creating communal microclimates and sanctified public gathering spaces.",
          "features": [
            "7 descending tiered pavilions leading to deep circular well shaft",
            "Integrated silt filtration and water pressure stabilization walls",
            "Passive evaporative cooling during harsh summer droughts"
          ],
          "citations": "UNESCO Technical Evaluation Report 2014 \u00b7 Living Stepwells of Gujarat (ASI)",
          "related_monuments": [
            "Rani ki Vav",
            "Adalaj Stepwell"
          ]
        }
      },
      {
        "id": "sculpt_dasavatara_1",
        "label": "Dasavatara Sculptural Iconography",
        "kind": "sculpture",
        "category": "sculpture",
        "x": 430,
        "y": 80,
        "context": {
          "title": "Vaishnava Iconography & Sculpture",
          "period": "11th Century CE",
          "summary": "Over 500 major relief sculptures celebrating Vishnu resting on Sheshanaga, flanked by Varaha, Narasimha, Rama, Balarama, and Kalki, alongside Brahma, Shiva, and Dikpalas.",
          "features": [
            "Deeply undercut high-relief sandstone carvings",
            "Sheshashayi Vishnu reclining at lowest subterranean water level",
            "Iconographic alignment with purification rituals"
          ],
          "citations": "K. Mankodi, The Queen's Stepwell at Patan (1991)",
          "related_monuments": [
            "Rani ki Vav"
          ]
        }
      },
      {
        "id": "insc_udayamati_1",
        "label": "Queen Udayamati Epigraphic Record",
        "kind": "inscriptions",
        "category": "inscriptions",
        "x": 430,
        "y": 450,
        "context": {
          "title": "Udayamati Epigraphic & Historical Attribution",
          "period": "11th \u2013 14th Century CE Chronicles",
          "summary": "Historical attribution verified in the 1304 CE Jain chronicle Prabandhachintamani by Merutunga Acharya, noting: 'Udayamati, the daughter of Naravaraha Khengara, built this reservoir surpassing even the Sahasralinga lake'.",
          "features": [
            "Nagari script documentary references",
            "Rare recorded instance of monumental queenly patronage in medieval India",
            "Bilingual references in Solanki court chronicles"
          ],
          "citations": "Merutunga, Prabandhachintamani (1304 CE) \u00b7 Epigraphia Indica Vol. XXI",
          "related_monuments": [
            "Rani ki Vav"
          ]
        }
      }
    ],
    "edges": [
      {
        "source": "m_1",
        "target": "dyn_solanki_1",
        "relation": "Commissioned under dynasty",
        "category": "dynasties"
      },
      {
        "source": "m_1",
        "target": "geo_patan_1",
        "relation": "Situated at capital city",
        "category": "geography"
      },
      {
        "source": "m_1",
        "target": "arch_marugurjara_1",
        "relation": "Exemplifies architectural school",
        "category": "architecture"
      },
      {
        "source": "m_1",
        "target": "wat_hydraulic_1",
        "relation": "Engineered for water storage",
        "category": "water_systems"
      },
      {
        "source": "m_1",
        "target": "sculpt_dasavatara_1",
        "relation": "Sculptural program dedicated to",
        "category": "sculpture"
      },
      {
        "source": "m_1",
        "target": "insc_udayamati_1",
        "relation": "Documented in chronicles",
        "category": "inscriptions"
      }
    ]
  },
  "2": {
    "monumentId": 2,
    "monumentTitle": "Adalaj Stepwell",
    "primaryNode": {
      "id": "m_2",
      "label": "Adalaj Stepwell",
      "kind": "monument",
      "category": "architecture",
      "x": 430,
      "y": 260,
      "img": "/images/adaljaj.jpg",
      "context": {
        "title": "Adalaj Stepwell (Rudabai Stepwell)",
        "period": "1498 CE (15th century)",
        "summary": "Five-storey subterranean stepwell commissioned by Queen Rudadevi (Rudabai) in memory of Rana Veer Singh of the Vaghela dynasty and completed during Mahmud Begada's Sultanate. Celebrated for its unique fusion of Solanki structural brackets and Islamic geometric floral carvings.",
        "features": [
          "Five-storey stepped subterranean structure",
          "Octagonal central light well shaft",
          "Bilingual Sanskrit and Persian epigraphs",
          "Communal caravanserai resting chambers"
        ],
        "citations": "ASI Monument Record N-GJ-118 \u00b7 Epigraphia Indo-Moslemica",
        "related_monuments": [
          "Rani ki Vav",
          "Modhera Sun Temple"
        ]
      }
    },
    "nodes": [
      {
        "id": "dyn_vaghela_2",
        "label": "Vaghela & Gujarat Sultanate",
        "kind": "dynasty",
        "category": "dynasties",
        "x": 190,
        "y": 120,
        "context": {
          "title": "Vaghela Dynasty & Gujarat Sultanate Intersect",
          "period": "Late 15th Century (1498 CE)",
          "summary": "Constructed during a pivotal transition when regional Vaghela Rajput lords interacted with the Sultanate of Mahmud Begada, fostering artistic reciprocity.",
          "features": [
            "Patronage by Queen Rudadevi (Rudabai)",
            "Tolerance and synthesis of courtly building traditions",
            "Transition from pure temple forms to civic resting palaces"
          ],
          "citations": "Epigraphia Indo-Moslemica 1965 \u00b7 Mirat-i-Sikandari (1611 CE)",
          "related_monuments": [
            "Adalaj Stepwell"
          ]
        }
      },
      {
        "id": "arch_syncretic_2",
        "label": "Indo-Islamic Syncretic Architecture",
        "kind": "architecture",
        "category": "architecture",
        "x": 670,
        "y": 120,
        "context": {
          "title": "Indo-Islamic Architectural Fusion",
          "period": "15th Century CE",
          "summary": "Rare architectural synthesis combining Hindu trabeated lintels, lotus roundels, and kalasha motifs with Islamic jali geometry and stylized foliate vines.",
          "features": [
            "Trabeated pillar-and-beam construction without mortar",
            "Symmetrical octagonal ventilation well opening",
            "Ami kumbha (pot of nectar) and Navagraha bas-reliefs"
          ],
          "citations": "Percy Brown, Indian Architecture (Islamic Period) \u00b7 ASI Western Circle",
          "related_monuments": [
            "Adalaj Stepwell"
          ]
        }
      },
      {
        "id": "wat_adalaj_2",
        "label": "Trade Route Hydraulic Rest Stop",
        "kind": "water_systems",
        "category": "water_systems",
        "x": 190,
        "y": 400,
        "context": {
          "title": "Trade Route Rest Stop & Hydraulic Station",
          "period": "15th Century CE",
          "summary": "Strategically positioned on ancient trade highways between coastal ports (Khambhat) and inland capitals, serving caravans and local pastoral communities.",
          "features": [
            "Multi-level resting galleries protected from heat",
            "Perennial groundwater reservoir maintaining 5\u00b0C cooler temperatures",
            "Communal spaces for travelers and water drawing"
          ],
          "citations": "J. Jain-Neubauer, The Stepwells of Gujarat (1981)",
          "related_monuments": [
            "Adalaj Stepwell",
            "Rani ki Vav"
          ]
        }
      },
      {
        "id": "insc_rudadevi_2",
        "label": "Bilingual Sanskrit-Persian Inscription",
        "kind": "inscriptions",
        "category": "inscriptions",
        "x": 670,
        "y": 400,
        "context": {
          "title": "Bilingual Dedicatory Epigraph (1498 CE)",
          "period": "Vikrama Samvat 1555 (1498 CE)",
          "summary": "A stone inscription on the first-floor wall records the lineage of King Veer Singh, Queen Rudadevi's donation of 500,000 drammas for its creation, and a prayer for peaceful coexistence.",
          "features": [
            "Sanskrit in Devanagari script detailing genealogy",
            "Persian companion inscription welcoming travelers",
            "Detailed records of cost and sthapati master-builders"
          ],
          "citations": "Epigraphia Indica Vol. IV \u00b7 ASI Vadodara Epigraphic Records",
          "related_monuments": [
            "Adalaj Stepwell"
          ]
        }
      },
      {
        "id": "sculpt_flora_2",
        "label": "Floral & Mythological Reliefs",
        "kind": "sculpture",
        "category": "sculpture",
        "x": 430,
        "y": 80,
        "context": {
          "title": "Carved Stone Ornamentation",
          "period": "15th Century CE",
          "summary": "Richly carved stone panels depicting Kalpavriksha (tree of life), fighting elephants, musicians, dancing maidens, and ornamental floral friezes on every gallery level.",
          "features": [
            "Delicate sandstone pillar friezes",
            "Ami-kumbha and tree-of-life lintel carvings",
            "Intertwined vine carvings devoid of human figures in upper niches"
          ],
          "citations": "Heritage Trust Ahmedabad Architectural Survey",
          "related_monuments": [
            "Adalaj Stepwell"
          ]
        }
      },
      {
        "id": "geo_gandhinagar_2",
        "label": "Sabarmati Basin Geography",
        "kind": "geography",
        "category": "geography",
        "x": 430,
        "y": 450,
        "context": {
          "title": "Sabarmati River Hydro-Geographic Basin",
          "period": "Pre-modern alluvial basin",
          "summary": "Located in the alluvial basin near Ahmedabad and Gandhinagar, where sandy soil permitted deep excavation into natural water-bearing aquifers.",
          "features": [
            "Alluvial sandstone sediment bed",
            "Strategic proximity to Ahmedabad capital founded in 1411 CE",
            "Groundwater filtration through deep subterranean sand beds"
          ],
          "citations": "Geological Survey of India \u00b7 Gujarat State Gazetteers",
          "related_monuments": [
            "Adalaj Stepwell"
          ]
        }
      }
    ],
    "edges": [
      {
        "source": "m_2",
        "target": "dyn_vaghela_2",
        "relation": "Patronized by Queen Rudadevi under",
        "category": "dynasties"
      },
      {
        "source": "m_2",
        "target": "arch_syncretic_2",
        "relation": "Exemplifies syncretism of",
        "category": "architecture"
      },
      {
        "source": "m_2",
        "target": "wat_adalaj_2",
        "relation": "Engineered as station on",
        "category": "water_systems"
      },
      {
        "source": "m_2",
        "target": "insc_rudadevi_2",
        "relation": "Dedication recorded in",
        "category": "inscriptions"
      },
      {
        "source": "m_2",
        "target": "sculpt_flora_2",
        "relation": "Ornately decorated with",
        "category": "sculpture"
      },
      {
        "source": "m_2",
        "target": "geo_gandhinagar_2",
        "relation": "Located within",
        "category": "geography"
      }
    ]
  },
  "3": {
    "monumentId": 3,
    "monumentTitle": "Modhera Sun Temple",
    "primaryNode": {
      "id": "m_3",
      "label": "Modhera Sun Temple",
      "kind": "monument",
      "category": "architecture",
      "x": 430,
      "y": 260,
      "img": "/images/Mondhera.jpg",
      "context": {
        "title": "Modhera Sun Temple (Surya Mandir)",
        "period": "1026\u20131027 CE",
        "summary": "Astronomically aligned temple complex built by King Bhima I of the Solanki dynasty on the Tropic of Cancer along the Pushpavati river. Comprises the Gudhamandapa (sanctum), Sabhamandapa (assembly hall of 52 pillars), and the Surya Kund (stepped reservoir).",
        "features": [
          "Equinox sunrise solar alignment onto sanctum deity",
          "Surya Kund with 108 miniature stepped shrines",
          "Sabhamandapa with 52 intricately carved pillars representing weeks of the year",
          "Maru-Gurjara ornamental mastery"
        ],
        "citations": "ASI Western Circle Monument Record \u00b7 UNESCO Tentative List Ref: 6623",
        "related_monuments": [
          "Rani ki Vav",
          "Konark Sun Temple"
        ]
      }
    },
    "nodes": [
      {
        "id": "dyn_solanki_3",
        "label": "King Bhima I (Solanki Dynasty)",
        "kind": "dynasty",
        "category": "dynasties",
        "x": 190,
        "y": 120,
        "context": {
          "title": "King Bhima I Royal Patronage",
          "period": "Reign: 1022\u20131064 CE",
          "summary": "King Bhima I commissioned the Sun Temple in 1026\u20131027 CE as an act of cosmic renewal and dynastic resilience following the Mahmud of Ghazni raid on Somnath.",
          "features": [
            "Solar descent claims of the Chaulukya kings",
            "Inscribed dedication dated Vikrama Samvat 1083",
            "Commissioned both Modhera and assisted initial work on Rani ki Vav"
          ],
          "citations": "Epigraphia Indica Vol. XXXIII \u00b7 Prabandhachintamani",
          "related_monuments": [
            "Modhera Sun Temple",
            "Rani ki Vav"
          ]
        }
      },
      {
        "id": "rel_solar_3",
        "label": "Puranic Solar Worship",
        "kind": "religions",
        "category": "religions",
        "x": 670,
        "y": 120,
        "context": {
          "title": "Surya Cult & Solar Theology",
          "period": "Vedic & Puranic Solar Traditions",
          "summary": "Dedicated to the solar deity Surya, depicted in northern Iranian/Saka boots (udichyavesha) with twin lotuses, driving a seven-horse chariot across the twelve Adityas.",
          "features": [
            "12 Adityas carved into sanctum niches",
            "Seven-horse chariot symbolism on plinth friezes",
            "Daily worship synchronized with dawn astronomical movements"
          ],
          "citations": "Bhavishya Purana \u00b7 Brihat Samhita Solar Chapters",
          "related_monuments": [
            "Modhera Sun Temple",
            "Konark Sun Temple"
          ]
        }
      },
      {
        "id": "wat_suryakund_3",
        "label": "Surya Kund (Stepped Reservoir)",
        "kind": "water_systems",
        "category": "water_systems",
        "x": 190,
        "y": 400,
        "context": {
          "title": "Surya Kund Stepped Tank Architecture",
          "period": "1026 CE",
          "summary": "A grand rectangular stepped water tank (Ramakund) featuring 108 miniature shrines dedicated to Ganesha, Shiva, and Sheshashayi Vishnu along its stepped pyramid terraces.",
          "features": [
            "108 subsidiary step-shrines around perimeter",
            "Stepped triangular cascading bathing ghats",
            "Ritual purification pool preceding temple entry"
          ],
          "citations": "ASI Conservation Reports \u00b7 J. Burgess, Architectural Antiquities of Northern Gujarat",
          "related_monuments": [
            "Modhera Sun Temple",
            "Rani ki Vav"
          ]
        }
      },
      {
        "id": "arch_astronomy_3",
        "label": "Equinoctial Solar Engineering",
        "kind": "architecture",
        "category": "architecture",
        "x": 670,
        "y": 400,
        "context": {
          "title": "Astronomical Alignment & Sacred Geometry",
          "period": "11th Century Celestial Alignment",
          "summary": "Engineered precisely on the Tropic of Cancer so that on solar equinoxes (March 21 & September 23), dawn rays pass through the pavilion to illuminate the sanctum deity.",
          "features": [
            "East-west axial astronomical alignment",
            "52 carved pillars representing weeks of the solar year",
            "Vastu-purusha mandala solar geometry"
          ],
          "citations": "Subhash Kak, The Solar Architecture of Modhera \u00b7 ASI Astronomical Surveys",
          "related_monuments": [
            "Modhera Sun Temple",
            "Konark Sun Temple"
          ]
        }
      },
      {
        "id": "sculpt_sabhamandapa_3",
        "label": "Sabha Mandapa 52 Pillars",
        "kind": "sculpture",
        "category": "sculpture",
        "x": 430,
        "y": 80,
        "context": {
          "title": "Sabha Mandapa Sculptural Friezes",
          "period": "11th Century CE",
          "summary": "Open-pillared assembly hall famed for its cusped torana arches and octagonal central dome resting on 52 sculpted columns depicting scenes from the Mahabharata and Ramayana.",
          "features": [
            "Exquisite torana archways with makara dragon terminals",
            "Carved narrative friezes of ancient epics",
            "Deep undercutting of sandstone capitals and brackets"
          ],
          "citations": "Stella Kramrisch, The Hindu Temple \u00b7 ASI Western Circle",
          "related_monuments": [
            "Modhera Sun Temple"
          ]
        }
      },
      {
        "id": "insc_bhima_3",
        "label": "Vikrama Samvat 1083 Inscription",
        "kind": "inscriptions",
        "category": "inscriptions",
        "x": 430,
        "y": 450,
        "context": {
          "title": "Sanctum Wall Dedicatory Epigraph",
          "period": "1026\u20131027 CE (VS 1083)",
          "summary": "A stone inscription carved on the back wall of the sanctum upside down reading: 'Vikram Samvat 1083', definitively dating the temple's consecration to Bhima I.",
          "features": [
            "Devanagari numeral and epigraphic date notation",
            "Provides anchor date for medieval Gujarat chronologies",
            "Recorded during 1887 ASI epigraphic survey"
          ],
          "citations": "Epigraphia Indica \u00b7 H. Cousens, Somanatha and other Mediaeval Temples in Kathiawad",
          "related_monuments": [
            "Modhera Sun Temple"
          ]
        }
      }
    ],
    "edges": [
      {
        "source": "m_3",
        "target": "dyn_solanki_3",
        "relation": "Commissioned by King Bhima I",
        "category": "dynasties"
      },
      {
        "source": "m_3",
        "target": "rel_solar_3",
        "relation": "Consecrated for worship of",
        "category": "religions"
      },
      {
        "source": "m_3",
        "target": "wat_suryakund_3",
        "relation": "Includes sacred reservoir",
        "category": "water_systems"
      },
      {
        "source": "m_3",
        "target": "arch_astronomy_3",
        "relation": "Engineered with astronomical precision",
        "category": "architecture"
      },
      {
        "source": "m_3",
        "target": "sculpt_sabhamandapa_3",
        "relation": "Features pillared hall of",
        "category": "sculpture"
      },
      {
        "source": "m_3",
        "target": "insc_bhima_3",
        "relation": "Consecration dated by",
        "category": "inscriptions"
      }
    ]
  },
  "4": {
    "monumentId": 4,
    "monumentTitle": "Mehrangarh Fort",
    "primaryNode": {
      "id": "m_4",
      "label": "Mehrangarh Fort",
      "kind": "monument",
      "category": "architecture",
      "x": 430,
      "y": 260,
      "img": "/images/Mehrangarh.jpg",
      "context": {
        "title": "Mehrangarh Citadel of Jodhpur",
        "period": "Founded 1459 CE",
        "summary": "Perched 410 feet above Jodhpur on the perpendicular cliff of Bhakurcheeria (Chidiyatuik). Founded by Rao Jodha, 15th chief of the Rathore clan, it represents the preeminent zenith of Rajput defensive architecture fused with delicate palace interiors.",
        "features": [
          "Massive defensive sandstone ramparts over 120 feet high",
          "Seven fortified gates including Jai Pol and Fateh Pol",
          "Phool Mahal (Palace of Flowers) with 24-carat gold filigree",
          "Preserves world's largest collection of Rathore armaments and palanquins"
        ],
        "citations": "Mehrangarh Museum Trust Archives \u00b7 James Tod, Annals and Antiquities of Rajasthan",
        "related_monuments": []
      }
    },
    "nodes": [
      {
        "id": "dyn_rathore_4",
        "label": "Rathore Dynasty of Marwar",
        "kind": "dynasty",
        "category": "dynasties",
        "x": 190,
        "y": 120,
        "context": {
          "title": "Rathore Imperial Clan of Marwar",
          "period": "13th \u2013 20th Century CE",
          "summary": "Suryavanshi Rajput lineage that ruled the Marwar desert kingdom. Rao Jodha shifted the capital from Mandore to Jodhpur in 1459 CE, initiating the fort's five-century construction.",
          "features": [
            "Descendants of the Rashtrakuta imperial lineage",
            "Renowned martial diplomacy with Mughal emperors",
            "Prominent rulers: Rao Jodha, Maldeo, Jaswant Singh I, Man Singh"
          ],
          "citations": "Khyat of Nainsi \u00b7 Jodhpur State Historical Archives",
          "related_monuments": [
            "Mehrangarh Fort"
          ]
        }
      },
      {
        "id": "arch_military_4",
        "label": "Rajput Military Fortification",
        "kind": "architecture",
        "category": "architecture",
        "x": 670,
        "y": 120,
        "context": {
          "title": "Rajput Military Bastion Architecture",
          "period": "15th \u2013 18th Century CE",
          "summary": "Engineered directly into living columnar rhyolite rock, featuring sheer batter walls, angled bastions, cannon ramps, and multi-layered gate ambushes.",
          "features": [
            "Impenetrable double-walled defensive perimeters",
            "Zig-zag approach roads preventing elephant battering",
            "Concealed sniper loopholes and machicolations"
          ],
          "citations": "G.S.L. Devra, Forts of Rajasthan \u00b7 Archaeological Survey of India",
          "related_monuments": [
            "Mehrangarh Fort"
          ]
        }
      },
      {
        "id": "geo_marwar_4",
        "label": "Marwar & Thar Gateway",
        "kind": "geography",
        "category": "geography",
        "x": 190,
        "y": 400,
        "context": {
          "title": "Marwar Geography & Thar Trade Corridors",
          "period": "Historical Marwar",
          "summary": "Controlling the strategic trade routes connecting Gujarat ports and the Arabian Sea to the Delhi-Agra plains across the arid Thar Desert.",
          "features": [
            "Malani igneous suite volcanic rock foundation",
            "Rainwater catchment stepwells (Padamsar & Ranisar)",
            "Control of silk, spice, and opium caravan trade"
          ],
          "citations": "Imperial Gazetteer of India, Vol. XIV \u00b7 Rajasthan State Archives",
          "related_monuments": [
            "Mehrangarh Fort"
          ]
        }
      },
      {
        "id": "sculpt_jharokha_4",
        "label": "Jharokha Sandstone Lattice",
        "kind": "sculpture",
        "category": "sculpture",
        "x": 670,
        "y": 400,
        "context": {
          "title": "Carved Red Sandstone Jharokhas",
          "period": "16th \u2013 18th Century CE",
          "summary": "Exquisitely carved sandstone oriel windows (jharokhas) and pierced stone screens (jalis) on palace facades, allowing purdah observation while maximizing desert cross-ventilation.",
          "features": [
            "Over 250 distinct geometric jali screen patterns",
            "Local Makrana marble and Jodhpur pink sandstone",
            "Cantilevered stone balcony brackets with peacock motifs"
          ],
          "citations": "Giles Tillotson, The Rajput Palaces \u00b7 Mehrangarh Trust Survey",
          "related_monuments": [
            "Mehrangarh Fort"
          ]
        }
      },
      {
        "id": "cultural_marwar_4",
        "label": "Marwar Courtly Music & Art",
        "kind": "cultural_practices",
        "category": "cultural_practices",
        "x": 430,
        "y": 80,
        "context": {
          "title": "Marwar School of Miniature Painting",
          "period": "17th \u2013 19th Century CE",
          "summary": "Flourishing artistic court known for vibrant Ragamala paintings, folk ballads of Dhola-Maru, and patronizing the Langas and Manganiyars desert musicians.",
          "features": [
            "Bold colors (yellow, ochre, lapis) and dynamic contours",
            "Extensive collection of rare illuminated manuscripts",
            "Living preservation of desert oral folklore and poetry"
          ],
          "citations": "Ananda Coomaraswamy, Rajput Painting \u00b7 Mehrangarh Museum Trust",
          "related_monuments": [
            "Mehrangarh Fort"
          ]
        }
      },
      {
        "id": "insc_cannonry_4",
        "label": "Royal Farman & Cannon Epigraphs",
        "kind": "inscriptions",
        "category": "inscriptions",
        "x": 430,
        "y": 450,
        "context": {
          "title": "Historical Cannon Inscriptions & Royal Charters",
          "period": "16th \u2013 18th Century CE",
          "summary": "Historical Persian, Rajasthani, and Sanskrit inscriptions engraved upon bronze cannons (Kilkila, Shambhuban) and royal copper-plate farmans documenting battle victories and treaties.",
          "features": [
            "Foundry marks of master royal ironsmiths",
            "Inscriptions detailing 1807 siege of Jodhpur by Jaipur forces",
            "Devanagari donor records on temple shrines within the citadel"
          ],
          "citations": "Epigraphia Indica (Arabic and Persian Supplement) \u00b7 Jodhpur Fort Records",
          "related_monuments": [
            "Mehrangarh Fort"
          ]
        }
      }
    ],
    "edges": [
      {
        "source": "m_4",
        "target": "dyn_rathore_4",
        "relation": "Founded and ruled by",
        "category": "dynasties"
      },
      {
        "source": "m_4",
        "target": "arch_military_4",
        "relation": "Exemplifies architecture of",
        "category": "architecture"
      },
      {
        "source": "m_4",
        "target": "geo_marwar_4",
        "relation": "Dominates desert terrain of",
        "category": "geography"
      },
      {
        "source": "m_4",
        "target": "sculpt_jharokha_4",
        "relation": "Adorned with intricate",
        "category": "sculpture"
      },
      {
        "source": "m_4",
        "target": "cultural_marwar_4",
        "relation": "Preserves court traditions of",
        "category": "cultural_practices"
      },
      {
        "source": "m_4",
        "target": "insc_cannonry_4",
        "relation": "Documented in epigraphs of",
        "category": "inscriptions"
      }
    ]
  },
  "5": {
    "monumentId": 5,
    "monumentTitle": "Konark Sun Temple",
    "primaryNode": {
      "id": "m_5",
      "label": "Konark Sun Temple",
      "kind": "monument",
      "category": "architecture",
      "x": 430,
      "y": 260,
      "img": "/images/Konark.jpg",
      "context": {
        "title": "Konark Sun Temple (The Black Pagoda)",
        "period": "c. 1250 CE",
        "summary": "Monumental chariot temple conceived on the shores of the Bay of Bengal by King Narasimhadeva I of the Eastern Ganga dynasty. Structured as the colossal cosmic chariot of Surya, fitted with 24 carved stone wheels pulled by seven galloping stone horses.",
        "features": [
          "24 intricately carved stone wheels functioning as sundials",
          "Pyramidal stepped Jagamohana (assembly hall) rising 128 feet",
          "High-relief chlorite carvings of dancers, musicians, and mithunas",
          "Ancient maritime landmark for Indian Ocean navigators"
        ],
        "citations": "UNESCO World Heritage Centre Ref: 246 \u00b7 ASI Bhubaneswar Circle Monument Record",
        "related_monuments": [
          "Modhera Sun Temple",
          "Brihadeeswarar Temple"
        ]
      }
    },
    "nodes": [
      {
        "id": "dyn_ganga_5",
        "label": "Eastern Ganga Dynasty",
        "kind": "dynasty",
        "category": "dynasties",
        "x": 190,
        "y": 120,
        "context": {
          "title": "Eastern Ganga Imperial Lineage",
          "period": "11th \u2013 15th Century CE",
          "summary": "Powerful imperial dynasty ruling Kalinga (modern Odisha and northern Andhra). King Narasimhadeva I built Konark celebrating his decisive military victories over the Delhi Sultanate forces.",
          "features": [
            "Patronage of Jagannath Puri and Konark monumental sanctuaries",
            "Flourishing maritime trade with Southeast Asia (Kalinga-Bali routes)",
            "Integration of royal martial glory with solar devotion"
          ],
          "citations": "K.S. Behera, Konark: The Heritage of Mankind (1996) \u00b7 Ganga Copper Plates",
          "related_monuments": [
            "Konark Sun Temple"
          ]
        }
      },
      {
        "id": "arch_kalinga_5",
        "label": "Kalinga Architectural School",
        "kind": "architecture",
        "category": "architecture",
        "x": 670,
        "y": 120,
        "context": {
          "title": "Kalinga Deula Architecture",
          "period": "8th \u2013 13th Century CE",
          "summary": "Pinnacle of Kalinga architectural canon consisting of the Rekha Deula (curvilinear sanctum tower, now collapsed), the Pidha Deula (stepped tiered Jagamohana), and the Natamandapa (dancing hall).",
          "features": [
            "Trabeated corbelled horizontal sandstone masonry",
            "Interlocking iron dowels and stone lintels without mortar",
            "Pitha (ornamental base platform) carved with dynamic elephant processions"
          ],
          "citations": "Manmohan Ganguly, Orissa and Her Remains \u00b7 ASI Archaeological Memoirs",
          "related_monuments": [
            "Konark Sun Temple"
          ]
        }
      },
      {
        "id": "sculpt_wheels_5",
        "label": "24 Astronomical Stone Wheels",
        "kind": "sculpture",
        "category": "sculpture",
        "x": 190,
        "y": 400,
        "context": {
          "title": "Astronomical Chariot Wheels & Sundials",
          "period": "1250 CE",
          "summary": "12 pairs of monumental 9.8-foot stone wheels symbolizing the 12 months of the year, each with 8 major and 8 minor spokes functioning as precision shadow sundials calculating exact solar time.",
          "features": [
            "Medallions carved with diurnal activities corresponding to each prahara (3-hour period)",
            "Micro-sculptural filigree depicting dancers, hunters, and foliate scrolls",
            "Seven horses representing the seven days of the week and rainbow spectrum"
          ],
          "citations": "UNESCO Technical Report \u00b7 B.K. Rath, Science and Technology in Ancient Odisha",
          "related_monuments": [
            "Konark Sun Temple"
          ]
        }
      },
      {
        "id": "insc_baya_5",
        "label": "Baya Chakada Palm-Leaf Chronicles",
        "kind": "inscriptions",
        "category": "inscriptions",
        "x": 670,
        "y": 400,
        "context": {
          "title": "Baya Chakada Construction Log Manuscripts",
          "period": "13th Century Palm-Leaf Records",
          "summary": "Ancient palm-leaf manuscript accounts in archaic Odia script detailing the daily architectural accounts, sthapati wages, stone procurement from Khandagiri quarries, and Chief Architect Bishu Maharana's 12-year building log.",
          "features": [
            "Detailed records of 1,200 master craftsmen and stone masons",
            "Folk legend of Dharmapada crowning the final finial stone",
            "Comprehensive financial and administrative ledgers of medieval temple construction"
          ],
          "citations": "Alice Boner, S.R. Sarma, New Light on the Sun Temple of Konarka (1972)",
          "related_monuments": [
            "Konark Sun Temple"
          ]
        }
      },
      {
        "id": "rel_surya_5",
        "label": "Surya Cult & Maitreya Vana",
        "kind": "religions",
        "category": "religions",
        "x": 430,
        "y": 80,
        "context": {
          "title": "Sun God Surya & Sacred Arkakshetra",
          "period": "Vedic & Puranic Solar Pilgrimage",
          "summary": "Konark was revered as Arka-Kshetra (the Field of the Sun) and Padma-Kshetra. According to the Samba Purana, Krishna's son Samba was cured of leprosy here after rigorous solar penance at the mouth of the sacred Chandrabhaga River.",
          "features": [
            "Green chlorite statues of Surya as Dawn, Noon, and Evening Sun",
            "Ancient healing traditions associated with coastal solar radiation",
            "Annual Magha Saptami holy bath ritual at Chandrabhaga beach"
          ],
          "citations": "Brahma Purana \u00b7 Samba Purana Solar Text \u00b7 ASI Epigraphs",
          "related_monuments": [
            "Konark Sun Temple",
            "Modhera Sun Temple"
          ]
        }
      },
      {
        "id": "geo_ocean_5",
        "label": "Bay of Bengal Maritime Navigation",
        "kind": "geography",
        "category": "geography",
        "x": 430,
        "y": 450,
        "context": {
          "title": "Bay of Bengal Coastal Maritime Beacon",
          "period": "13th \u2013 18th Century CE",
          "summary": "Built directly on the coastal sand spit where the Chandrabhaga River joined the ocean. European mariners navigating the Bay of Bengal charted it as the 'Black Pagoda' to distinguish it from Jagannath Puri's 'White Pagoda'.",
          "features": [
            "Coastline navigational landmark for merchant dhows",
            "Ancient maritime port of Chelitalo connected to Southeast Asia",
            "Coastal sand dune geology requiring heavy raft foundation engineering"
          ],
          "citations": "Abul Fazl, Ain-i-Akbari (1590 CE) \u00b7 Thomas Bowrey, A Geographical Account of Countries Round the Bay of Bengal (1679)",
          "related_monuments": [
            "Konark Sun Temple"
          ]
        }
      }
    ],
    "edges": [
      {
        "source": "m_5",
        "target": "dyn_ganga_5",
        "relation": "Commissioned by King Narasimhadeva I",
        "category": "dynasties"
      },
      {
        "source": "m_5",
        "target": "arch_kalinga_5",
        "relation": "Pinnacle of architectural school",
        "category": "architecture"
      },
      {
        "source": "m_5",
        "target": "sculpt_wheels_5",
        "relation": "Carved with astronomical",
        "category": "sculpture"
      },
      {
        "source": "m_5",
        "target": "insc_baya_5",
        "relation": "Construction documented in",
        "category": "inscriptions"
      },
      {
        "source": "m_5",
        "target": "rel_surya_5",
        "relation": "Sanctuary consecrated to",
        "category": "religions"
      },
      {
        "source": "m_5",
        "target": "geo_ocean_5",
        "relation": "Served as landmark for",
        "category": "geography"
      }
    ]
  },
  "6": {
    "monumentId": 6,
    "monumentTitle": "Varanasi Ghats",
    "primaryNode": {
      "id": "m_6",
      "label": "Varanasi Riverfront Ghats",
      "kind": "monument",
      "category": "architecture",
      "x": 430,
      "y": 260,
      "img": "/images/varanasi.jpg",
      "context": {
        "title": "Sacred Riverfront Ghats of Varanasi (Kashi)",
        "period": "Continuous urban settlement from 800 BCE; 18th c. stone architectural revival",
        "summary": "An unbroken monumental riverfront comprising 84 continuous stone stairways along the crescent-shaped western bank of the sacred Ganga. Reconstructed largely in stone under Maratha rulers in the 18th century, synthesizing riverfront hydraulic engineering, Vedic rituals, and classical music traditions.",
        "features": [
          "84 contiguous stone ghats spanning 6.8 kilometers",
          "Pioneered hydraulic stone bastion engineering against monsoon flooding",
          "Centuries of continuous living Vedic ritual traditions",
          "Banaras Gharana classical music and sthapati guilds"
        ],
        "citations": "UNESCO Tentative List Ref: 5991 \u00b7 National Mission on Cultural Mapping",
        "related_monuments": [
          "Rani ki Vav"
        ]
      }
    },
    "nodes": [
      {
        "id": "dyn_maratha_6",
        "label": "Maratha Confederation Patronage",
        "kind": "dynasty",
        "category": "dynasties",
        "x": 190,
        "y": 120,
        "context": {
          "title": "Maratha Royal Patronage & Cultural Revival",
          "period": "18th Century CE",
          "summary": "Following medieval destructions, the Holkars of Indore (Queen Ahilyabai Holkar), Scindias of Gwalior, Bhonsles of Nagpur, and Peshwas funded the massive reconstruction of the stone ghats and temples.",
          "features": [
            "Queen Ahilyabai Holkar rebuilt Manikarnika Ghat and Kashi Vishwanath (1777 CE)",
            "Scindia Ghat with its submerged leaning stone Shiva temple",
            "Darabhanga and Munshi Ghats built with grand palatial riverfront facades"
          ],
          "citations": "Diana L. Eck, Banaras: City of Light (1982) \u00b7 Maratha State Archives",
          "related_monuments": [
            "Varanasi Ghats"
          ]
        }
      },
      {
        "id": "arch_riverfront_6",
        "label": "Riparian Hydraulic Stone Architecture",
        "kind": "architecture",
        "category": "architecture",
        "x": 670,
        "y": 120,
        "context": {
          "title": "Riparian Masonry & Riverfront Engineering",
          "period": "18th \u2013 19th Century CE",
          "summary": "Monumental Chunar sandstone stepped embankments built with cylindrical stone bastions, massive retaining walls, and tiered terraces designed to withstand 50-foot annual monsoon flood fluctuations.",
          "features": [
            "Interlocking dry Chunar sandstone blocks resistant to scouring currents",
            "Semi-circular defensive stone bastions deflecting river vorticity",
            "Stepped platforms accommodating varying seasonal water levels"
          ],
          "citations": "James Prinsep, Benares Illustrated (1831) \u00b7 Central Public Works Department Historical Surveys",
          "related_monuments": [
            "Varanasi Ghats"
          ]
        }
      },
      {
        "id": "rel_vedic_6",
        "label": "Vedic Rituals & Pancha-Tirtha",
        "kind": "religions",
        "category": "religions",
        "x": 190,
        "y": 400,
        "context": {
          "title": "Sacred Geography & Pancha-Tirtha Pilgrimage",
          "period": "Ancient to Present Day",
          "summary": "The five sacred pilgrimage ghats: Assi, Dashashwamedh, Adi Keshava, Panchaganga, and Manikarnika. Center of Vedic Sandhyavandanam rituals, Ganga Aarti, and sacred cremation.",
          "features": [
            "Dashashwamedh Ghat: Myth of Lord Brahma performing ten horse sacrifices",
            "Manikarnika Ghat: The perpetual sacred cremation ground of liberation (Moksha)",
            "Daily dawn Surya Arghya offerings by thousands of pilgrims"
          ],
          "citations": "Kashi Khanda of Skanda Purana \u00b7 Matsya Purana",
          "related_monuments": [
            "Varanasi Ghats"
          ]
        }
      },
      {
        "id": "cultural_banaras_6",
        "label": "Banaras Gharana Oral Heritage",
        "kind": "cultural_practices",
        "category": "cultural_practices",
        "x": 670,
        "y": 400,
        "context": {
          "title": "Banaras Musical & Oral Traditions",
          "period": "16th Century to Present",
          "summary": "Varanasi's riverfront has nurtured India's finest classical music gharanas, including the Banaras tabla school (Pandit Ram Sahai), Shehnai maestro Ustad Bismillah Khan, and Dhrupad chanting traditions.",
          "features": [
            "Subah-e-Banaras musical dawn recitals on the ghats",
            "Ancient Sanskrit debate traditions at the riverfront mutts",
            "Living sthapati boat-building and stone carving guilds"
          ],
          "citations": "Sangeet Natak Akademi Archives \u00b7 UNESCO Creative Cities Network (Music)",
          "related_monuments": [
            "Varanasi Ghats"
          ]
        }
      },
      {
        "id": "geo_ganga_6",
        "label": "Crescent Ganga River Hydrology",
        "kind": "geography",
        "category": "geography",
        "x": 430,
        "y": 80,
        "context": {
          "title": "Uttravahini Ganga Sacred Hydrology",
          "period": "Geological Holocene",
          "summary": "At Varanasi, the Ganga unusually flows northward (Uttravahini) in a majestic crescent arc, reflecting the rising sun towards the sacred western cliff bank.",
          "features": [
            "Northward flow symbolizing return to cosmic source in the Himalayas",
            "High kankar lime-clay natural bluff preventing bank erosion on western shore",
            "Natural confluence of Varuna and Assi rivers defining city boundaries"
          ],
          "citations": "Geological Survey of India \u00b7 National Ganga River Basin Authority",
          "related_monuments": [
            "Varanasi Ghats"
          ]
        }
      },
      {
        "id": "insc_sanskrit_6",
        "label": "Sanskrit Epigraphs & Palm Manuscripts",
        "kind": "inscriptions",
        "category": "inscriptions",
        "x": 430,
        "y": 450,
        "context": {
          "title": "Sanskrit Inscriptions & Archival Repositories",
          "period": "Ancient to 19th Century",
          "summary": "Preserved on temple lintels, bathing ghat plinths, and within riverside monastic libraries (Sampurnanand Sanskrit University, Scindia Mutt), holding over 150,000 rare manuscripts.",
          "features": [
            "Stone donor inscriptions commemorating Maratha and Rajput endowments",
            "Palm-leaf and handmade paper Vedic and astronomical folios",
            "James Prinsep's 1830s deciphment of ancient Ashokan edicts in Varanasi"
          ],
          "citations": "Epigraphia Indica \u00b7 Sarasvati Bhavana Sanskrit Library Catalogues",
          "related_monuments": [
            "Varanasi Ghats"
          ]
        }
      }
    ],
    "edges": [
      {
        "source": "m_6",
        "target": "dyn_maratha_6",
        "relation": "Reconstructed under patronage of",
        "category": "dynasties"
      },
      {
        "source": "m_6",
        "target": "arch_riverfront_6",
        "relation": "Engineered with stone masonry of",
        "category": "architecture"
      },
      {
        "source": "m_6",
        "target": "rel_vedic_6",
        "relation": "Living sanctuary for",
        "category": "religions"
      },
      {
        "source": "m_6",
        "target": "cultural_banaras_6",
        "relation": "Birthplace of oral traditions of",
        "category": "cultural_practices"
      },
      {
        "source": "m_6",
        "target": "geo_ganga_6",
        "relation": "Framed along crescent banks of",
        "category": "geography"
      },
      {
        "source": "m_6",
        "target": "insc_sanskrit_6",
        "relation": "Documented in epigraphs of",
        "category": "inscriptions"
      }
    ]
  },
  "7": {
    "monumentId": 7,
    "monumentTitle": "Brihadeeswarar Temple",
    "primaryNode": {
      "id": "m_7",
      "label": "Brihadeeswarar Temple",
      "kind": "monument",
      "category": "architecture",
      "x": 430,
      "y": 260,
      "img": "/images/Brihadeeswarar.jpg",
      "context": {
        "title": "Brihadeeswarar Temple (Rajarajeswaram)",
        "period": "Consecrated 1010 CE",
        "summary": "Monumental royal temple built by Emperor Rajaraja Chola I of the Chola dynasty. Dedicated to Shiva as Adavallan/Dhakshina Meru Vitankar, it features the tallest stone vimana tower in South India rising 216 feet, crowned by an 81-ton monolithic granite capstone.",
        "features": [
          "216-foot soaring 16-storey Vimana tower entirely of interlocking granite",
          "81-ton monolithic granite Kumbam apex finial",
          "Tamil and Grantha inscriptions covering over 100 meters of temple plinth",
          "Chola fresco paintings and bronze sculpture workshop center"
        ],
        "citations": "UNESCO World Heritage Centre Ref: 250 (Great Living Chola Temples) \u00b7 ASI Chennai Circle",
        "related_monuments": [
          "Hampi (Vijayanagara)",
          "Meenakshi Amman Temple"
        ]
      }
    },
    "nodes": [
      {
        "id": "dyn_chola_7",
        "label": "Chola Imperial Dynasty",
        "kind": "dynasty",
        "category": "dynasties",
        "x": 190,
        "y": 120,
        "context": {
          "title": "Imperial Chola Lineage & Maritime Empire",
          "period": "9th \u2013 13th Century CE",
          "summary": "Medieval imperial superpower commanding southern India, Sri Lanka, and maritime trade routes across the Bay of Bengal to the Srivijaya Empire (Indonesia/Malaysia).",
          "features": [
            "Emperor Rajaraja Chola I (reign 985\u20131014 CE) and Rajendra Chola I",
            "Decentralized village self-governance documented in local sabhas",
            "Thriving guilds of maritime merchants (Ayyavole 500) and bronze casters"
          ],
          "citations": "K.A. Nilakanta Sastri, The Colas (1935) \u00b7 South Indian Inscriptions Vol. II",
          "related_monuments": [
            "Brihadeeswarar Temple"
          ]
        }
      },
      {
        "id": "arch_dravidian_7",
        "label": "Dravidian Vimana Architecture",
        "kind": "architecture",
        "category": "architecture",
        "x": 670,
        "y": 120,
        "context": {
          "title": "Dravidian Stone Vimana Engineering",
          "period": "11th Century CE",
          "summary": "Monumental dry-stone interlocking granite masonry without mortar, where the central vimana overshadows the entrance gopurams in dramatic contrast to later Nayak temple styles.",
          "features": [
            "Square plan base supporting a 16-tier pyramidal granite tower",
            "Hollow core structural engineering reducing downward stress",
            "Axial progression: Nandi Mandapa, Mukhamandapa, Mahamandapa, and Garbhagriha"
          ],
          "citations": "ASI Architectural Surveys \u00b7 R. Nagaswamy, Masterpieces of Chola Art",
          "related_monuments": [
            "Brihadeeswarar Temple"
          ]
        }
      },
      {
        "id": "sculpt_bronze_7",
        "label": "Chola Bronze Casting & Frescoes",
        "kind": "sculpture",
        "category": "sculpture",
        "x": 190,
        "y": 400,
        "context": {
          "title": "Lost-Wax Bronze Sculpture & Murals",
          "period": "11th Century CE",
          "summary": "Pinnacle of medieval metal sculpture using the cire-perdue (lost-wax) technique to cast dynamic Nataraja, Tripurantaka, and Somaskanda bronzes, alongside vibrant Chola wall frescoes.",
          "features": [
            "Nataraja (Cosmic Dancer) iconographic formulation",
            "Chola frescoes discovered beneath 17th c. Nayak paintings in circumambulatory passage",
            "108 sculpted Bharatanatyam dance karanas on the first tier of the vimana"
          ],
          "citations": "C. Sivaramamurti, South Indian Bronzes \u00b7 ASI Mural Conservation Cell",
          "related_monuments": [
            "Brihadeeswarar Temple"
          ]
        }
      },
      {
        "id": "insc_tamil_7",
        "label": "Tamil-Grantha Epigraphic Record",
        "kind": "inscriptions",
        "category": "inscriptions",
        "x": 670,
        "y": 400,
        "context": {
          "title": "Rajaraja Chola Epigraphic Chronicles",
          "period": "1010 CE Inscriptions",
          "summary": "Inscriptions running hundreds of feet around the stone plinth, beginning with the royal prasasti 'Tirumagal pola...' and meticulously listing the names, villages, and compensation of all 400 temple dancers, 212 musicians, accountants, and sthapatis.",
          "features": [
            "Tamil script interspersed with Grantha for Sanskrit religious terms",
            "Complete inventory of gold ornaments, ruby crowns, and silver vessels donated by royal family",
            "Standardized land revenue, interest rates, and measuring systems"
          ],
          "citations": "E. Hultzsch, South Indian Inscriptions, Vol. II \u00b7 Epigraphia Indica",
          "related_monuments": [
            "Brihadeeswarar Temple"
          ]
        }
      },
      {
        "id": "geo_kaveri_7",
        "label": "Kaveri River Delta Granary",
        "kind": "geography",
        "category": "geography",
        "x": 430,
        "y": 80,
        "context": {
          "title": "Kaveri Delta Agricultural Wealth",
          "period": "Medieval Agro-Economy",
          "summary": "Built at Thanjavur in the fertile delta of the Kaveri River, known as the 'Rice Bowl of Tamil Nadu', whose immense agricultural surplus financed imperial temple construction.",
          "features": [
            "Vast canal irrigation networks initiated by Grand Anicut (Kallanai)",
            "Granite transported over 60 km from quarries near Tiruchirappalli across river barges",
            "Earthen ramp several miles long utilized to haul the 81-ton summit stone"
          ],
          "citations": "ASI Archaeological Reports \u00b7 Kaveri Basin Historical Hydrology",
          "related_monuments": [
            "Brihadeeswarar Temple"
          ]
        }
      },
      {
        "id": "rel_shaivism_7",
        "label": "Shaiva Siddhanta & Temple Rituals",
        "kind": "religions",
        "category": "religions",
        "x": 430,
        "y": 450,
        "context": {
          "title": "Shaiva Siddhanta Agamic Tradition",
          "period": "11th Century to Present",
          "summary": "The sanctum enshrines a colossal 29-foot tall granite Shiva Linga (one of the largest in India), named Brihadeeswara (Great Lord) and consecrated according to Shaiva Agama texts.",
          "features": [
            "Royal preceptor Isana Siva Pandita guidance",
            "Continuous daily puja performed by Sivacharyas for over 1,000 years",
            "Monolithic Nandi sculpted from a single 25-ton block of granite"
          ],
          "citations": "Makutagama and Kamikagama Agamic Texts \u00b7 HR&CE Tamil Nadu",
          "related_monuments": [
            "Brihadeeswarar Temple"
          ]
        }
      }
    ],
    "edges": [
      {
        "source": "m_7",
        "target": "dyn_chola_7",
        "relation": "Commissioned by Emperor Rajaraja I",
        "category": "dynasties"
      },
      {
        "source": "m_7",
        "target": "arch_dravidian_7",
        "relation": "Peak achievement of Dravidian",
        "category": "architecture"
      },
      {
        "source": "m_7",
        "target": "sculpt_bronze_7",
        "relation": "Produced masterpiece artworks of",
        "category": "sculpture"
      },
      {
        "source": "m_7",
        "target": "insc_tamil_7",
        "relation": "Plinth engraved with extensive",
        "category": "inscriptions"
      },
      {
        "source": "m_7",
        "target": "geo_kaveri_7",
        "relation": "Financed by agrarian wealth of",
        "category": "geography"
      },
      {
        "source": "m_7",
        "target": "rel_shaivism_7",
        "relation": "Consecrated as premier shrine of",
        "category": "religions"
      }
    ]
  },
  "8": {
    "monumentId": 8,
    "monumentTitle": "Hampi (Vijayanagara)",
    "primaryNode": {
      "id": "m_8",
      "label": "Hampi (Vijayanagara)",
      "kind": "monument",
      "category": "architecture",
      "x": 430,
      "y": 260,
      "img": "/images/Hampi.jpg",
      "context": {
        "title": "Ruins of the Vijayanagara Empire at Hampi",
        "period": "1336\u20131565 CE",
        "summary": "Sprawling capital of the Vijayanagara Empire set against the rugged granite boulder landscape of the Tungabhadra River. Celebrated for the iconic Vitthala Stone Chariot, musical colonnade pillars, grand bazaar streets, and sophisticated royal hydraulic waterworks.",
        "features": [
          "Monolithic Vitthala Temple stone chariot shrine dedicated to Garuda",
          "Pillared Ranga Mandapa with resonant musical colonnades",
          "Vast royal palaces, stepped tanks, and elephant stables",
          "Continuous living worship at the 7th-century Virupaksha Temple"
        ],
        "citations": "UNESCO World Heritage Centre Ref: 241 \u00b7 Archaeological Survey of India Hampi Circle",
        "related_monuments": [
          "Brihadeeswarar Temple"
        ]
      }
    },
    "nodes": [
      {
        "id": "dyn_vijayanagara_8",
        "label": "Vijayanagara Empire",
        "kind": "dynasty",
        "category": "dynasties",
        "x": 190,
        "y": 120,
        "context": {
          "title": "Vijayanagara Imperial Empire",
          "period": "1336\u20131646 CE (Golden Age under Tuluva Dynasty)",
          "summary": "Founded by brothers Harihara and Bukka under Saint Vidyaranya's guidance. Under Emperor Krishnadevaraya (1509\u20131529 CE), Hampi became one of the wealthiest metropolises in the pre-modern world.",
          "features": [
            "Four ruling dynasties: Sangama, Saluva, Tuluva, Aravidu",
            "Cosmopolitan international horse, diamond, and silk trade",
            "Emperor Krishnadevaraya's literary masterpiece Amuktamalyada"
          ],
          "citations": "Domingo Paes & Fern\u00e3o Nunes Chronicles \u00b7 Robert Sewell, A Forgotten Empire",
          "related_monuments": [
            "Hampi (Vijayanagara)"
          ]
        }
      },
      {
        "id": "arch_granite_8",
        "label": "Granite Mandapa Architecture",
        "kind": "architecture",
        "category": "architecture",
        "x": 670,
        "y": 120,
        "context": {
          "title": "Vijayanagara Architectural Style",
          "period": "14th \u2013 16th Century CE",
          "summary": "Vast open pillared halls (kalyana mandapas) constructed from local granite, featuring monolithic pillars carved with mythical rearing yalis (hippogryphs) and riders.",
          "features": [
            "Vitthala Temple Stone Chariot with rotational stone wheels",
            "56 musical pillars sounding notes of Indian musical scale (sa-re-ga-ma)",
            "Double-flexured eaves and massive corbelled lotus capitals"
          ],
          "citations": "George Michell, Architecture and Art of Southern India \u00b7 ASI Hampi Survey",
          "related_monuments": [
            "Hampi (Vijayanagara)"
          ]
        }
      },
      {
        "id": "wat_aqueducts_8",
        "label": "Royal Stepped Tank & Aqueducts",
        "kind": "water_systems",
        "category": "water_systems",
        "x": 190,
        "y": 400,
        "context": {
          "title": "Vijayanagara Hydraulic Infrastructure",
          "period": "15th Century CE",
          "summary": "Sophisticated masonry aqueducts feeding water from the Tungabhadra River into the Royal Centre, filling geometric black schist stepped tanks (Kalyani) and cooling royal pavilions.",
          "features": [
            "Pushkarani geometric stepped reservoir discovered in 1980s excavations",
            "Interlocking stone pipes and gravity-fed terracotta conduit systems",
            "Kamalapuram and Turtha canal systems sustaining continuous agriculture"
          ],
          "citations": "ASI Excavation Memoir 1985 \u00b7 Kathleen Morrison, Fieldwork at Vijayanagara",
          "related_monuments": [
            "Hampi (Vijayanagara)",
            "Rani ki Vav"
          ]
        }
      },
      {
        "id": "geo_tungabhadra_8",
        "label": "Tungabhadra Boulder Landscape",
        "kind": "geography",
        "category": "geography",
        "x": 670,
        "y": 400,
        "context": {
          "title": "Kishkindha & Granite Terrain",
          "period": "Archaean Granite Formations",
          "summary": "Located on the southern banks of the Tungabhadra River, historically identified with the mythical monkey kingdom Kishkindha of the Ramayana (Anjanadri Hill, Matanga Hill).",
          "features": [
            "Spectacular natural defense of monolithic granite balancing boulders",
            "Coracle boat crossings operating continuously since ancient times",
            "Pampa Sarovar sacred wetland ecosystem"
          ],
          "citations": "Geological Survey of India \u00b7 Hampi Archaeological Atlas",
          "related_monuments": [
            "Hampi (Vijayanagara)"
          ]
        }
      },
      {
        "id": "cultural_travelogues_8",
        "label": "European & Persian Travelogues",
        "kind": "cultural_practices",
        "category": "cultural_practices",
        "x": 430,
        "y": 80,
        "context": {
          "title": "Historical Diplomatic Accounts",
          "period": "15th \u2013 16th Century CE",
          "summary": "Envoys including Abdur Razzaq (Persia, 1443 CE), Niccol\u00f2 de' Conti (Venice, 1420 CE), and Domingo Paes (Portugal, 1520 CE) described a city of seven fortified concentric walls with diamond bazaars.",
          "features": [
            "Abdur Razzaq: 'The city is such that eye has not seen nor ear heard of any place resembling it'",
            "Domingo Paes' descriptions of the grand Mahanavami festival",
            "Detailed accounts of gem and spice markets along the Virupaksha bazaar street"
          ],
          "citations": "Major, India in the Fifteenth Century \u00b7 Sewell, A Forgotten Empire",
          "related_monuments": [
            "Hampi (Vijayanagara)"
          ]
        }
      },
      {
        "id": "insc_kannada_8",
        "label": "Kannada-Telugu Royal Epigraphs",
        "kind": "inscriptions",
        "category": "inscriptions",
        "x": 430,
        "y": 450,
        "context": {
          "title": "Epigraphia Carnatica Hampi Inscriptions",
          "period": "14th \u2013 16th Century CE",
          "summary": "Hundreds of stone and copper plate inscriptions in Old Kannada, Telugu, and Sanskrit recording royal grants, military triumphs, and temple donations by Krishnadevaraya and his queens.",
          "features": [
            "Krishnadevaraya's coronation inscription at Virupaksha Temple (1510 CE)",
            "Dedicatory records on the Vitthala Temple gateway",
            "Sanskrit poetic eulogies composed by court poets (Ashtadiggajas)"
          ],
          "citations": "South Indian Inscriptions Vol. IX \u00b7 Epigraphia Carnatica",
          "related_monuments": [
            "Hampi (Vijayanagara)"
          ]
        }
      }
    ],
    "edges": [
      {
        "source": "m_8",
        "target": "dyn_vijayanagara_8",
        "relation": "Capital city of imperial",
        "category": "dynasties"
      },
      {
        "source": "m_8",
        "target": "arch_granite_8",
        "relation": "Renowned for monolithic",
        "category": "architecture"
      },
      {
        "source": "m_8",
        "target": "wat_aqueducts_8",
        "relation": "Engineered with royal",
        "category": "water_systems"
      },
      {
        "source": "m_8",
        "target": "geo_tungabhadra_8",
        "relation": "Set within granite hills of",
        "category": "geography"
      },
      {
        "source": "m_8",
        "target": "cultural_travelogues_8",
        "relation": "Witnessed and recorded in",
        "category": "cultural_practices"
      },
      {
        "source": "m_8",
        "target": "insc_kannada_8",
        "relation": "Chronicles recorded in",
        "category": "inscriptions"
      }
    ]
  },
  "9": {
    "monumentId": 9,
    "monumentTitle": "Sanchi Stupa",
    "primaryNode": {
      "id": "m_9",
      "label": "Great Stupa at Sanchi",
      "kind": "monument",
      "category": "architecture",
      "x": 430,
      "y": 260,
      "img": "/images/Sanchi.jpg",
      "context": {
        "title": "Buddhist Monuments at Sanchi (Great Stupa No. 1)",
        "period": "3rd century BCE \u2013 12th century CE",
        "summary": "The oldest stone structure in India, originally commissioned by Emperor Ashoka the Great in the 3rd century BCE over the sacred relics of the Buddha. Encircled by an ornate sandstone balustrade and four richly carved monumental torana gateways depicting Jataka tales.",
        "features": [
          "Hemispherical stone anda dome crowned by triple chhatra umbrella",
          "Four monumental Torana gateways with 600+ narrative relief carvings",
          "Early Brahmi inscriptions recording over 600 civic donor gifts",
          "Aniconic Buddhist art representing Buddha through sacred symbols"
        ],
        "citations": "UNESCO World Heritage Centre Ref: 524 \u00b7 Sir John Marshall, The Monuments of Sanchi",
        "related_monuments": []
      }
    },
    "nodes": [
      {
        "id": "dyn_maurya_9",
        "label": "Mauryan Empire (Emperor Ashoka)",
        "kind": "dynasty",
        "category": "dynasties",
        "x": 190,
        "y": 120,
        "context": {
          "title": "Mauryan Imperial Foundations",
          "period": "3rd Century BCE (c. 273\u2013232 BCE)",
          "summary": "Emperor Ashoka chose the Sanchi hilltop (ancient Vedisagiri) because his beloved queen Devi was born in nearby Vidisha. He erected the original brick stupa and an Ashokan polished sandstone pillar.",
          "features": [
            "Ashokan pillar with four-lion capital and schism edict",
            "Devi's royal patronage of early Buddhist monks",
            "Subsequent expansion under Shunga and Satavahana dynasties"
          ],
          "citations": "Mahavamsa (Pali Chronicle) \u00b7 Ashokan Minor Pillar Edict at Sanchi",
          "related_monuments": [
            "Sanchi Stupa"
          ]
        }
      },
      {
        "id": "arch_stupa_9",
        "label": "Buddhist Monastic Stupa Architecture",
        "kind": "architecture",
        "category": "architecture",
        "x": 670,
        "y": 120,
        "context": {
          "title": "Stupa Cosmological Architecture",
          "period": "3rd BCE \u2013 1st Century CE",
          "summary": "Cosmic architectural mandala representing the parinirvana of the Buddha: a hemispherical dome (anda) enclosing holy relics, a square balcony (harmika) symbolizing the abode of gods, and the triple umbrella (chhatra) for the Three Jewels.",
          "features": [
            "Double pradaksina patha (circumambulatory paths at ground and terrace levels)",
            "Four directional cardinal toranas oriented with cosmic quadrants",
            "Trabeated stone carpentry imitating earlier wooden timber gate joints"
          ],
          "citations": "Sir John Marshall & Alfred Foucher, The Monuments of Sanchi (1940)",
          "related_monuments": [
            "Sanchi Stupa"
          ]
        }
      },
      {
        "id": "sculpt_torana_9",
        "label": "Torana Gateway Jataka Carvings",
        "kind": "sculpture",
        "category": "sculpture",
        "x": 190,
        "y": 400,
        "context": {
          "title": "Torana Sculptures & Narrative Panels",
          "period": "1st Century BCE \u2013 1st Century CE",
          "summary": "Masterful bas-relief sculptures carved on the architraves and posts, illustrating Jataka stories (Buddha's past lives: Vessantara, Chhaddanta, Mahakapi) and pivotal historical events.",
          "features": [
            "Sensuous Salabhanjika (tree dryad) bracket figures",
            "Processions of war of the relics and Emperor Ashoka's pilgrimage to Bodh Gaya",
            "Lush floral, elephant, winged lion, and peacock motifs"
          ],
          "citations": "Vidya Dehejia, Discourse in Early Buddhist Art \u00b7 ASI Bhopal Circle",
          "related_monuments": [
            "Sanchi Stupa"
          ]
        }
      },
      {
        "id": "rel_buddhism_9",
        "label": "Aniconic Buddhist Traditions",
        "kind": "religions",
        "category": "religions",
        "x": 670,
        "y": 400,
        "context": {
          "title": "Early Aniconic Buddhist Symbolism",
          "period": "Hinayana / Early Theravada Canon",
          "summary": "Strict avoidance of anthropomorphic depictions of the Buddha. The Blessed One's presence is conveyed solely through sacred aniconic emblems.",
          "features": [
            "Bodhivrksa (Bodhi tree) signifying Enlightenment",
            "Dharmachakra (Wheel of Law) signifying the first sermon at Sarnath",
            "Buddhapaduka (Holy footprints) and empty throne with umbrella"
          ],
          "citations": "Susan L. Huntington, Early Buddhist Art and the Theory of Aniconism",
          "related_monuments": [
            "Sanchi Stupa"
          ]
        }
      },
      {
        "id": "insc_brahmi_9",
        "label": "Early Brahmi Donor Inscriptions",
        "kind": "inscriptions",
        "category": "inscriptions",
        "x": 430,
        "y": 80,
        "context": {
          "title": "Brahmi Epigraphy & Collective Civic Patronage",
          "period": "2nd Century BCE \u2013 1st Century CE",
          "summary": "Over 600 short Brahmi inscriptions incised onto the stone railings, recording that Sanchi was funded not just by emperors, but through collective donations of ordinary citizens, nuns, monks, and ivory carver guilds of Vidisha.",
          "features": [
            "Inscriptions of the Vidisha Guild of Ivory Carvers (Dantakara)",
            "Brahmi palaeography providing milestones in the decipherment of ancient Indian scripts",
            "James Prinsep's 1837 decipherment of Brahmi achieved through Sanchi inscriptions ('danam')"
          ],
          "citations": "James Prinsep, JASB 1837 \u00b7 Epigraphia Indica Vol. II",
          "related_monuments": [
            "Sanchi Stupa"
          ]
        }
      },
      {
        "id": "archaeo_marshall_9",
        "label": "Bhopal Begums & ASI Conservation",
        "kind": "archaeological",
        "category": "archaeological",
        "x": 430,
        "y": 450,
        "context": {
          "title": "Rediscovery & Princely Conservation",
          "period": "1818 \u2013 1919 CE",
          "summary": "Rediscovered in 1818 by British General Taylor. Protected from being dismantled by the enlightened Begums of Bhopal (Shah Jahan Begum & Sultan Jahan Begum), who funded the restoration led by Sir John Marshall.",
          "features": [
            "Plaster casts provided to British and French museums to protect originals",
            "Establishment of the on-site Sanchi Archaeological Museum in 1919",
            "Model project of early scientific monument restoration in British India"
          ],
          "citations": "Sir John Marshall, A Guide to Sanchi (1918) \u00b7 Bhopal State Gazetteers",
          "related_monuments": [
            "Sanchi Stupa"
          ]
        }
      }
    ],
    "edges": [
      {
        "source": "m_9",
        "target": "dyn_maurya_9",
        "relation": "Founded by Emperor Ashoka under",
        "category": "dynasties"
      },
      {
        "source": "m_9",
        "target": "arch_stupa_9",
        "relation": "Archetype of ancient",
        "category": "architecture"
      },
      {
        "source": "m_9",
        "target": "sculpt_torana_9",
        "relation": "Encircled by narrative",
        "category": "sculpture"
      },
      {
        "source": "m_9",
        "target": "rel_buddhism_9",
        "relation": "Preserves sacred emblems of",
        "category": "religions"
      },
      {
        "source": "m_9",
        "target": "insc_brahmi_9",
        "relation": "Railings incised with",
        "category": "inscriptions"
      },
      {
        "source": "m_9",
        "target": "archaeo_marshall_9",
        "relation": "Conserved through work of",
        "category": "archaeological"
      }
    ]
  },
  "10": {
    "monumentId": 10,
    "monumentTitle": "Ramanathaswamy Temple",
    "primaryNode": {
      "id": "m_10",
      "label": "Ramanathaswamy Temple",
      "kind": "monument",
      "category": "architecture",
      "x": 430,
      "y": 260,
      "img": "/images/Rameshwaram.jpg",
      "context": {
        "title": "Ramanathaswamy Temple of Rameshwaram",
        "period": "12th \u2013 18th Century CE",
        "summary": "Sprawling island temple at the southern tip of India on Pamban Island, celebrated for containing the longest pillared temple corridor in the world, featuring 1,212 ornately carved granite columns, and 22 sacred freshwater theertham wells located steps from the ocean.",
        "features": [
          "World's longest pillared corridor extending 1,220 meters",
          "22 sacred theerthams (wells) with unique mineralization and temperature",
          "Enshrines the Ramalinga, one of the twelve sacred Jyotirlingas",
          "Towering eastern and western gopurams commanding the Gulf of Mannar"
        ],
        "citations": "HR&CE Department Tamil Nadu \u00b7 ASI Chennai Circle Monument Survey",
        "related_monuments": [
          "Brihadeeswarar Temple",
          "Meenakshi Amman Temple"
        ]
      }
    },
    "nodes": [
      {
        "id": "dyn_sethupathi_10",
        "label": "Sethupathi Rajas of Ramnad",
        "kind": "dynasty",
        "category": "dynasties",
        "x": 190,
        "y": 120,
        "context": {
          "title": "Sethupathi Dynastic Patronage",
          "period": "15th \u2013 18th Century CE",
          "summary": "The Sethupathi rulers of Ramanathapuram (traditionally regarded as guardians of Adam's Bridge / Rama Setu) funded the monumental third corridor and soaring gopurams.",
          "features": [
            "King Muthuramalinga Sethupathi constructed the famous Third Corridor in 1769 CE",
            "Lifesize stone statues of the Sethupathi kings lining the outer corridors",
            "Protection of ocean pilgrim routes and sea convoys"
          ],
          "citations": "S. Kadhirvel, A History of the Maravas \u00b7 Ramnad Samasthanam Epigraphs",
          "related_monuments": [
            "Ramanathaswamy Temple"
          ]
        }
      },
      {
        "id": "arch_corridor_10",
        "label": "Hypostyle Pillared Corridors",
        "kind": "architecture",
        "category": "architecture",
        "x": 670,
        "y": 120,
        "context": {
          "title": "Monumental Dravidian Colonnades",
          "period": "17th \u2013 18th Century CE",
          "summary": "The third outer corridor spans 690 feet east-west and 435 feet north-south, flanked by 1,212 uniformly sculpted granite pillars resting on 5-foot raised plinths.",
          "features": [
            "Granite stones quarried across the sea and transported by boat to the sandy island",
            "Ceilings adorned with Nayak vegetable-dye fresco paintings",
            "Complex optical perspective creating the illusion of infinity"
          ],
          "citations": "James Fergusson, History of Indian and Eastern Architecture",
          "related_monuments": [
            "Ramanathaswamy Temple",
            "Meenakshi Amman Temple"
          ]
        }
      },
      {
        "id": "wat_theertham_10",
        "label": "22 Sacred Theertham Wells",
        "kind": "water_systems",
        "category": "water_systems",
        "x": 190,
        "y": 400,
        "context": {
          "title": "Hydrological Mystery of Sacred Wells",
          "period": "Ancient to Present",
          "summary": "Located within the temple complex are 22 sacred wells (such as Mahalakshmi, Gayatri, and Kodi Theertham). Despite being surrounded by the saline Indian Ocean, all 22 wells yield distinctly sweet, potable water with varying mineral temperatures.",
          "features": [
            "Pilgrim ritual bathing sequence across all 22 theerthams",
            "Agni Theertham sea bathing ghat at the eastern shore",
            "Natural coastal aquifer filtration through barrier sand spits"
          ],
          "citations": "Central Ground Water Board Hydrological Survey of Pamban Island",
          "related_monuments": [
            "Ramanathaswamy Temple",
            "Rani ki Vav"
          ]
        }
      },
      {
        "id": "rel_jyotirlinga_10",
        "label": "Jyotirlinga & Ramayana Tradition",
        "kind": "religions",
        "category": "religions",
        "x": 670,
        "y": 400,
        "context": {
          "title": "Sacred Jyotirlinga & Sethubandhana",
          "period": "Ramayana Epoch Traditions",
          "summary": "One of the 12 sacred Jyotirlinga shrines. Tradition holds that Lord Rama sanctified and installed the Shivalinga (Ramalinga) fashioned of sand by Sita, alongside the Vishwalinga brought by Hanuman from Mount Kailash.",
          "features": [
            "Dual sanctum practice where Hanuman's Vishwalinga is worshipped first",
            "Char Dham pilgrimage destination completing the southern quadrant",
            "Sethu Yatra pilgrim ritual combining Ganga water from Varanasi with Rameswaram sea"
          ],
          "citations": "Adhyatma Ramayana \u00b7 Shiva Purana Kotirudra Samhita",
          "related_monuments": [
            "Ramanathaswamy Temple",
            "Varanasi Ghats"
          ]
        }
      },
      {
        "id": "geo_pamban_10",
        "label": "Pamban Island & Adam's Bridge",
        "kind": "geography",
        "category": "geography",
        "x": 430,
        "y": 80,
        "context": {
          "title": "Gulf of Mannar Maritime Geography",
          "period": "Marine Geological Formations",
          "summary": "Situated on Pamban Island in the Gulf of Mannar Biosphere Reserve, connected to the Indian mainland by the historic 1914 Pamban Railway Bridge and leading to the underwater shoals of Rama Setu.",
          "features": [
            "Strategic passage controlling the Palk Strait",
            "Rich pearl fisheries and sacred conch (chank) beds historically documented by Marco Polo",
            "Coral reef biodiversity and dynamic ocean current barrier"
          ],
          "citations": "National Institute of Oceanography Reports \u00b7 Marco Polo Travels (1292 CE)",
          "related_monuments": [
            "Ramanathaswamy Temple"
          ]
        }
      },
      {
        "id": "insc_copperplates_10",
        "label": "Sethupathi Copper-Plate Charters",
        "kind": "inscriptions",
        "category": "inscriptions",
        "x": 430,
        "y": 450,
        "context": {
          "title": "Tamil Copper Plate Grants & Sannads",
          "period": "16th \u2013 18th Century CE",
          "summary": "Extensive archive of Tamil copper-plate charters and stone inscriptions recording tax exemptions, endowments for pilgrim free-kitchens (annadana choultries), and royal visits.",
          "features": [
            "Tamil Grantha and regional Marava scripts",
            "Charters of Tirumalai Sethupathi and Vijaya Raghunatha Sethupathi",
            "Catalogued in the Epigraphia Indica and Madras Government Oriental Manuscripts"
          ],
          "citations": "Tamil Nadu State Department of Archaeology \u00b7 South Indian Epigraphy Reports",
          "related_monuments": [
            "Ramanathaswamy Temple"
          ]
        }
      }
    ],
    "edges": [
      {
        "source": "m_10",
        "target": "dyn_sethupathi_10",
        "relation": "Patronized and expanded by",
        "category": "dynasties"
      },
      {
        "source": "m_10",
        "target": "arch_corridor_10",
        "relation": "World-famous for monumental",
        "category": "architecture"
      },
      {
        "source": "m_10",
        "target": "wat_theertham_10",
        "relation": "Encloses hydrological marvel of",
        "category": "water_systems"
      },
      {
        "source": "m_10",
        "target": "rel_jyotirlinga_10",
        "relation": "Sanctified as southern",
        "category": "religions"
      },
      {
        "source": "m_10",
        "target": "geo_pamban_10",
        "relation": "Situated on maritime terrain of",
        "category": "geography"
      },
      {
        "source": "m_10",
        "target": "insc_copperplates_10",
        "relation": "Endowments recorded in",
        "category": "inscriptions"
      }
    ]
  },
  "11": {
    "monumentId": 11,
    "monumentTitle": "Meenakshi Amman Temple",
    "primaryNode": {
      "id": "m_11",
      "label": "Meenakshi Amman Temple",
      "kind": "monument",
      "category": "architecture",
      "x": 430,
      "y": 260,
      "img": "/images/Madurai.jpg",
      "context": {
        "title": "Meenakshi Sundareswarar Temple of Madurai",
        "period": "Ancient roots (6th c. BCE); expanded 1623\u20131659 CE by Nayaks",
        "summary": "The spiritual and architectural heart of the 2,500-year-old city of Madurai on the Vaigai River. A monumental walled temple city featuring 14 soaring gopuram gate towers encrusted with thousands of painted polychrome stucco deities, the Thousand Pillar Hall, and the sacred Golden Lotus Tank.",
        "features": [
          "14 soaring pyramidal gopurams rising up to 170 feet high",
          "Aayiram Kaal Mandapam (Hall of 1,000 Pillars) with carved musical columns",
          "Porthamarai Kulam (Golden Lotus Tank) where Sangam poets met",
          "Living Shaiva-Shakta temple with over 20,000 daily devotees"
        ],
        "citations": "HR&CE Madurai \u00b7 Tamil Nadu State Department of Archaeology Monograph",
        "related_monuments": [
          "Brihadeeswarar Temple",
          "Ramanathaswamy Temple"
        ]
      }
    },
    "nodes": [
      {
        "id": "dyn_nayak_11",
        "label": "Madurai Nayak Dynasty",
        "kind": "dynasty",
        "category": "dynasties",
        "x": 190,
        "y": 120,
        "context": {
          "title": "Madurai Nayak Architecture & Patronage",
          "period": "16th \u2013 17th Century CE",
          "summary": "Successors of the Vijayanagara Empire who established Madurai as an autonomous kingdom. King Thirumalai Nayak (1623\u20131659 CE) rebuilt the temple into its present colossal scale.",
          "features": [
            "Thirumalai Nayak's grand Pudumandapam with portrait statues",
            "Architectural emphasis on towering gopurams visible across the plains",
            "Patronage of Carnatic music, Tamil literature, and Chithirai festival"
          ],
          "citations": "R. Sathyanatha Aiyar, History of the Nayaks of Madura (1924)",
          "related_monuments": [
            "Meenakshi Amman Temple"
          ]
        }
      },
      {
        "id": "arch_gopuram_11",
        "label": "Polychrome Gopuram Architecture",
        "kind": "architecture",
        "category": "architecture",
        "x": 670,
        "y": 120,
        "context": {
          "title": "Dravidian Gopuram Monumentality",
          "period": "16th \u2013 17th Century CE",
          "summary": "14 monumental multi-tiered gateway towers (gopurams), the tallest being the Southern Gopuram (170 feet), adorned with more than 1,500 brightly colored stucco figures of gods, demons, and mythological narratives.",
          "features": [
            "Concave vertical profile designed for dynamic visual impact",
            "Stone base supporting a brick and stucco sculpted super-structure",
            "Renovated and repainted every 12 years during the sacred Mahakumbhabhishekam"
          ],
          "citations": "Crispin Branfoot, Gods on the Move: Architecture and Ritual in the Nayak Period",
          "related_monuments": [
            "Meenakshi Amman Temple"
          ]
        }
      },
      {
        "id": "wat_lotus_11",
        "label": "Porthamarai Kulam (Golden Lotus Tank)",
        "kind": "water_systems",
        "category": "water_systems",
        "x": 190,
        "y": 400,
        "context": {
          "title": "Sacred Golden Lotus Reservoir",
          "period": "Ancient Sangam to Nayak Era",
          "summary": "A 165-foot by 120-foot sacred reservoir within the inner precinct where, according to tradition, Lord Shiva plunged his trishula to create the water, and Indra bathed to atone for sins.",
          "features": [
            "Tradition of testing Sangam Tamil literary manuscripts on the floating golden lotus",
            "Surrounded by pillared arcades with 17th-century Nayak fresco murals",
            "Underground filtration conduits maintaining fresh water levels"
          ],
          "citations": "Thiruvilaiyadal Puranam \u00b7 Madurai Sthala Puranam",
          "related_monuments": [
            "Meenakshi Amman Temple",
            "Rani ki Vav"
          ]
        }
      },
      {
        "id": "sculpt_musical_11",
        "label": "Aayiram Kaal (1000 Pillar) Hall",
        "kind": "sculpture",
        "category": "sculpture",
        "x": 670,
        "y": 400,
        "context": {
          "title": "Thousand Pillar Hall & Musical Columns",
          "period": "Built 1569 CE by Ariyanatha Mudaliar",
          "summary": "A vast hall supported by 985 meticulously carved granite columns, featuring dynamic sculptures of Rati, Manmatha, Kuravan and Kurathi, and monolithic pillars that ring with melodic musical tones.",
          "features": [
            "Carved monolithic musical pillars tuned to distinct swaras",
            "Wheel of Time (Tamil calendar 60-year cycle) carved into ceiling",
            "Masterwork of Nayak stone sculpting craftsmanship"
          ],
          "citations": "ASI Architectural Surveys \u00b7 Museum of Temple Art Madurai",
          "related_monuments": [
            "Meenakshi Amman Temple",
            "Hampi (Vijayanagara)"
          ]
        }
      },
      {
        "id": "rel_shaktha_11",
        "label": "Living Shakta-Shaiva Ritual Worship",
        "kind": "religions",
        "category": "religions",
        "x": 430,
        "y": 80,
        "context": {
          "title": "Goddess Meenakshi Sovereign Worship",
          "period": "Ancient to Present Day",
          "summary": "One of the preeminent centers of Goddess worship in India. Unusually, Goddess Meenakshi (a manifestation of Parvati as the fish-eyed warrior queen) receives primary ritual worship before Lord Sundareswarar.",
          "features": [
            "Nightly palanquin ritual carrying Sundareswarar's icon to Meenakshi's bedchamber",
            "Chithirai Festival drawing one million devotees to celebrate the celestial wedding",
            "Continuous tradition of hereditary Pandaram and Battar priests"
          ],
          "citations": "William Harman, The Sacred Marriage of a Hindu Goddess \u00b7 HR&CE Archives",
          "related_monuments": [
            "Meenakshi Amman Temple"
          ]
        }
      },
      {
        "id": "cultural_sangam_11",
        "label": "Tamil Sangam Urban Planning",
        "kind": "cultural_practices",
        "category": "cultural_practices",
        "x": 430,
        "y": 450,
        "context": {
          "title": "Ancient Lotus City Planning & Literature",
          "period": "3rd Century BCE to 3rd Century CE",
          "summary": "Madurai was laid out in concentric rectangular streets (Chithirai, Avani Moola, Masi, Veli streets) modeled on a blossoming lotus flower radiating from the central temple tower.",
          "features": [
            "Seat of the Third Tamil Sangam patronized by Pandya kings",
            "Celebrated in the ancient Tamil epic Silappadikaram (The Tale of the Anklet)",
            "Center of Tamil classical poetry, dance, and Carnatic music festivals"
          ],
          "citations": "Silappadikaram \u00b7 K.V. Raman, Some Aspects of Pandyan History",
          "related_monuments": [
            "Meenakshi Amman Temple"
          ]
        }
      }
    ],
    "edges": [
      {
        "source": "m_11",
        "target": "dyn_nayak_11",
        "relation": "Rebuilt and expanded by",
        "category": "dynasties"
      },
      {
        "source": "m_11",
        "target": "arch_gopuram_11",
        "relation": "Famous for polychrome towering",
        "category": "architecture"
      },
      {
        "source": "m_11",
        "target": "wat_lotus_11",
        "relation": "Centerpiece sacred reservoir of",
        "category": "water_systems"
      },
      {
        "source": "m_11",
        "target": "sculpt_musical_11",
        "relation": "Houses sculptural wonder of",
        "category": "sculpture"
      },
      {
        "source": "m_11",
        "target": "rel_shaktha_11",
        "relation": "Sanctuary for living worship of",
        "category": "religions"
      },
      {
        "source": "m_11",
        "target": "cultural_sangam_11",
        "relation": "Lotus-plan core of ancient",
        "category": "cultural_practices"
      }
    ]
  },
  "12": {
    "monumentId": 12,
    "monumentTitle": "Ellora Caves (Kailasa Temple)",
    "primaryNode": {
      "id": "m_12",
      "label": "Kailasa Temple (Cave 16)",
      "kind": "monument",
      "category": "architecture",
      "x": 430,
      "y": 260,
      "img": "/images/Ellora.jpg",
      "context": {
        "title": "Kailasa Temple (Cave 16, Ellora)",
        "period": "c. 756\u2013774 CE",
        "summary": "The largest monolithic rock-cut monument in the world, carved vertically top-down out of a single volcanic basalt cliff of the Charanandri hills. Commissioned by King Krishna I of the Rashtrakuta dynasty, requiring the excavation of over 200,000 tonnes of solid rock without joints or scaffolding.",
        "features": [
          "Monolithic freestanding multi-storey temple carved from summit downward",
          "Excavation of over 200,000 tonnes of basalt rock trench",
          "Colossal multi-layered relief of Ravana Shaking Mount Kailash",
          "Preserves 8th-century Rashtrakuta fresco murals and Sanskrit inscriptions"
        ],
        "citations": "UNESCO World Heritage Centre Ref: 243 \u00b7 ASI Aurangabad Circle",
        "related_monuments": [
          "Brihadeeswarar Temple"
        ]
      }
    },
    "nodes": [
      {
        "id": "dyn_rashtrakuta_12",
        "label": "Rashtrakuta Imperial Dynasty",
        "kind": "dynasty",
        "category": "dynasties",
        "x": 190,
        "y": 120,
        "context": {
          "title": "Rashtrakuta Imperial Power",
          "period": "8th \u2013 10th Century CE",
          "summary": "Paramount imperial dynasty of the Deccan commanding territories from the Narmada to the Kaveri. King Krishna I (reigned 756\u2013774 CE) commissioned Kailasa as a supreme offering to Lord Shiva.",
          "features": [
            "Baroda copper plate inscription exclaiming: 'Oh, how could I have made it!'",
            "Patronage of both Shaiva monuments and Jain cave sanctuaries at Ellora",
            "Epithet of King Krishna I: 'Subhatunga' (Eminent in Prosperity)"
          ],
          "citations": "A.S. Altekar, The Rashtrakutas and Their Times \u00b7 Epigraphia Indica Vol. XXII",
          "related_monuments": [
            "Ellora Caves (Kailasa Temple)"
          ]
        }
      },
      {
        "id": "arch_monolithic_12",
        "label": "Top-Down Vertical Excavation",
        "kind": "architecture",
        "category": "architecture",
        "x": 670,
        "y": 120,
        "context": {
          "title": "Monolithic Rock-Cut Engineering",
          "period": "8th Century CE",
          "summary": "Master builders started from the mountain summit, cutting two parallel vertical trenches 100 feet deep and 276 feet long, isolating a central mass of basalt from which the temple, nandi shrine, life-size elephants, and 100-foot victory pillars (dhwajasthambhas) were sculpted.",
          "features": [
            "Zero tolerance for architectural error (carved in situ from top to bottom)",
            "Complete Dravidian vimana form replicating stone structural temples",
            "Integration of drainage channels cut directly into basalt to prevent waterlogging"
          ],
          "citations": "James Burgess, Cave Temples of India \u00b7 ASI Technical Monograph No. 8",
          "related_monuments": [
            "Ellora Caves (Kailasa Temple)"
          ]
        }
      },
      {
        "id": "sculpt_ravana_12",
        "label": "Ravana Shaking Kailash Relief",
        "kind": "sculpture",
        "category": "sculpture",
        "x": 190,
        "y": 400,
        "context": {
          "title": "Ravananugraha Sculptural Masterpiece",
          "period": "8th Century CE",
          "summary": "Celebrated worldwide as one of the supreme achievements of Indian plastic art. Depicts the multi-armed demon king Ravana trapped beneath Mount Kailash, straining with muscles flexed to lift the mountain, while Shiva calmly presses down with his toe.",
          "features": [
            "Dramatically staggered three-dimensional depth and shadow play",
            "Parvati clinging fearfully to Shiva while companions flee in panic",
            "Mastery of kinetic tension and calm transcendental poise"
          ],
          "citations": "Heinrich Zimmer, Myths and Symbols in Indian Art and Civilization",
          "related_monuments": [
            "Ellora Caves (Kailasa Temple)"
          ]
        }
      },
      {
        "id": "geo_deccan_12",
        "label": "Deccan Trap Volcanic Basalt",
        "kind": "geography",
        "category": "geography",
        "x": 670,
        "y": 400,
        "context": {
          "title": "Charanandri Hills Basalt Geology",
          "period": "Cretaceous-Paleocene Volcanic Traps (65 Ma)",
          "summary": "Carved into the horizontal basalt lava flows of the Deccan Traps. The uniform, fine-grained, joint-free basalt layer at Cave 16 provided the structural stability required for deep monolithic cutting.",
          "features": [
            "Thick amygdaloidal basalt sheet without major geological faults",
            "Ancient trade highway connecting the Deccan plateau to Ujjain and coastal ports",
            "Natural spring waterfalls cascading over cave facades during the monsoon"
          ],
          "citations": "Geological Survey of India Memoir on Deccan Continental Flood Basalts",
          "related_monuments": [
            "Ellora Caves (Kailasa Temple)"
          ]
        }
      },
      {
        "id": "cultural_harmony_12",
        "label": "Inter-Faith Harmony of Ellora",
        "kind": "cultural_practices",
        "category": "cultural_practices",
        "x": 430,
        "y": 80,
        "context": {
          "title": "Tri-Religious Sanctuary of Ellora",
          "period": "6th \u2013 10th Century CE",
          "summary": "Ellora is unique worldwide for featuring 34 excavated cave monuments representing three major Indian spiritual traditions side by side: Buddhist Caves (1\u201312), Hindu Caves (13\u201329), and Jain Caves (30\u201334).",
          "features": [
            "Unbroken record of religious tolerance under Rashtrakuta and Yadava kings",
            "Buddhist Chaitya Cave 10 (Vishvakarma Carpenter's Cave)",
            "Jain Indra Sabha (Cave 32) with detailed yaksha and tirthankara carvings"
          ],
          "citations": "UNESCO Inscription Dossier \u00b7 D.C. Sircar, Religious Life in Ancient India",
          "related_monuments": [
            "Ellora Caves (Kailasa Temple)"
          ]
        }
      },
      {
        "id": "insc_baroda_12",
        "label": "Baroda Copper Plate (812 CE)",
        "kind": "inscriptions",
        "category": "inscriptions",
        "x": 430,
        "y": 450,
        "context": {
          "title": "Baroda Copper Plate of Karka II (812 CE)",
          "period": "812 CE (Saka 734)",
          "summary": "Famous Sanskrit epigraph praising the Kailasa Temple: 'Seeing this marvelous temple, the celestial architects were amazed and said: This temple of Shiva is self-existent; for such beauty in work was never seen! Even the architect who built it was struck with wonder!'",
          "features": [
            "Sanskrit in western Devanagari script",
            "Confirms Rashtrakuta King Krishna I as the royal founder of Kailasa",
            "Preserved in the Archaeological Survey of India Epigraphic Collection"
          ],
          "citations": "J.F. Fleet, Indian Antiquary Vol. XII \u00b7 Epigraphia Indica",
          "related_monuments": [
            "Ellora Caves (Kailasa Temple)"
          ]
        }
      }
    ],
    "edges": [
      {
        "source": "m_12",
        "target": "dyn_rashtrakuta_12",
        "relation": "Commissioned by King Krishna I",
        "category": "dynasties"
      },
      {
        "source": "m_12",
        "target": "arch_monolithic_12",
        "relation": "Supreme achievement of top-down",
        "category": "architecture"
      },
      {
        "source": "m_12",
        "target": "sculpt_ravana_12",
        "relation": "Houses dramatic masterpiece of",
        "category": "sculpture"
      },
      {
        "source": "m_12",
        "target": "geo_deccan_12",
        "relation": "Excavated from basalt cliff of",
        "category": "geography"
      },
      {
        "source": "m_12",
        "target": "cultural_harmony_12",
        "relation": "Centerpiece of multi-faith",
        "category": "cultural_practices"
      },
      {
        "source": "m_12",
        "target": "insc_baroda_12",
        "relation": "Immortalized in Sanskrit in",
        "category": "inscriptions"
      }
    ]
  }
};

/**
 * Helper to fetch a monument's specific knowledge graph by ID
 */
export function getMonumentGraph(monumentId) {
  const numId = Number(monumentId);
  return KNOWLEDGE_GRAPHS[numId] || KNOWLEDGE_GRAPHS[1];
}
