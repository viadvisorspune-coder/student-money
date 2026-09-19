import type { Bucket, Plan, Txn } from './types'

/**
 * Demo data for Parisha, September 2026 (CLAUDE.md §1) — ported verbatim from
 * prototype/screens-v2.js. Replace this module when a real account feed lands;
 * nothing else in the app reads a literal amount.
 */

export const BUCKETS: Bucket[] = [
  {
    id: 'eat',
    name: 'Eating',
    icon: 'food',
    color: 'coral',
    usual: [2600, 3400],
    outlets: [
      { id: 'del', name: 'Delivery apps', vendors: ['Swiggy', 'Zomato'] },
      { id: 'cafe', name: 'Cafés', vendors: ['Third Wave Coffee', 'Café Goodluck', 'Starbucks'] },
      { id: 'tapri', name: 'Tapri & canteen', vendors: ['Chai tapri', 'College canteen'] },
    ],
  },
  {
    id: 'goka',
    name: 'Gokhaana',
    icon: 'food',
    color: 'butter',
    usual: [500, 800],
    outlets: [
      { id: 'thali', name: 'Thali', vendors: ['Gokhaana'] },
      { id: 'mess', name: 'Mess plan', vendors: ['Annapurna Mess'] },
    ],
  },
  {
    id: 'store',
    name: '7-Eleven',
    icon: 'receipt',
    color: 'blush',
    usual: [300, 600],
    outlets: [
      { id: 'snacks', name: 'Late-night snacks', vendors: ['7-Eleven'] },
      { id: 'kirana', name: 'Kirana runs', vendors: ['Kirana store'] },
    ],
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: 'bus',
    color: 'sky',
    usual: [1200, 1800],
    outlets: [
      { id: 'cab', name: 'Cabs & autos', vendors: ['Uber', 'Rapido'] },
      { id: 'train', name: 'Trains', vendors: ['IRCTC'] },
    ],
  },
  {
    id: 'subs',
    name: 'Subscriptions',
    icon: 'play',
    color: 'sunflower',
    usual: [300, 350],
    outlets: [
      { id: 'music', name: 'Music', vendors: ['Spotify'] },
      { id: 'stream', name: 'Streaming', vendors: ['Netflix'] },
    ],
  },
  {
    id: 'shop',
    name: 'Shopping',
    icon: 'bag',
    color: 'grey',
    usual: [1400, 2600],
    outlets: [
      { id: 'online', name: 'Online', vendors: ['Myntra', 'Amazon'] },
      { id: 'events', name: 'Movies & events', vendors: ['BookMyShow'] },
    ],
  },
  {
    id: 'ess',
    name: 'Essentials',
    icon: 'receipt',
    color: 'soft',
    usual: [700, 1100],
    outlets: [
      { id: 'groc', name: 'Groceries', vendors: ['Blinkit'] },
      { id: 'phone', name: 'Phone & internet', vendors: ['Airtel'] },
    ],
  },
]

/** day, time, vendor, "for?" (the payment remark), amount, bucket, social outing?, planned ahead? */
type Row = [number, string, string, string, number, string | null, 0 | 1, 0 | 1]

