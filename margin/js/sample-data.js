/* Margin — SAMPLE study data. Illustrative only: every figure in the documentation pages is drawn
   from this one file, so charts and layouts stay consistent with each other. Replace with the real
   study data before any page is used in the report. Participants are codes; there are no names. */
(function () {
  var P = ['P01', 'P02', 'P03', 'P04', 'P05', 'P06'];
  var TASKS = ['Check a spend before paying', 'Find where money went', 'Notice an upcoming plan', 'Add a plan'];
  var VERS = ['V01', 'V02', 'V03'];
  // [completed, with help, not completed] per task per version
  var OUT = {
    'Check a spend before paying': { V01: [3, 1, 2], V02: [5, 1, 0], V03: [6, 0, 0] },
    'Find where money went':       { V01: [4, 1, 1], V02: [5, 0, 1], V03: [5, 1, 0] },
    'Notice an upcoming plan':     { V01: [1, 1, 4], V02: [2, 1, 3], V03: [5, 0, 1] },
    'Add a plan':                  { V01: [2, 2, 2], V02: [4, 1, 1], V03: [5, 1, 0] }
  };
  var THEMES = ['Social pull', 'Mess quality', 'Running late', 'Future-blind', 'Adjust later', 'Treat-self'];
  var CODING = [[1,0,1,1,1,0],[1,1,1,1,0,1],[1,1,0,1,1,0],[0,1,0,1,1,1],[1,0,1,0,1,0],[1,1,0,1,0,1]];
  var TIME = { V01: [96, 108, 116, 150], V02: [38, 42, 46, 50, 61, 75], V03: [30, 34, 39, 41, 44, 52] };
  var SUS = { V01: [45, 52.5, 57.5, 60, 62.5, 70], V02: [62.5, 65, 70, 72.5, 77.5, 80], V03: [70, 75, 77.5, 80, 85, 87.5] };
  var ISSUES = [
    [1, 'Plan cue below the fold', 4, 3], [2, 'Suggestion read as an instruction', 5, 3], [3, '“Free to spend” read as a budget', 3, 4],
    [4, 'Category rename hidden', 2, 2], [5, '“Noted” button unclear', 1, 1], [6, 'Amount keypad slow', 2, 1], [7, 'Plans tab empty state', 3, 2]
  ];
  var LIKERT = [ // SD, D, N, A, SA
    ['The app told me what to do', { V01: [0, 1, 1, 2, 2], V02: [0, 1, 1, 3, 1], V03: [2, 3, 1, 0, 0] }],
    ['I saw what was coming up this week', { V01: [2, 2, 1, 1, 0], V02: [1, 2, 1, 2, 0], V03: [0, 0, 1, 3, 2] }]
  ];
  // Diary events: [participant, day, hour, amount, kind, place, what]. kind: o ordinary, p planned, u unexpected
  var EV = [
    ['P01',1,9.5,40,'o','Tapri','chai'],['P01',1,19,180,'o','Canteen','dinner'],['P01',2,13,120,'o','Canteen','lunch'],['P01',3,18,450,'p','Mall','shoes, planned'],['P01',4,21,250,'u','Delivery','order'],['P01',5,10,60,'o','Gate','auto'],['P01',6,20,300,'p','Mall','movie'],
    ['P02',1,10,60,'o','Gate','auto'],['P02',1,17,120,'o','Tapri','chai + snack'],['P02',2,13,120,'o','Canteen','lunch'],['P02',3,13.7,90,'u','Gate','auto, running late'],['P02',3,20.25,280,'u','Delivery','dinner order — mess was bad'],['P02',4,16,60,'o','Tapri','chai'],['P02',5,19.5,1500,'p','Mall','birthday dinner'],['P02',5,11,140,'o','Canteen','brunch'],['P02',6,18,210,'o','Market','groceries'],
    ['P03',1,8.5,30,'o','Tapri','chai'],['P03',1,20.5,320,'u','Delivery','order'],['P03',2,12,100,'o','Canteen','lunch'],['P03',3,17,650,'p','Market','stationery'],['P03',4,20.3,280,'u','Delivery','order'],['P03',5,9,50,'o','Tapri','chai'],['P03',6,19,800,'p','Mall','gift'],
    ['P04',1,13,110,'o','Canteen','lunch'],['P04',2,21,170,'u','Delivery','late snack'],['P04',2,10,20,'o','Tapri','chai'],['P04',3,19,380,'o','Market','groceries'],['P04',4,22,130,'u','Delivery','order'],['P04',5,12.5,150,'o','Canteen','lunch'],['P04',6,18.5,1000,'p','Mall','concert'],['P04',6,9,30,'o','Tapri','chai'],
    ['P05',1,14,90,'o','Gate','auto'],['P05',2,18,220,'o','Market','groceries'],['P05',3,20,500,'p','Mall','dinner out'],['P05',3,8,40,'o','Tapri','chai'],['P05',4,13,160,'o','Canteen','lunch'],['P05',5,19,1200,'p','Mall','phone repair'],['P05',6,16,65,'u','Gate','auto'],
    ['P06',1,19,200,'o','Canteen','dinner'],['P06',2,21,350,'u','Delivery','order with friends'],['P06',3,12,140,'o','Canteen','lunch'],['P06',3,17,55,'o','Tapri','chai + snack'],['P06',4,20,420,'o','Market','groceries'],['P06',5,21.5,240,'u','Delivery','order'],['P06',6,19.5,1500,'p','Mall','birthday dinner'],['P06',6,10,85,'o','Gate','auto']
  ];
  var SHAPE = { o: 'dot', p: 'square', u: 'diamond' };
  var KIND = { o: 'Ordinary', p: 'Planned', u: 'Unexpected' };
  window.MarginSample = { P: P, TASKS: TASKS, VERS: VERS, OUT: OUT, THEMES: THEMES, CODING: CODING, TIME: TIME, SUS: SUS, ISSUES: ISSUES, LIKERT: LIKERT, EV: EV, SHAPE: SHAPE, KIND: KIND };
})();
