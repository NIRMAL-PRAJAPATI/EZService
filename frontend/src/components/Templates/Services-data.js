// Organize services by category with page-specific content
export const servicesData = {
    renovation: {
      hero: {
        title: "Transform Your Living Space",
        description:
          "Professional home renovation services for every room in your house. Quality craftsmanship and attention to detail that exceeds expectations.",
        backgroundImage: "/placeholder.svg?height=800&width=1600",
        backgroundAlt: "Home Renovation",
      },
      services: {
        title: "Our Renovation Services",
        description: "Comprehensive renovation solutions for every part of your home",
        services: [
          {
            id: "kitch-rem",
            imageSrc: "https://placehold.co/400x300/e0e7ff/3f51b5?text=Kitchen",
            altText: "Kitchen Remodeling",
            title: "Kitchen Remodeling",
            description: "Complete kitchen renovation with custom cabinets, countertops, and modern appliances.",
            price: "$15,000",
          },
          {
            id: "bath-ren",
            imageSrc: "https://placehold.co/400x300/e0f2f7/007bff?text=Bathroom",
            altText: "Bathroom Renovation",
            title: "Bathroom Renovation",
            description: "Transform your bathroom with new fixtures, tiles, and modern designs.",
            price: "$8,000",
          },
          {
            id: "base-fin",
            imageSrc: "https://placehold.co/400x300/fff3e0/ff9800?text=Basement",
            altText: "Basement Finishing",
            title: "Basement Finishing",
            description: "Convert your basement into a functional living space, home theater, or gym.",
            price: "$20,000",
          },
        ],
      },
    },
    wedding: {
      hero: {
        title: "Your Dream Wedding Awaits",
        description:
          "Complete wedding planning and coordination services to make your special day perfect. From venue booking to photography, we handle every detail.",
        backgroundImage: "/placeholder.svg?height=800&width=1600",
        backgroundAlt: "Wedding Planning",
      },
      services: {
        title: "Our Wedding Services",
        description: "Complete wedding planning and coordination services for your special day",
        services: [
          {
            id: "venue-booking",
            imageSrc: "https://placehold.co/400x300/e0e7ff/3f51b5?text=Venue+Booking",
            altText: "Venue Booking",
            title: "Venue Booking",
            description: "Banquet halls, outdoor venues, resorts, destination wedding locations",
            price: "$15,000",
          },
          {
            id: "event-planning",
            imageSrc: "https://placehold.co/400x300/e0f2f7/007bff?text=Event+Planning",
            altText: "Event Planning & Coordination",
            title: "Event Planning & Coordination",
            description: "Wedding planner, day-of coordinator, logistics management",
            price: "$8,000",
          },
          {
            id: "photography",
            imageSrc: "https://placehold.co/400x300/fff3e0/ff9800?text=Photography",
            altText: "Photography & Videography",
            title: "Photography & Videography",
            description: "Pre-wedding shoot, candid photography, cinematic wedding films, drone coverage",
            price: "$20,000",
          },
        ],
      },
    },
    catering: {
      hero: {
        title: "Exceptional Catering Services",
        description:
          "Delicious catering solutions for weddings, corporate events, and special celebrations. Fresh ingredients and professional service guaranteed.",
        backgroundImage: "/placeholder.svg?height=800&width=1600",
        backgroundAlt: "Catering Services",
      },
      services: {
        title: "Our Catering Services",
        description: "Delicious catering options for all your events and celebrations",
        services: [
          {
            id: "wedding-catering",
            imageSrc: "https://placehold.co/400x300/f3e5f5/9c27b0?text=Wedding+Catering",
            altText: "Wedding Catering",
            title: "Wedding Catering",
            description: "Multi-course wedding meals, buffet options, dietary accommodations",
            price: "$12,000",
          },
          {
            id: "corporate-catering",
            imageSrc: "https://placehold.co/400x300/e8f5e8/4caf50?text=Corporate+Catering",
            altText: "Corporate Catering",
            title: "Corporate Catering",
            description: "Business lunch, conference catering, office party food services",
            price: "$5,000",
          },
          {
            id: "party-catering",
            imageSrc: "https://placehold.co/400x300/fff8e1/ffc107?text=Party+Catering",
            altText: "Party Catering",
            title: "Party Catering",
            description: "Birthday parties, anniversaries, family gatherings, custom menus",
            price: "$3,000",
          },
        ],
      },
    },
    appliances: {
      hero: {
        title: "Home Appliance Solutions",
        description:
          "Professional appliance repair, installation, and maintenance services. We service all major brands with certified technicians and genuine parts.",
        backgroundImage: "/placeholder.svg?height=800&width=1600",
        backgroundAlt: "Home Appliances Service",
      },
      services: {
        title: "Our Home Appliance Services",
        description: "Expert repair and maintenance for all your home appliances",
        services: [
          {
            id: "refrigerator-repair",
            imageSrc: "https://placehold.co/400x300/e3f2fd/1976d2?text=Refrigerator+Repair",
            altText: "Refrigerator Repair",
            title: "Refrigerator Repair & Service",
            description: "Complete refrigerator repair, maintenance, and installation services for all brands",
            price: "$150",
          },
          {
            id: "washing-machine",
            imageSrc: "https://placehold.co/400x300/f3e5f5/7b1fa2?text=Washing+Machine",
            altText: "Washing Machine Service",
            title: "Washing Machine Service",
            description: "Washing machine repair, drum cleaning, and maintenance services",
            price: "$120",
          },
          {
            id: "ac-service",
            imageSrc: "https://placehold.co/400x300/e8f5e8/388e3c?text=AC+Service",
            altText: "Air Conditioner Service",
            title: "Air Conditioner Service",
            description: "AC installation, repair, gas filling, and regular maintenance services",
            price: "$200",
          },
          {
            id: "microwave-repair",
            imageSrc: "https://placehold.co/400x300/fff3e0/f57c00?text=Microwave+Repair",
            altText: "Microwave Repair",
            title: "Microwave Oven Repair",
            description: "Microwave repair, magnetron replacement, and electrical component fixes",
            price: "$80",
          },
          {
            id: "dishwasher-service",
            imageSrc: "https://placehold.co/400x300/fce4ec/c2185b?text=Dishwasher",
            altText: "Dishwasher Service",
            title: "Dishwasher Service",
            description: "Dishwasher installation, repair, and maintenance for optimal performance",
            price: "$130",
          },
          {
            id: "oven-repair",
            imageSrc: "https://placehold.co/400x300/f1f8e9/689f38?text=Oven+Repair",
            altText: "Oven Repair",
            title: "Oven & Stove Repair",
            description: "Gas and electric oven repair, burner replacement, and safety inspections",
            price: "$160",
          },
        ],
      },
    },
    beauty: {
      hero: {
        title: "Luxury Beauty & Spa Experience",
        description:
          "Indulge in premium beauty treatments and relaxing spa services. Our certified professionals use high-quality products for the ultimate wellness experience.",
        backgroundImage: "/placeholder.svg?height=800&width=1600",
        backgroundAlt: "Beauty & Spa Services",
      },
      services: {
        title: "Our Beauty & Spa Services",
        description: "Premium beauty treatments and relaxing spa experiences",
        services: [
          {
            id: "facial-treatment",
            imageSrc: "https://placehold.co/400x300/fce4ec/e91e63?text=Facial+Treatment",
            altText: "Facial Treatment",
            title: "Premium Facial Treatments",
            description: "Deep cleansing, anti-aging, hydrating facials with organic products",
            price: "$120",
          },
          {
            id: "massage-therapy",
            imageSrc: "https://placehold.co/400x300/e8f5e8/4caf50?text=Massage+Therapy",
            altText: "Massage Therapy",
            title: "Therapeutic Massage",
            description: "Swedish, deep tissue, hot stone, and aromatherapy massage sessions",
            price: "$150",
          },
          {
            id: "hair-styling",
            imageSrc: "https://placehold.co/400x300/f3e5f5/9c27b0?text=Hair+Styling",
            altText: "Hair Styling",
            title: "Hair Styling & Treatment",
            description: "Professional haircuts, coloring, styling, and hair treatment services",
            price: "$80",
          },
          {
            id: "manicure-pedicure",
            imageSrc: "https://placehold.co/400x300/fff3e0/ff9800?text=Nail+Care",
            altText: "Manicure Pedicure",
            title: "Manicure & Pedicure",
            description: "Professional nail care, gel polish, nail art, and cuticle treatments",
            price: "$60",
          },
          {
            id: "body-treatments",
            imageSrc: "https://placehold.co/400x300/e3f2fd/2196f3?text=Body+Treatment",
            altText: "Body Treatments",
            title: "Body Scrub & Wrap",
            description: "Exfoliating body scrubs, detox wraps, and moisturizing treatments",
            price: "$180",
          },
          {
            id: "eyebrow-lash",
            imageSrc: "https://placehold.co/400x300/f1f8e9/8bc34a?text=Eyebrow+Lash",
            altText: "Eyebrow & Lash Services",
            title: "Eyebrow & Lash Services",
            description: "Eyebrow shaping, threading, lash extensions, and tinting services",
            price: "$45",
          },
        ],
      },
    },
    party: {
      hero: {
        title: "Unforgettable Party Experiences",
        description:
          "Complete party planning and supplies for birthdays, celebrations, and special events. From decorations to entertainment, we make every party memorable.",
        backgroundImage: "/placeholder.svg?height=800&width=1600",
        backgroundAlt: "Party Planning Services",
      },
      services: {
        title: "Our Party Services",
        description: "Everything you need for the perfect celebration",
        services: [
          {
            id: "birthday-party",
            imageSrc: "https://placehold.co/400x300/fff3e0/ff9800?text=Birthday+Party",
            altText: "Birthday Party Planning",
            title: "Birthday Party Planning",
            description: "Complete birthday party setup with themes, decorations, and entertainment",
            price: "$500",
          },
          {
            id: "party-decorations",
            imageSrc: "https://placehold.co/400x300/f3e5f5/e91e63?text=Decorations",
            altText: "Party Decorations",
            title: "Party Decorations & Setup",
            description: "Balloon arrangements, banners, table settings, and themed decorations",
            price: "$300",
          },
          {
            id: "dj-entertainment",
            imageSrc: "https://placehold.co/400x300/e3f2fd/2196f3?text=DJ+Entertainment",
            altText: "DJ & Entertainment",
            title: "DJ & Entertainment Services",
            description: "Professional DJ, sound system, lighting, and entertainment coordination",
            price: "$400",
          },
          {
            id: "photo-booth",
            imageSrc: "https://placehold.co/400x300/e8f5e8/4caf50?text=Photo+Booth",
            altText: "Photo Booth Rental",
            title: "Photo Booth Rental",
            description: "Fun photo booth with props, instant prints, and digital gallery",
            price: "$250",
          },
          {
            id: "party-supplies",
            imageSrc: "https://placehold.co/400x300/fce4ec/9c27b0?text=Party+Supplies",
            altText: "Party Supplies",
            title: "Party Supplies & Rentals",
            description: "Tables, chairs, linens, plates, glasses, and party equipment rental",
            price: "$200",
          },
          {
            id: "kids-entertainment",
            imageSrc: "https://placehold.co/400x300/f1f8e9/689f38?text=Kids+Fun",
            altText: "Kids Entertainment",
            title: "Kids Entertainment",
            description: "Clowns, magicians, face painting, games, and interactive activities for kids",
            price: "$350",
          },
        ],
      },
    },
  
  }
  