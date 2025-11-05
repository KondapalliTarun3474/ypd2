import { Routine } from '../types';

export const routines: Routine[] = [
  {
    id: 1,
    name: 'Surya Namaskar',
    description: 'The complete Sun Salutation sequence with 12 powerful asanas',
    difficulty: 'beginner',
    asanas: [
      {
        id: 1,
        name: 'Pranamasana',
        sanskritName: 'Prayer Pose',
        image: 'https://images.pexels.com/photos/3822356/pexels-photo-3822356.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: 2,
        name: 'Hastauttanasana',
        sanskritName: 'Raised Arms Pose',
        image: 'https://images.pexels.com/photos/3822455/pexels-photo-3822455.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: 3,
        name: 'Hastapadasana',
        sanskritName: 'Standing Forward Bend',
        image: 'https://images.pexels.com/photos/3822164/pexels-photo-3822164.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: 4,
        name: 'Right Ashwa Sanchalanasana',
        sanskritName: 'Equestrian Pose - Right Leg',
        image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: 6,
        name: 'Dandasana',
        sanskritName: 'Plank Pose',
        image: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: 7,
        name: 'Ashtanga Namaskara',
        sanskritName: 'Eight Limbed Pose',
        image: 'https://images.pexels.com/photos/3822668/pexels-photo-3822668.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: 8,
        name: 'Bhujangasana',
        sanskritName: 'Cobra Pose',
        image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: 9,
        name: 'Adho Mukha Svanasana',
        sanskritName: 'Downward Facing Dog',
        image: 'https://images.pexels.com/photos/3822356/pexels-photo-3822356.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: 5,
        name: 'Left Ashwa Sanchalanasana',
        sanskritName: 'Equestrian Pose - Left Leg',
        image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    ]
  },
  {
    id: 2,
    name: 'Beginner Flow',
    description: 'A gentle introduction to yoga with foundational poses',
    difficulty: 'beginner',
    asanas: [
      {
        id: 1,
        name: 'Mountain Pose',
        sanskritName: 'Tadasana',
        image: 'https://images.pexels.com/photos/3822455/pexels-photo-3822455.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: 2,
        name: 'Child Pose',
        sanskritName: 'Balasana',
        image: 'https://images.pexels.com/photos/3822668/pexels-photo-3822668.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: 3,
        name: 'Cat-Cow Pose',
        sanskritName: 'Marjaryasana-Bitilasana',
        image: 'https://images.pexels.com/photos/3822164/pexels-photo-3822164.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    ]
  },
  {
    id: 3,
    name: 'Power Yoga',
    description: 'Dynamic and challenging sequence for strength building',
    difficulty: 'advanced',
    asanas: [
      {
        id: 1,
        name: 'Warrior I',
        sanskritName: 'Virabhadrasana I',
        image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: 2,
        name: 'Warrior II',
        sanskritName: 'Virabhadrasana II',
        image: 'https://images.pexels.com/photos/3822455/pexels-photo-3822455.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      {
        id: 3,
        name: 'Side Plank',
        sanskritName: 'Vasisthasana',
        image: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=800'
      }
    ]
  }
];