const ROWS: Row[] = [
  [1, '09:05', 'Papa', 'Pocket money for September', 8000, 'income', 0, 0],
  [1, '09:10', 'Airtel', 'Phone recharge', -299, 'ess', 0, 1],
  [1, '18:20', 'Spotify', 'Music subscription', -119, 'subs', 0, 1],
  [2, '21:40', 'Swiggy', 'Late-night dinner', -386, 'eat', 0, 0],
  [2, '17:10', 'Chai tapri', 'Chai after class', -30, 'eat', 1, 0],
  [3, '08:45', 'Rapido', 'Auto to college', -74, 'travel', 0, 0],
  [3, '13:10', 'College canteen', 'Lunch', -120, 'eat', 0, 0],
  [4, '19:30', 'Myntra', 'Kurta for Diwali', -1299, 'shop', 0, 1],
  [4, '16:00', 'Third Wave Coffee', 'Coffee with Riya', -280, 'eat', 1, 0],
  [5, '10:00', 'Scholarship', 'Merit scholarship', 2000, 'income', 0, 0],
  [5, '22:05', 'Zomato', 'Hostel dinner order', -452, 'eat', 0, 0],
  [6, '17:15', 'Uber', 'Cab to Koregaon Park', -318, 'travel', 1, 0],
  [6, '13:30', 'Gokhaana', 'Thali', -180, 'goka', 0, 0],
  [7, '11:40', 'Blinkit', 'Groceries and soap', -263, 'ess', 0, 0],
  [7, '23:10', '7-Eleven', 'Midnight snacks', -145, 'store', 0, 0],
  [8, '20:00', 'Netflix', 'Streaming subscription', -199, 'subs', 0, 1],
  [9, '21:15', 'Swiggy', 'Dinner with flatmates', -289, 'eat', 1, 0],
  [9, '17:45', 'Chai tapri', 'Chai and vada pav', -40, 'eat', 1, 0],
  [10, '11:02', 'Design client', 'Freelance – logo design', 4000, 'income', 0, 0],
  [12, '10:30', 'Tutoring', 'Weekend tuition batch', 4000, 'income', 0, 0],
  [10, '15:30', 'IRCTC', 'Train ticket home', -612, 'travel', 0, 1],
  [11, '13:05', 'College canteen', 'Lunch', -90, 'eat', 0, 0],
  [11, '18:30', 'Café Goodluck', 'Bun maska with Om', -340, 'eat', 1, 0],
  [12, '20:50', 'Swiggy', 'Dinner', -342, 'eat', 0, 0],
  [12, '16:25', 'Amazon', 'Notebooks and pens', -481, 'shop', 0, 1],
  [13, '09:20', 'Rapido', 'Auto to class', -96, 'travel', 0, 0],
  [13, '13:40', 'Gokhaana', 'Thali', -160, 'goka', 0, 0],
  [14, '22:30', 'Zomato', 'Sunday treat', -518, 'eat', 1, 0],
  [14, '12:10', 'Blinkit', 'Detergent and milk', -187, 'ess', 0, 0],
  [15, '18:40', 'Uber', 'Cab to FC Road', -300, 'travel', 1, 0],
  [15, '16:50', 'Starbucks', 'Coffee before movie', -270, 'eat', 1, 0],
  [16, '21:40', 'Swiggy', 'Dinner after movie', -400, 'eat', 1, 0],
  [16, '19:05', 'BookMyShow', 'Movie with hostel group', -350, 'shop', 1, 1],
  [16, '23:30', '7-Eleven', 'Snacks', -115, 'store', 0, 0],
  [17, '13:15', 'College canteen', 'Lunch', -110, 'eat', 0, 0],
  [17, '17:20', 'Chai tapri', 'Chai', -30, 'eat', 1, 0],
  [17, '20:10', 'Swiggy', 'Dinner', -163, 'eat', 0, 0],
  // One payment the app could not read a remark for: it surfaces as "needs a label".
  [12, '19:15', '98XXXXXX', '', -1000, null, 0, 0],
]

const FREQUENT = /Swiggy|Zomato|Rapido|College canteen|Chai tapri/

export const TXNS: Txn[] = ROWS.map((r, i) => ({
  id: 't' + i,
  day: r[0],
  time: r[1],
  vendor: r[2],
  forLabel: r[3],
  amount: r[4],
  bucket: r[5] === 'income' ? null : r[5],
  income: r[5] === 'income',
  social: !!r[6],
  planned: !!r[7],
  outlet: null,
  note: '',
  frequent: FREQUENT.test(r[2]),
}))

export const PLANS: Plan[] = [
  {
    id: 'p1',
    section: 'scheduled',
    title: 'Vartika’s birthday',
    when: '25 Sep',
    amount: '1,500',
    notes: 'Cake with Riya and Om, gift still undecided',
    done: false,
  },
  {
    id: 'p2',
    section: 'scheduled',
    title: 'Doctor’s appointment for skin',
    when: 'Tomorrow, 6:00 PM',
    amount: '',
    notes: '',
    done: false,
  },
  {
    id: 'p3',
    section: 'tbd',
    title: 'Goa trip',
    when: '25–28 Sep',
    amount: '6,000',
    notes: 'Sharing a room with Riya. Cheaper if we take the train.',
    done: false,
  },
  {
    id: 'p4',
    section: 'tbd',
    title: 'Might go to Lonavala for Dad’s birthday?',
    when: '',
    amount: '',
    notes: '',
    done: false,
  },
]
