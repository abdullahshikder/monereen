export type Story = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  body: string[];
  pullQuote: string;
};

export const stories: Story[] = [
  {
    slug: "the-language-of-the-kaftan",
    category: "Dress",
    title: "The language of the kaftan.",
    excerpt:
      "A familiar silhouette becomes personal through proportion, print, and the way it moves with its wearer.",
    image: "/brand/editorial/kaftan-silk.jpg",
    imageAlt: "Monereen silk kaftan in motion",
    body: [
      "For Monereen, the kaftan is a starting point rather than a fixed formula. Its ease gives every detail room to speak: a generous sleeve, a quiet neckline, a print that changes as the cloth moves.",
      "The work begins with the person who will wear it. Colour, scale, and shape are considered together so the final piece feels natural, expressive, and entirely their own.",
    ],
    pullQuote: "A form with history can still make room for a new point of view.",
  },
  {
    slug: "jamdani-held-close",
    category: "Textile",
    title: "Jamdani, held close.",
    excerpt:
      "Looking to an enduring Bengali textile tradition with care, curiosity, and a contemporary eye.",
    image: "/brand/archive/prints-detail.jpg",
    imageAlt: "Close view of a detailed Monereen textile print",
    body: [
      "Textile knowledge lives in the repetition of careful acts. The Jamdani series begins with respect for that knowledge and a commitment to keep the material presence of the cloth visible in every piece.",
      "Rather than treating tradition as a surface, the collection considers how pattern, texture, and handwork can guide a modern wardrobe without losing the specificity of where those ideas come from.",
    ],
    pullQuote: "The cloth carries more than a motif. It carries a way of making.",
  },
  {
    slug: "colour-is-a-way-of-speaking",
    category: "Colour",
    title: "Colour is a way of speaking.",
    excerpt:
      "From vivid prints to single-colour studies, tone creates the first conversation between a garment and its wearer.",
    image: "/brand/editorial/print-red.jpg",
    imageAlt: "Monereen red printed garment",
    body: [
      "Colour is never an afterthought in the studio. It can hold a mood, sharpen a line, or soften an unfamiliar shape. A saturated red, a deep violet, and a quiet neutral each ask a garment to behave differently.",
      "That attention makes the collection feel open rather than uniform. The aim is not to prescribe one way of dressing, but to offer a palette where people can recognise themselves.",
    ],
    pullQuote: "A palette can be expressive without becoming loud.",
  },
  {
    slug: "a-practice-of-return",
    category: "Studio",
    title: "A practice of return.",
    excerpt:
      "Monereen returns to form, technique, and personal expression to make a more deliberate kind of fashion.",
    image: "/brand/editorial/solid-duo.jpg",
    imageAlt: "Two Monereen solid-colour looks",
    body: [
      "A considered practice is built through return: to the cut that needs one more adjustment, to a fabric that reveals something new in the hand, and to the people who bring a collection to life.",
      "That cycle keeps Monereen grounded. Each season can move forward while staying connected to the craft, relationships, and local material intelligence that give the work its character.",
    ],
    pullQuote: "Progress comes from paying closer attention to what is already here.",
  },
];

export function getStory(slug: string) {
  return stories.find((story) => story.slug === slug);
}
