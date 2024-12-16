import { v4 as uuidv4 } from "uuid";
interface Person {
  id: string;
  name: string;
  role: string;
  bio: string;
  info: [
    {
      question: string;
      answer: string;
    },
    {
      question: string;
      answer: string;
    },
  ];
  video: string;
}

export const people: Person[] = [
  {
    id: uuidv4(),
    name: "Ali",
    role: "Developer",
    bio: "A mini headline/ bio of this person. Just enough to capture who they are.",
    video: "/team/ali.mp4",
    info: [
      {
        question: "What is your favorite color?",
        answer: "Blue",
      },
      {
        question: "What is your favorite food?",
        answer: "Pizza",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Alvin",
    role: "Developer",
    bio: "Alvin is a developer",
    video: "/team/alvin.mp4",
    info: [
      {
        question: "What is your favorite color?",
        answer: "Red",
      },
      {
        question: "What is your favorite food?",
        answer: "Pasta",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Ben",
    role: "Designer",
    bio: "Ben is a designer",
    video: "/team/ben.mp4",
    info: [
      {
        question: "What is your favorite color?",
        answer: "Green",
      },
      {
        question: "What is your favorite food?",
        answer: "Burger",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Chris",
    role: "Developer",
    bio: "Chris is a developer",
    video: "/team/chris.mp4",
    info: [
      {
        question: "What is your favorite color?",
        answer: "Purple",
      },
      {
        question: "What is your favorite food?",
        answer: "Sandwich",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Dennis",
    role: "Designer",
    bio: "Dennis is a designer",
    video: "/team/dennis.mp4",
    info: [
      {
        question: "What is your favorite color?",
        answer: "Yellow",
      },
      {
        question: "What is your favorite food?",
        answer: "Hotdog",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Jenny",
    role: "Developer",
    bio: "Jenny is a developer",
    video: "/team/jenny.mp4",
    info: [
      {
        question: "What is your favorite color?",
        answer: "Orange",
      },
      {
        question: "What is your favorite food?",
        answer: "Taco",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Jessica",
    role: "Designer",
    bio: "Jessica is a designer",
    video: "/team/jessica.mp4",
    info: [
      {
        question: "What is your favorite color?",
        answer: "Pink",
      },
      {
        question: "What is your favorite food?",
        answer: "Sushi",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Khadija",
    role: "Developer",
    bio: "Khadija is a developer",
    video: "/team/khadija.mp4",
    info: [
      {
        question: "What is your favorite color?",
        answer: "Brown",
      },
      {
        question: "What is your favorite food?",
        answer: "Salad",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Kiran",
    role: "Designer",
    bio: "Kiran is a designer",
    video: "/team/kiran.mp4",
    info: [
      {
        question: "What is your favorite color?",
        answer: "White",
      },
      {
        question: "What is your favorite food?",
        answer: "Soup",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Rafi",
    role: "Developer",
    bio: "Rafi is a developer",
    video: "/team/rafi.mp4",
    info: [
      {
        question: "What is your favorite color?",
        answer: "Black",
      },
      {
        question: "What is your favorite food?",
        answer: "Rice",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Ross",
    role: "Designer",
    bio: "Ross is a designer",
    video: "/team/ross.mp4",
    info: [
      {
        question: "What is your favorite color?",
        answer: "Gray",
      },
      {
        question: "What is your favorite food?",
        answer: "Steak",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Ryan",
    role: "Developer",
    bio: "Ryan is a developer",
    video: "/team/ryan.mp4",
    info: [
      {
        question: "What is your favorite color?",
        answer: "Cyan",
      },
      {
        question: "What is your favorite food?",
        answer: "Chicken",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Taha",
    role: "Designer",
    bio: "Taha is a designer",
    video: "/team/taha.mp4",
    info: [
      {
        question: "What is your favorite color?",
        answer: "Magenta",
      },
      {
        question: "What is your favorite food?",
        answer: "Fish",
      },
    ],
  },
];
