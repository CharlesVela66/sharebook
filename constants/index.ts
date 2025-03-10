export const navItems = [
  {
    id: 1,
    name: 'Home',
    path: '/',
    icon: '/icons/home.svg',
  },
  {
    id: 2,
    name: 'My Books',
    path: '/my-books',
    icon: '/icons/book.svg',
  },
  {
    id: 3,
    name: 'Friends',
    path: '/my-friends',
    icon: '/icons/friends.svg',
  },
  {
    id: 4,
    name: 'Groups',
    path: '/my-groups',
    icon: '/icons/globe.svg',
  },
];

export const books = [
  {
    id: 1,
    name: 'The Power of Habit: Why We Do What We Do in Life and Business',
    author: 'Charles Duhigg',
    description:
      'A young woman walks into a laboratory. Over the past two years, she has transformed almost every aspect of her life. She has quit smoking, run a marathon, and been promoted at work. The patterns inside her brain, neurologists discover, have fundamentally changed.',
    rating: 4.0,
    numberRatings: 20000,
    pageCount: 375,
    publishedDate: 'April 25, 2012',
    categories: [
      'Nonfiction',
      'Self Help',
      'Psychology',
      'Personal Development',
      'Productivity',
      'Audiobook',
      'Science',
      'Leadership',
    ],
    coverImage: '/images/thepowerofhabit.jpg',
  },
  {
    id: 2,
    name: 'Becoming Supernatural: How Common People Are Doing the Uncommon',
    author: 'Joe Dispenza',
    description:
      'The author of the New York Times bestseller You Are the Placebo, as well as Breaking the Habit of Being Yourself and Evolve Your Brain, draws on research conducted at his advanced workshops since 2012 to explore how common people are doing the uncommon to transform themselves and their lives.',
    rating: 4.2,
    numberRatings: 20000,
    pageCount: 375,
    publishedDate: 'October 31st, 2017',
    categories: [
      'Nonfiction',
      'Self Help',
      'Psychology',
      'Personal Development',
      'Productivity',
      'Audiobook',
      'Science',
      'Leadership',
    ],
    coverImage: '/images/becomingsupernatural.jpg',
  },
  {
    id: 3,
    name: 'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    author: 'James Clear',
    description:
      'No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear, one of the world’s leading experts on habit formation, reveals practical strategies to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
    rating: 4.8,
    numberRatings: 100000,
    pageCount: 320,
    publishedDate: 'October 16, 2018',
    categories: [
      'Nonfiction',
      'Self Help',
      'Psychology',
      'Personal Development',
      'Productivity',
      'Audiobook',
      'Science',
      'Leadership',
    ],
    coverImage: '/images/atomichabits.jpg',
  },
];

export const users = [
  {
    id: 1,
    name: 'Carlos Velasco',
    profilePic: '/images/profile-pic.png',
    email: 'carlosed.velasco@gmail.com',
    username: 'charlesvelaa',
    dateOfBirth: 'April 9th, 2003',
    country: 'Mexico',
    createdAt: 'February 2nd, 2025',
    readingGoal: null,
    friends: null,
  },
];

export enum Status {
  'WantToRead',
  'CurrentlyReading',
  'Read',
}

export const usersBooks = [
  {
    id: 1,
    idUser: 1,
    idBook: 1,
    status: Status.CurrentlyReading,
    ratingGiven: null,
  },
  {
    id: 2,
    idUser: 1,
    idBook: 2,
    status: Status.Read,
    ratingGiven: 5,
  },
  {
    id: 1,
    idUser: 1,
    idBook: 1,
    status: Status.WantToRead,
    ratingGiven: null,
  },
];
