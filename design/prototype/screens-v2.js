(function(){
var SM=window.StudentMoney, h=React.createElement, F=SM.formatINR;
var useState=React.useState;
function cx(){return Array.prototype.filter.call(arguments,Boolean).join(' ');}

var TODAY=17, DAYS_IN_MONTH=30, OPENING=15000;
var BUCKETS0=[
 {id:'eat',name:'Eating',icon:'food',color:'coral',usual:[2600,3400],outlets:[
  {id:'del',name:'Delivery apps',vendors:['Swiggy','Zomato']},
  {id:'cafe',name:'Cafés',vendors:['Third Wave Coffee','Café Goodluck','Starbucks']},
  {id:'tapri',name:'Tapri & canteen',vendors:['Chai tapri','College canteen']}]},
 {id:'goka',name:'Gokhaana',icon:'food',color:'butter',usual:[500,800],outlets:[
  {id:'thali',name:'Thali',vendors:['Gokhaana']},{id:'mess',name:'Mess plan',vendors:['Annapurna Mess']}]},
 {id:'store',name:'7-Eleven',icon:'receipt',color:'blush',usual:[300,600],outlets:[
  {id:'snacks',name:'Late-night snacks',vendors:['7-Eleven']},{id:'kirana',name:'Kirana runs',vendors:['Kirana store']}]},
 {id:'travel',name:'Travel',icon:'bus',color:'sky',usual:[1200,1800],outlets:[
  {id:'cab',name:'Cabs & autos',vendors:['Uber','Rapido']},{id:'train',name:'Trains',vendors:['IRCTC']}]},
 {id:'subs',name:'Subscriptions',icon:'play',color:'sunflower',usual:[300,350],outlets:[
  {id:'music',name:'Music',vendors:['Spotify']},{id:'stream',name:'Streaming',vendors:['Netflix']}]},
 {id:'shop',name:'Shopping',icon:'bag',color:'grey',usual:[1400,2600],outlets:[
  {id:'online',name:'Online',vendors:['Myntra','Amazon']},{id:'events',name:'Movies & events',vendors:['BookMyShow']}]},
 {id:'ess',name:'Essentials',icon:'receipt',color:'soft',usual:[700,1100],outlets:[
  {id:'groc',name:'Groceries',vendors:['Blinkit']},{id:'phone',name:'Phone & internet',vendors:['Airtel']}]}
];
// day, time, vendor, amount, bucket, for? (payment remark), social outing?, planned ahead?
var T=[
 [1,'09:05','Papa','Pocket money for September',8000,'income',0,0],
 [1,'09:10','Airtel','Phone recharge',-299,'ess',0,1],
 [1,'18:20','Spotify','Music subscription',-119,'subs',0,1],
 [2,'21:40','Swiggy','Late-night dinner',-386,'eat',0,0],
 [2,'17:10','Chai tapri','Chai after class',-30,'eat',1,0],
 [3,'08:45','Rapido','Auto to college',-74,'travel',0,0],
 [3,'13:10','College canteen','Lunch',-120,'eat',0,0],
 [4,'19:30','Myntra','Kurta for Diwali',-1299,'shop',0,1],
 [4,'16:00','Third Wave Coffee','Coffee with Riya',-280,'eat',1,0],
 [5,'10:00','Scholarship','Merit scholarship',2000,'income',0,0],
 [5,'22:05','Zomato','Hostel dinner order',-452,'eat',0,0],
 [6,'17:15','Uber','Cab to Koregaon Park',-318,'travel',1,0],
 [6,'13:30','Gokhaana','Thali',-180,'goka',0,0],
 [7,'11:40','Blinkit','Groceries and soap',-263,'ess',0,0],
 [7,'23:10','7-Eleven','Midnight snacks',-145,'store',0,0],
 [8,'20:00','Netflix','Streaming subscription',-199,'subs',0,1],
 [9,'21:15','Swiggy','Dinner with flatmates',-289,'eat',1,0],
 [9,'17:45','Chai tapri','Chai and vada pav',-40,'eat',1,0],
 [10,'11:02','Design client','Freelance – logo design',4000,'income',0,0],
 [12,'10:30','Tutoring','Weekend tuition batch',4000,'income',0,0],
 [10,'15:30','IRCTC','Train ticket home',-612,'travel',0,1],
 [11,'13:05','College canteen','Lunch',-90,'eat',0,0],
 [11,'18:30','Café Goodluck','Bun maska with Om',-340,'eat',1,0],
 [12,'20:50','Swiggy','Dinner',-342,'eat',0,0],
 [12,'16:25','Amazon','Notebooks and pens',-481,'shop',0,1],
 [13,'09:20','Rapido','Auto to class',-96,'travel',0,0],
 [13,'13:40','Gokhaana','Thali',-160,'goka',0,0],
 [14,'22:30','Zomato','Sunday treat',-518,'eat',1,0],
 [14,'12:10','Blinkit','Detergent and milk',-187,'ess',0,0],
 [15,'18:40','Uber','Cab to FC Road',-300,'travel',1,0],
 [15,'16:50','Starbucks','Coffee before movie',-270,'eat',1,0],
 [16,'21:40','Swiggy','Dinner after movie',-400,'eat',1,0],
 [16,'19:05','BookMyShow','Movie with hostel group',-350,'shop',1,1],
 [16,'23:30','7-Eleven','Snacks',-115,'store',0,0],
 [17,'13:15','College canteen','Lunch',-110,'eat',0,0],
 [17,'17:20','Chai tapri','Chai',-30,'eat',1,0],
 [17,'20:10','Swiggy','Dinner',-163,'eat',0,0],
 [12,'19:15','98XXXXXX','',-1000,null,0,0]
].map(function(r,i){return {id:'t'+i,day:r[0],time:r[1],vendor:r[2],forLabel:r[3],amount:r[4],
 bucket:r[5]==='income'?null:r[5],income:r[5]==='income',social:!!r[6],planned:!!r[7],outlet:null,note:'',frequent:/Swiggy|Zomato|Rapido|College canteen|Chai tapri/.test(r[2])};});
var PLANS0=[
 {id:'p1',section:'scheduled',title:'Vartika’s birthday',when:'25 Sep',amount:'1,500',notes:'Cake with Riya and Om, gift still undecided',done:false},
 {id:'p2',section:'scheduled',title:'Doctor’s appointment for skin',when:'Tomorrow, 6:00 PM',amount:'',notes:'',done:false},
 {id:'p3',section:'tbd',title:'Goa trip',when:'25–28 Sep',amount:'6,000',notes:'Sharing a room with Riya. Cheaper if we take the train.',done:false},
 {id:'p4',section:'tbd',title:'Might go to Lonavala for Dad’s birthday?',when:'',amount:'',notes:'',done:false}
];
var WD=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function wd(d){return WD[new Date(2026,8,d).getDay()];}
function isWeekend(d){var x=new Date(2026,8,d).getDay();return x===0||x===6;}
function t12(t){var p=t.split(':'),H=+p[0];return ((H%12)||12)+':'+p[1]+(H<12?' AM':' PM');}
function dayLabel(d){return d===TODAY?'Today':d===TODAY-1?'Yesterday':wd(d)+', '+d+' Sep';}
function outletOf(bk,t){if(!bk||!bk.outlets)return null;var o=t.outlet&&bk.outlets.filter(function(x){return x.id===t.outlet;})[0];if(o)return o;return bk.outlets.filter(function(x){return x.vendors.indexOf(t.vendor)>-1;})[0]||null;}

function App(){
 var s=useState({tab:'home',stack:[]}),nav=s[0],setNav=s[1];
 var b=useState(BUCKETS0),buckets=b[0],setBuckets=b[1];
 var tx=useState(T),txns=tx[0],setTxns=tx[1];
 var pl=useState(PLANS0),plans=pl[0],setPlans=pl[1];
 var dc=useState(null),decision=dc[0],setDecision=dc[1];
 var eb=useState(null),editBucket=eb[0],setEditBucket=eb[1];
 var ot=useState(null),openTxn=ot[0],setOpenTxn=ot[1];
 var ns=useState({}),nestSel=ns[0],setNestSel=ns[1];
 var sk=useState([]),skipped=sk[0],setSkipped=sk[1];
 var tm=useState(null),toast=tm[0],setToast=tm[1];
 var inf=useState(null),info=inf[0],setInfo=inf[1];
 var ad=useState(false),addOpen=ad[0],setAdd=ad[1];
 var lp=useState(null),labelPrompt=lp[0],setLabelPrompt=lp[1];
 var ob=useState(0),step=ob[0],setStep=ob[1];
 var toastTimer=React.useRef(null);
 function say(message,undo){if(toastTimer.current)clearTimeout(toastTimer.current);setToast({message:message,undo:undo});toastTimer.current=setTimeout(function(){setToast(null);},6000);}
 var scr=React.useRef(null);
 var screen=nav.stack.length?nav.stack[nav.stack.length-1]:nav.tab;
 React.useEffect(function(){if(scr.current)scr.current.scrollTop=0;},[screen]);
 function push(x){setNav(function(n){return {tab:n.tab,stack:n.stack.concat([x])};});}
 function back(){setNav(function(n){return {tab:n.tab,stack:n.stack.slice(0,-1)};});}
 function tab(t){setNav({tab:t,stack:[]});}
 var bmap={};buckets.forEach(function(x){bmap[x.id]=x;});
 window.__jump=function(k){setEditBucket(null);setOpenTxn(null);
  setAdd(false);setLabelPrompt(null);
  var m={home:['home',[]],estimate:['home',['estimate']],result:['home',['result']],spend:['home',['spend']],edit:['home',['spend']],
   profile:['profile',[]],txns:['profile',['txns']],detail:['profile',['txns']],exp:['profile',['exp']],plans:['plans',[]],
   cue:['home',['cue']],widget:['home',['widget']],onboard:['home',['onboard']],empty:['home',['empty']],
   add:['profile',['txns']],label:['profile',['txns']]}[k];
  if(k==='onboard')setStep(0);
  if(k==='result'||k==='estimate')setDecision(k==='result'?{amount:700,label:'dinner out',bucket:'eat'}:null);
  setNav({tab:m[0],stack:m[1]});
  if(k==='edit')setEditBucket(buckets[0]);
  if(k==='detail')setOpenTxn(txns.filter(function(t){return t.day===16&&t.vendor==='Swiggy';})[0].id);
  if(k==='add')setTimeout(function(){setAdd(true);},60);
  if(k==='label')setTimeout(function(){setLabelPrompt({vendor:'Chai tapri',bucket:'eat',count:4});},60);};

 function bucketOf(t){if(t.income)return {name:'Income',icon:'wallet',color:'positive'};var bk=bmap[t.bucket];
  if(!bk)return {name:'Needs a label',icon:'filter',color:'soft',unlabelled:true};
  var o=outletOf(bk,t);return Object.assign({},bk,{outletName:o?o.name:'Other',outletId:o?o.id:'__none'});}
 var income=txns.filter(function(t){return t.income;}).reduce(function(a,t){return a+t.amount;},0);
 var spent=-txns.filter(function(t){return !t.income;}).reduce(function(a,t){return a+t.amount;},0);
 var free=income-spent, balance=OPENING+income-spent;
 var spentBy={};txns.forEach(function(t){if(!t.income)spentBy[t.bucket||'__none']=(spentBy[t.bucket||'__none']||0)-t.amount;});
 function projection(extra){var e=extra||0;var rate=(spent+e)/TODAY;return Math.round((spent+e+rate*(DAYS_IN_MONTH-TODAY))/10)*10;}
 function splits(extra,extraBucket){
  var by=Object.assign({},spentBy);if(extra&&extraBucket)by[extraBucket]=(by[extraBucket]||0)+extra;
  var tot=Object.keys(by).reduce(function(a,k){return a+by[k];},0)||1;
  var list=buckets.map(function(bk){return {id:bk.id,label:bk.name,amount:by[bk.id]||0,tone:bk.color};}).filter(function(x){return x.amount>0;});
  if(by.__none)list.push({id:'__none',label:'Unlabelled',amount:by.__none,tone:'soft'});
  list.sort(function(a,b){return b.amount-a.amount;});
  var top=list.slice(0,3),rest=list.slice(3);
  if(rest.length)top.push({id:'__other',label:'Other',amount:rest.reduce(function(a,x){return a+x.amount;},0),tone:'soft'});
  return top.map(function(x){return {id:x.id,label:x.label,pct:Math.round(x.amount/tot*100),tone:x.tone,amount:x.amount};});}
 var cues=plans.filter(function(p){return !p.done;});
 var ctx={buckets:buckets,setBuckets:setBuckets,bmap:bmap,txns:txns,setTxns:setTxns,bucketOf:bucketOf,spentBy:spentBy,income:income,spent:spent,free:free,balance:balance,
  projection:projection,splits:splits,push:push,back:back,tab:tab,decision:decision,setDecision:setDecision,setEditBucket:setEditBucket,setOpenTxn:setOpenTxn,
  plans:plans,setPlans:setPlans,cues:cues,nestSel:nestSel,setNestSel:setNestSel,
  skipped:skipped,setSkipped:setSkipped,say:say,info:info,setInfo:setInfo,
  addOpen:addOpen,setAdd:setAdd,labelPrompt:labelPrompt,setLabelPrompt:setLabelPrompt,step:step,setStep:setStep,setBuckets:setBuckets};
 var body;
 if(screen==='home')body=h(Home,ctx);
 else if(screen==='estimate')body=h(Estimate,ctx);
 else if(screen==='result')body=h(Result,ctx);
 else if(screen==='spend')body=h(WhereItWent,ctx);
 else if(screen==='profile')body=h(Profile,ctx);
 else if(screen==='txns')body=h(Transactions,ctx);
 else if(screen==='exp')body=h(Experience,ctx);
 else if(screen==='plans')body=h(Plans,ctx);
 else if(screen==='cue')body=h(Cue,ctx);
 else if(screen==='widget')body=h(Widget,ctx);
 else if(screen==='onboard')body=h(Onboarding,ctx);
 else if(screen==='empty')body=h(EmptyHome,ctx);
 var showNav=['cue','widget','onboard','empty'].indexOf(screen)<0;
 var txnObj=openTxn&&txns.filter(function(t){return t.id===openTxn;})[0];
 return h('div',{className:'phone'},
  h('div',{className:'status','aria-hidden':true},h('span',null,'9:41'),h('span',{className:'island'}),h('span',null,'5G ▮')),
  h('main',{className:cx('scroll',showNav&&'has-nav'),ref:scr},body),
  showNav?h('div',{className:'navwrap'},h(SM.BottomNav,{showLabels:true,active:nav.tab,onChange:tab,items:[{id:'home',icon:'home',label:'Home'},{id:'plans',icon:'grid',label:'Plans'},{id:'profile',icon:'user',label:'Profile'}]})):null,
  h(EditBucketSheet,{key:editBucket?editBucket.id||'new':'none',bucket:editBucket,onClose:function(){setEditBucket(null);},
   onSave:function(nb){setBuckets(function(bs){var ex=bs.some(function(x){return x.id===nb.id;});return ex?bs.map(function(x){return x.id===nb.id?nb:x;}):bs.concat([nb]);});setEditBucket(null);},
   onDelete:function(id){var bsnap=buckets,tsnap=txns;var nm=(bmap[id]||{}).name||'Category';
    setBuckets(function(bs){return bs.filter(function(x){return x.id!==id;});});
    setTxns(function(ts){return ts.map(function(t){return t.bucket===id?Object.assign({},t,{bucket:null}):t;});});
    setEditBucket(null);say(nm+' deleted. Its payments need a label now.',function(){setBuckets(bsnap);setTxns(tsnap);});}}),
  h(TxnSheet,{key:openTxn||'none',txn:txnObj,buckets:buckets,bucketOf:bucketOf,onClose:function(){setOpenTxn(null);},
   onSave:function(nt){setTxns(function(ts){return ts.map(function(t){return t.id===nt.id?nt:t;});});setOpenTxn(null);}}),
  h(InfoSheet,{term:info,onClose:function(){setInfo(null);}}),
  h(AddTxnSheet,{key:addOpen?'add':'noadd',open:addOpen,buckets:buckets,onClose:function(){setAdd(false);},
   onAdd:function(t){setTxns(function(ts){return ts.concat([t]);});setAdd(false);say(F(Math.abs(t.amount))+' added.',function(){setTxns(function(ts){return ts.filter(function(x){return x.id!==t.id;});});});}}),
  h(LabelPromptSheet,{key:labelPrompt?labelPrompt.vendor:'nolabel',prompt:labelPrompt,buckets:buckets,onClose:function(){setLabelPrompt(null);},
   onFile:function(bucketId,outletId,vendor){setBuckets(function(bs){return bs.map(function(b){return b.id!==bucketId?b:Object.assign({},b,{outlets:b.outlets.map(function(o){return o.id!==outletId?o:Object.assign({},o,{vendors:o.vendors.indexOf(vendor)<0?o.vendors.concat([vendor]):o.vendors});})});});});
    setLabelPrompt(null);say(vendor+' filed. Future payments follow it.');}}),
  toast?h('div',{className:'toast',role:'status'},h('span',null,toast.message),toast.undo?h('button',{type:'button',onClick:function(){toast.undo();setToast(null);}},'Undo'):null):null);
}

var TERMS={
 free:{title:'Free to spend',body:'Everything that came in this month, minus everything you have spent. It is not a budget and nothing is set aside — it is simply what is left of this month’s money.'},
 pace:{title:'At this pace',body:'What the month would add up to if the days left go like the days so far. It is an assumption, not a prediction, and it moves every time you spend.'},
 category:{title:'Categories and sections',body:'A category is a kind of spending, like Eating. A section is where inside it the money went — delivery apps, cafés, tapri. You decide both, and you can rename or move anything.'},
 skipped:{title:'Skipped',body:'Spends you checked and then decided against. Nothing is added or subtracted anywhere — it is only a note of what you talked yourself out of.'}
};
function InfoTip(p){return h('button',{type:'button',className:'infotip','aria-label':'What does “'+TERMS[p.term].title+'” mean?',onClick:function(){p.onOpen(p.term);}},'?');}
function InfoSheet(p){if(!p.term)return null;var t=TERMS[p.term];
 return h('div',{className:'sheet-host'},h(SM.BottomSheet,{open:true,onClose:p.onClose,pill:'In plain words',title:t.title,footer:h(SM.Button,{full:true,onClick:p.onClose},'Got it')},h('p',{className:'info-body'},t.body)));}

function Home(c){
 var sel=useState(null),sp=sel[0],setSp=sel[1];
 var split=c.splits();
 var top=Math.max.apply(null,split.map(function(x){return x.pct;}).concat([1]));
 return h('div',{className:'home'},
  h('header',{className:'home-head'},
   h('div',{className:'home-greet'},h('p',{className:'hi'},'Hi Parisha,'),h('p',{className:'hi-sub'},'Here’s where your money stands.')),
   h('p',{className:'hi-date'},'Friday, 18 September')),
  h('button',{type:'button',className:'cta2',onClick:function(){c.setDecision(null);c.push('estimate');}},
   h('span',{className:'cta2-txt'},h('span',{className:'t'},'Kharcha with friends?'),h('span',{className:'s'},'Check before you spend')),
   h('span',{className:'cta2-btn','aria-hidden':true},h(SM.Icon,{name:'plus',size:24}))),
  h('section',{className:'group'},
   h('div',{className:'sec-head'},h('h2',null,'This month'),h(InfoTip,{term:'free',onOpen:c.setInfo})),
   h('div',{className:'money'},
    h('p',{className:'money-hero'},F(c.free)),
    h('p',{className:'money-label'},'free to spend'),
    h('p',{className:'money-sub'},'of '+F(c.income)+' this month · '+F(c.spent)+' spent so far'),
    h('div',{className:'money-bars'},split.filter(function(x){return x.id!=='__left';}).slice(0,4).map(function(x){
      return h('button',{key:x.id,type:'button',className:'mb','aria-pressed':sp===x.id,onClick:function(){setSp(sp===x.id?null:x.id);}},
       h('span',{className:'n'},x.label),h('span',{className:'bar'},h('span',{className:'fill t-'+x.tone,style:{width:Math.max(4,x.pct/top*100)+'%'}})),h('span',{className:'p'},x.pct+'%'));})),
    sp?h('p',{className:'money-note'},(function(){var x=split.filter(function(y){return y.id===sp;})[0];return x.label+' · '+F(x.amount)+' so far, '+x.pct+'% of the month';})()):null,
    h('button',{type:'button',className:'money-link',onClick:function(){c.setDecision(null);c.push('spend');}},'See where it went',h(SM.Icon,{name:'arrow-up-right',size:16})))),
  c.cues.length?h('section',{className:'group'},
   h('div',{className:'sec-head'},h('h2',null,'Coming up'),h('button',{type:'button',className:'sec-link',onClick:function(){c.tab('plans');}},'All plans')),
   h('div',{className:'cues'},c.cues.slice(0,2).map(function(p){return h(SM.CueRow,{key:p.id,title:p.title,when:p.when,onClick:function(){c.tab('plans');}});}))):null,
  c.skipped.length?h('p',{className:'home-foot'},'You have skipped '+F(c.skipped.reduce(function(a,x){return a+x.amount;},0))+' this month.'):null);
}

function Estimate(c){
 var st=useState({amount:'',forId:''}),f=st[0],setF=st[1];
 var amt=+String(f.amount).replace(/[^\d]/g,'');
 return h('div',{className:'stack'},
  h(SM.AppBar,{eyebrow:'Before you spend',title:'Estimated spend',onBack:c.back,backLabel:'Back to home'}),
  h('section',{className:'sm-card surface estimate'},
   h('form',{onSubmit:function(e){e.preventDefault();if(!amt)return;c.setDecision({amount:amt,label:f.forId?(c.bmap[f.forId]?c.bmap[f.forId].name.toLowerCase():'this'):'this',bucket:f.forId||null});c.push('result');}},
    h('label',{className:'big-amt',htmlFor:'est-amt'},h('span',{className:'sm-sr'},'Amount'),h('span',{className:'cur'},'₹'),
     h('input',{id:'est-amt',inputMode:'numeric',placeholder:'___',value:f.amount,autoComplete:'off',onChange:function(e){setF(Object.assign({},f,{amount:e.target.value.replace(/[^\d]/g,'')}));}})),
    h('div',{className:'quick-amts',role:'group','aria-label':'Common amounts'},[200,500,1000,2000].map(function(v){
     return h('button',{key:v,type:'button',className:'sm-chip soft','aria-pressed':String(v)===f.amount,onClick:function(){setF(Object.assign({},f,{amount:String(v)}));}},F(v));})),
    h(SM.SelectField,{id:'est-for',label:'For?',value:f.forId,onChange:function(v){setF(Object.assign({},f,{forId:v}));},
     options:[{value:'',label:'Not sure yet'}].concat(c.buckets.map(function(b){return {value:b.id,label:b.name};})),hint:'Not sure is fine. It only decides which category the check is against.'}),
    h(SM.Button,{type:'submit',full:true,disabled:!amt},'Check'))),
  h('p',{className:'fine'},'Nothing is recorded here. This only shows what the spend would do to the rest of your month.')
 );
}

function Result(c){
 var d=c.decision||{amount:0,label:'this',bucket:null};
 var sel=useState(d.bucket),sp=sel[0],setSp=sel[1];
 var after=c.free-d.amount;
 var bk=d.bucket&&c.bmap[d.bucket];
 var bSpent=bk?(c.spentBy[bk.id]||0):0, bAfter=bSpent+d.amount;
 var left=DAYS_IN_MONTH-TODAY;
 var insight=bk?(bk.name+' would come to '+F(bAfter)+' this month — '+Math.round(bAfter/(c.spent+d.amount||1)*100)+'% of everything you have spent, with '+left+' days to go.')
  : 'This would be '+Math.round(d.amount/(c.free||1)*100)+'% of what is free to spend, with '+left+' days to go.';
 var split=c.splits(d.amount,d.bucket);
 var selItem=split.filter(function(x){return x.id===sp;})[0];
 var recent=c.txns.filter(function(t){return !t.income&&(sp?(sp==='__other'?true:t.bucket===sp):true);}).slice().sort(function(a,b){return b.day-a.day;}).slice(0,4);
 return h('div',{className:'stack'},
  h(SM.AppBar,{eyebrow:'If you spend '+F(d.amount)+' on '+d.label,title:'Here’s the picture',onBack:c.back,backLabel:'Change the amount'}),
  h(SM.ResultHeadline,{before:F(c.free),after:F(after),caption:'free to spend for the rest of September',insight:insight},
   h('div',{className:'drop'},
    h('div',{className:'drop-bar',role:'img','aria-label':F(d.amount)+' of '+F(c.free)+' free to spend'},
     h('span',{className:'keep',style:{flexGrow:Math.max(0,after)}}),
     h('span',{className:'gone',style:{flexGrow:Math.max(1,d.amount)}})),
    h('div',{className:'drop-key'},
     h('span',null,h('i',{className:'k keep'}),'Left after this · '+F(after)),
     h('span',null,h('i',{className:'k gone'}),'This spend · '+F(d.amount))))),
  h(SM.ProjectionCard,{eyebrow:'This month',value:F(c.projection(d.amount)),caption:'projected for September if you spend this and the rest of the month goes like the last '+TODAY+' days',
   selected:sp,onSelect:setSp,onExpand:function(){c.push('spend');},expandLabel:'See where it went',splits:split},
   selItem?h('div',{className:'proj-recent'},h('p',{className:'sm-eyebrow'},'Recent in '+selItem.label),
    recent.map(function(t){return h('p',{key:t.id,className:'r'},h('span',null,t.vendor),h('span',null,F(t.amount)));}),
    h('button',{type:'button',className:'viewall',onClick:function(){c.push('txns');}},'View all')):null),
  c.cues.length?[h(SM.SectionHeader,{key:'h',onCanvas:true,title:'Coming up'}),
   h('div',{key:'c',className:'cues'},c.cues.slice(0,3).map(function(p){return h(SM.CueRow,{key:p.id,title:p.title,when:p.when,note:p.notes||null});})),
   h('p',{key:'n',className:'fine'},'Plans are only reminders. Nothing here is counted in any total.')]:null,
  h('div',{className:'exits'},
   h(SM.Button,{full:true,onClick:function(){c.setDecision(null);c.tab('home');}},'Noted')) );
}

function WhereItWent(c){
 var segs=[{label:'Money in',value:c.income,tone:'coral'},{label:'Spent',value:c.spent,tone:'sunflower'}];
 return h('div',{className:'stack'},
  h(SM.AppBar,{eyebrow:'September',title:'Where it went',onBack:c.back}),
  h(SM.AmountSummary,{eyebrow:'Free to spend',value:F(c.free),caption:'of '+F(c.income)+' that came in this month',segments:segs,
   parts:[{label:'Money in',value:F(c.income),tone:'coral'},{label:'Spent',value:F(c.spent),tone:'sunflower'},{label:'Free to spend',value:F(c.free)},{label:'Projected',value:F(c.projection())}]}),
  h(SM.SectionHeader,{onCanvas:true,title:'Categories · where it went',action:h(SM.Button,{variant:'light',size:'sm',icon:'plus',onClick:function(){c.setEditBucket({id:null,name:'',icon:'wallet',color:'sky',outlets:[{id:'o'+Date.now(),name:'',vendors:[]}]});}},'New')}),
  c.buckets.map(function(bk){var sums={};c.txns.forEach(function(t){if(t.income||t.bucket!==bk.id)return;var o=outletOf(bk,t);var k=o?o.id:'__none';sums[k]=(sums[k]||0)-t.amount;});
   var items=bk.outlets.map(function(o){return {id:o.id,label:o.name,amount:sums[o.id]||0,caption:o.vendors.join(', ')};});
   if(sums.__none)items.push({id:'__none',label:'Unlabelled',amount:sums.__none,caption:'Vendors not in a section yet'});
   return h(SM.CategoryCard,{key:bk.id,name:bk.name,color:bk.color,spent:c.spentBy[bk.id]||0,items:items,selected:c.nestSel[bk.id]||null,
    onSelect:function(id){var n=Object.assign({},c.nestSel);n[bk.id]=id;c.setNestSel(n);},onEdit:function(){c.setEditBucket(bk);}});}),
  c.spentBy.__none?h(SM.LinkRow,{tone:'butter',title:F(c.spentBy.__none)+' needs a label',caption:'Unknown payments the app could not place',onClick:function(){c.push('txns');}}):null
 );
}

function EditBucketSheet(p){
 var bk=p.bucket;
 var st=useState(bk?{name:bk.name,color:bk.color,outlets:bk.outlets.map(function(o){return {id:o.id,name:o.name,vendors:o.vendors.slice(),draft:''};})}:null),f=st[0],setF=st[1];
 if(!bk)return null;
 var isNew=!bk.id;
 function setO(id,patch){setF(Object.assign({},f,{outlets:f.outlets.map(function(o){return o.id===id?Object.assign({},o,patch):o;})}));}
 function addV(o){var v=(o.draft||'').trim();if(!v)return;setO(o.id,{vendors:o.vendors.indexOf(v)<0?o.vendors.concat([v]):o.vendors,draft:''});}
 var valid=!!f.name.trim();
 var colors=['coral','sky','blush','sunflower','butter','grey','soft'];
 return h('div',{className:'sheet-host'},h(SM.BottomSheet,{open:true,onClose:p.onClose,pill:isNew?'New category':'Edit category',title:f.name||'Untitled category',subtitle:'Sections split a category by where you spend',
  trailing:isNew?null:h(SM.IconButton,{icon:'trash',label:'Delete category',onClick:function(){p.onDelete(bk.id);}}),
  footer:h(SM.Button,{full:true,disabled:!valid,onClick:function(){p.onSave(Object.assign({},bk,{id:bk.id||('b'+Date.now()),name:f.name.trim(),color:f.color,outlets:f.outlets.filter(function(o){return o.name.trim()||o.vendors.length;}).map(function(o){return {id:o.id,name:o.name.trim()||'Untitled section',vendors:o.vendors};})}));}},isNew?'Create category':'Save category')},
  h(SM.TextField,{id:'bucket-name',label:'Category name',value:f.name,placeholder:'e.g. Eating',onChange:function(v){setF(Object.assign({},f,{name:v}));}}),
  h('div',{className:'sm-field'},h('span',{className:'l'},'Colour'),h('div',{className:'swatches',role:'group','aria-label':'Category colour'},colors.map(function(cl){return h('button',{key:cl,type:'button',className:'swatch t-'+cl,'aria-pressed':f.color===cl,'aria-label':cl,onClick:function(){setF(Object.assign({},f,{color:cl}));}},f.color===cl?h(SM.Icon,{name:'check',size:16}):null);}))),
  h('div',{className:'sm-field'},h('span',{className:'l'},'Sections · '+f.outlets.length),
   h('div',{className:'outlets'},f.outlets.map(function(o,i){
    return h('div',{key:o.id,className:'outlet'},
     h('div',{className:'outlet-head'},h('div',{style:{flex:1}},h(SM.TextField,{id:'sec-'+o.id,label:'Section '+(i+1),value:o.name,placeholder:'e.g. Cafés',onChange:function(v){setO(o.id,{name:v});}})),
      h(SM.IconButton,{icon:'close',size:'sm',variant:'light',label:'Remove section '+(o.name||i+1),onClick:function(){setF(Object.assign({},f,{outlets:f.outlets.filter(function(x){return x.id!==o.id;})}));}})),
     h('div',{className:'vendors'},o.vendors.length?o.vendors.map(function(v){return h('span',{key:v,className:'sm-chip light vendor'},v,h('button',{type:'button','aria-label':'Remove '+v,onClick:function(){setO(o.id,{vendors:o.vendors.filter(function(x){return x!==v;})});}},h(SM.Icon,{name:'close',size:14})));}):h('p',{className:'muted'},'No vendors yet')),
     h('form',{className:'addv',onSubmit:function(e){e.preventDefault();addV(o);}},h('input',{className:'addv-input',id:'vendor-'+o.id,'aria-label':'Add a vendor to '+(o.name||'this section'),placeholder:'Add a vendor',value:o.draft||'',onChange:function(e){setO(o.id,{draft:e.target.value});}}),h(SM.Button,{type:'submit',variant:'dark',size:'sm',icon:'plus'},'Add')));})),
   h(SM.Button,{variant:'soft',icon:'plus',onClick:function(){setF(Object.assign({},f,{outlets:f.outlets.concat([{id:'o'+Date.now(),name:'',vendors:[],draft:''}])}));}},'Add section'))));
}

function patterns(c){
 var out=c.txns.filter(function(t){return !t.income;});
 var social=out.filter(function(t){return t.social;});
 var socialTotal=-social.reduce(function(a,t){return a+t.amount;},0);
 var we=social.filter(function(t){return isWeekend(t.day);}),wk=social.filter(function(t){return !isWeekend(t.day);});
 var avg=function(l){return l.length?Math.round(-l.reduce(function(a,t){return a+t.amount;},0)/l.length):0;};
 var eat=c.bmap.eat, eatSpent=c.spentBy.eat||0;
 var small=out.filter(function(t){return -t.amount<=400&&t.social;});
 var smallTotal=-small.reduce(function(a,t){return a+t.amount;},0);
 var spontaneous=social.filter(function(t){return !t.planned;});
 var list=[];
 if(eat)list.push({kind:'You vs yourself',text:'Eating is '+F(eatSpent)+' this month. Your usual range by this date is '+F(eat.usual[0])+'–'+F(eat.usual[1])+'.',
  detail:eatSpent>eat.usual[1]?'Above your usual range, mostly from delivery apps.':'Inside your usual range.'});
 list.push({kind:'You vs yourself',text:'Social outings come to '+F(socialTotal)+' across '+social.length+' occasions this month.',detail:spontaneous.length+' of them were decided on the day.'});
 if(we.length&&wk.length)list.push({kind:'This changes when…',tone:'butter',text:'A weekday outing averages '+F(avg(wk))+'. On weekends it averages '+F(avg(we))+'.',detail:'Based on '+social.length+' outings this month.'});
 if(small.length>2)list.push({kind:'Adds up',tone:'sky',text:small.length+' small outings of '+F(400)+' or less came to '+F(smallTotal)+' together.',detail:'Each one looked small on its own.'});
 return list;
}

function Profile(c){
 var pats=patterns(c);
 var unlabelled=c.txns.filter(function(t){return !t.income&&!t.bucket;});
 return h('div',{className:'stack'},
  h('section',{className:'sm-card soft'},
   h('div',{className:'prof-top'},h(SM.AvatarStack,{size:'lg',people:[{initials:'PA',tone:'butter',name:'Parisha'}]}),h('div',null,h('p',{className:'sm-eyebrow'},'Your profile'),h('p',{className:'prof-name'},'Parisha'))),
   h('p',{className:'bal'},F(c.balance,{decimals:2})),h('p',{className:'bal-c'},'Money in your account')),
  h(SM.LinkRow,{tone:'surface',title:'See transaction history',caption:c.txns.length+' transactions this month'+(unlabelled.length?' · '+unlabelled.length+(unlabelled.length===1?' needs':' need')+' a label':''),onClick:function(){c.push('txns');}}),
  h(SM.SectionHeader,{onCanvas:true,title:'Your spending analysis'}),
  (function(){var tot=c.spent||1;var rows=c.buckets.map(function(bk){var v=c.spentBy[bk.id]||0;return {id:bk.id,label:bk.name,value:v,tone:bk.color,display:F(v)+' · '+Math.round(v/tot*100)+'%'};}).sort(function(a,b){return b.value-a.value;});
   return h('section',{className:'sm-projection'},
    h('div',{className:'head'},h('p',{className:'sm-eyebrow'},'Where it went this month'),h(SM.IconButton,{icon:'arrow-up-right',variant:'light',size:'sm',label:'Open Experience',onClick:function(){c.push('exp');}})),
    h(SM.BarList,{onDark:true,items:rows,onSelect:function(id){if(id)c.push('exp');}}),
    h('p',{className:'proj-detail'},F(c.spent)+' spent across '+rows.filter(function(r){return r.value>0;}).length+' categories'));})(),
  h(SM.SectionHeader,{onCanvas:true,title:'Patterns'}),
  h('div',{className:'insights'},
   c.skipped.length?h('button',{type:'button',className:'insight-btn',onClick:function(){c.setInfo('skipped');}},
    h(SM.InsightCard,{kind:'You vs yourself',tone:'sky',detail:'Tap to see what “skipped” means.'},'You checked and then skipped '+F(c.skipped.reduce(function(a,x){return a+x.amount;},0))+' across '+c.skipped.length+(c.skipped.length===1?' decision':' decisions')+' this month.')):null,
   pats.map(function(p,i){return h('button',{key:i,type:'button',className:'insight-btn',onClick:function(){c.push('txns');}},
    h(SM.InsightCard,{kind:p.kind,detail:(p.detail?p.detail+' ':'')+'Tap to see the payments behind it.',tone:p.tone||'soft'},p.text));})),
  h('p',{className:'fine'},'Worked out from your transactions up to today, '+TODAY+' September.'),
  h('p',{className:'fine'},'Patterns compare you with your own history only. The app never compares you with other students and never tells you what to do.'),
  h(SM.SectionHeader,{onCanvas:true,title:'What the app uses'}),
  h(SM.LinkRow,{tone:'surface',title:'Labels and categories',caption:'You decide what each payment was for',onClick:function(){c.setDecision(null);c.push('spend');}}),
  h(SM.LinkRow,{tone:'butter',title:'Data the app reads',caption:'Payment remarks and amounts · edit or clear any of it',onClick:function(){c.push('txns');}})
 );
}

function Transactions(c){
 var fs=useState(['in','out']),dir=fs[0],setDir=fs[1];
 var bf=useState([]),bsel=bf[0],setB=bf[1];
 var so=useState(false),sheet=so[0],setSheet=so[1];
 var list=c.txns.filter(function(t){return (t.income?dir.indexOf('in')>-1:dir.indexOf('out')>-1)&&(!bsel.length||bsel.indexOf(t.income?'income':(t.bucket||'none'))>-1);});
 var days={};list.forEach(function(t){(days[t.day]=days[t.day]||[]).push(t);});
 var order=Object.keys(days).map(Number).sort(function(a,b){return b-a;});
 var nIn=c.txns.filter(function(t){return t.income;}).length;
 var unl=c.txns.filter(function(t){return !t.income&&!t.bucket;});
 var bopts=c.buckets.map(function(bk){return {value:bk.id,label:bk.name};}).concat([{value:'none',label:'Needs a label'}]);
 return h('div',{className:'stack'},
  h(SM.AppBar,{eyebrow:'September 2026',title:'What it was for',onBack:c.back,trailing:h(SM.IconButton,{icon:'filter',variant:bsel.length?'dark':'soft',label:'Filter by category',onClick:function(){setSheet(true);}})},
   h('div',{style:{marginTop:16}},h(SM.FilterChips,{label:'Direction',value:dir,onChange:setDir,options:[{value:'in',label:'Incoming',count:nIn},{value:'out',label:'Outgoing',count:c.txns.length-nIn}]})),
   h('p',{className:'appbar-note'},'Read from the payment remark, not the vendor name. You can rewrite any of them.')),
  (function(){var counts={};c.txns.forEach(function(t){if(!t.income)counts[t.vendor]=(counts[t.vendor]||0)+1;});
   var freq=Object.keys(counts).filter(function(v){return counts[v]>=3;})[0];
   return freq?h(SM.HighlightCard,{tone:'sunflower',title:'You paid '+freq+' '+counts[freq]+' times this month',subtitle:'Want to file it under a section?',
    action:h(SM.IconButton,{icon:'arrow-up-right',variant:'dark',size:'lg',label:'File '+freq,onClick:function(){var t=c.txns.filter(function(x){return x.vendor===freq;})[0];c.setLabelPrompt({vendor:freq,bucket:t.bucket,count:counts[freq]});}})}):null;})(),
  unl.length?h(SM.HighlightCard,{tone:'butter',title:unl.length===1?'One payment needs a label':unl.length+' payments need a label',subtitle:'The app could not tell what they were for',
   action:h(SM.IconButton,{icon:'arrow-up-right',variant:'dark',size:'lg',label:'Label the first one',onClick:function(){c.setOpenTxn(unl[0].id);}})}):null,
  bsel.length?h('div',{className:'active-filters'},bsel.map(function(id){var nm=id==='none'?'Needs a label':c.bmap[id]?c.bmap[id].name:id;return h('button',{key:id,type:'button',className:'sm-chip light',onClick:function(){setB(bsel.filter(function(x){return x!==id;}));}},nm,h(SM.Icon,{name:'close',size:14}));})):null,
  h('section',{className:'sm-card surface list'},
   order.length?order.map(function(d){var sum=days[d].reduce(function(a,t){return a+t.amount;},0);
    return h('div',{key:d,className:'day'},h('div',{className:'day-h'},h('span',null,dayLabel(d)),h('span',null,F(sum,{sign:true}))),
     days[d].sort(function(a,b){return a.time<b.time?1:-1;}).map(function(t){var bk=c.bucketOf(t);
      return h(SM.TransactionRow,{key:t.id,vendor:t.forLabel||'Unknown payment',bucket:bk.unlabelled?'Tap to say what it was for':(t.vendor+' · '+(bk.outletName||bk.name)),time:t12(t.time),amount:t.amount,icon:bk.icon,tone:bk.color,onClick:function(){c.setOpenTxn(t.id);}});}));})
   :h('div',{className:'empty'},h('p',null,'No transactions match these filters.'),h(SM.Button,{variant:'soft',onClick:function(){setDir(['in','out']);setB([]);}},'Clear filters'))),
  h('div',{className:'sticky-add'},h(SM.Button,{full:true,icon:'plus',onClick:function(){c.setAdd(true);}},'Add a payment by hand')),
  sheet?h('div',{className:'sheet-host'},h(SM.BottomSheet,{open:true,onClose:function(){setSheet(false);},pill:'Filter',title:'Show categories',subtitle:'Pick one or more',footer:h(SM.Button,{full:true,onClick:function(){setSheet(false);}},'Show '+list.length+' transactions')},
   h(SM.FilterChips,{label:'Categories',value:bsel,onChange:setB,options:[{value:'income',label:'Income'}].concat(bopts)}),
   bsel.length?h(SM.Button,{variant:'soft',onClick:function(){setB([]);}},'Clear filter'):null)):null);
}

function TxnSheet(p){
 var t=p.txn;
 var st=useState(t?{bucket:t.bucket,outlet:t.outlet,forLabel:t.forLabel,note:t.note,frequent:t.frequent}:null),f=st[0],setF=st[1];
 if(!t)return null;
 var bk=p.bucketOf(Object.assign({},t,{bucket:f.bucket,outlet:f.outlet}));
 var cur=p.buckets.filter(function(b){return b.id===f.bucket;})[0];
 return h('div',{className:'sheet-host'},h(SM.BottomSheet,{open:true,onClose:p.onClose,pill:dayLabel(t.day)+' · '+t12(t.time),title:f.forLabel||'What was this for?',subtitle:t.vendor+(t.income?' · received':' · paid via UPI'),
  footer:h(SM.Button,{full:true,onClick:function(){p.onSave(Object.assign({},t,f));}},'Save changes')},
  h('div',{className:cx('txn-amt',t.income?'pos':'')},F(t.amount,{sign:true,decimals:2})),
  h(SM.TextField,{id:'txn-for',label:'For?',value:f.forLabel,placeholder:'e.g. dinner with Riya',hint:t.forLabel?'Taken from the payment remark. Rewrite it in your own words.':'The app could not read a remark for this one. Say what it was for.',onChange:function(v){setF(Object.assign({},f,{forLabel:v}));}}),
  t.income||!t.bucket?null:h('p',{className:'auto-note'},h(SM.Icon,{name:'check',size:14}),'Filed under '+(bk.outletName||bk.name)+' automatically, because you pay '+t.vendor+' often. Change it below and it stays changed.'),
  t.income?null:h('div',{className:'sm-field'},h('span',{className:'l'},'Category'),h(SM.FilterChips,{single:true,label:'Category',value:f.bucket?[f.bucket]:[],onChange:function(v){setF(Object.assign({},f,{bucket:v[0]||null,outlet:null}));},options:p.buckets.map(function(b){return {value:b.id,label:b.name};})})),
  t.income||!cur?null:h('div',{className:'sm-field'},h('span',{className:'l'},'Section'),h(SM.FilterChips,{single:true,label:'Section',value:[f.outlet||bk.outletId],onChange:function(v){setF(Object.assign({},f,{outlet:v[0]||null}));},options:cur.outlets.map(function(o){return {value:o.id,label:o.name};})})),
  t.income?null:h('div',{className:'sm-field'},h('span',{className:'l'},'Frequent payment'),h(SM.FilterChips,{label:'Frequent payment',value:f.frequent?['f']:[],onChange:function(v){setF(Object.assign({},f,{frequent:v.length>0}));},options:[{value:'f',label:'I pay '+t.vendor+' often'}]}),
   h('p',{className:'hint-s'},'Frequent vendors are filed under '+(bk.outletName||bk.name)+' automatically.')),
  h(SM.TextField,{id:'txn-note',label:'Note',multiline:true,value:f.note,placeholder:'Anything worth remembering',onChange:function(v){setF(Object.assign({},f,{note:v}));}})));
}

function Experience(c){
 var md=useState('week'),mode=md[0],setMode=md[1];
 var sl=useState(null),sel=sl[0],setSel=sl[1];
 var out=c.txns.filter(function(t){return !t.income;});
 var bars,range,prevTotal,prevLabel;
 if(mode==='week'){bars=[];for(var d=TODAY-6;d<=TODAY;d++){(function(d){var v=-out.filter(function(t){return t.day===d;}).reduce(function(a,t){return a+t.amount;},0);bars.push({id:'d'+d,label:d===TODAY?'Today':wd(d),value:v,display:F(v),days:[d]});})(d);}
  prevTotal=-out.filter(function(t){return t.day>=TODAY-13&&t.day<=TODAY-7;}).reduce(function(a,t){return a+t.amount;},0);prevLabel='last week';range=(TODAY-6)+'–'+TODAY+' Sep';}
 else{bars=[[1,7,'1–7'],[8,14,'8–14'],[15,21,'15–21']].map(function(w){var v=-out.filter(function(t){return t.day>=w[0]&&t.day<=w[1];}).reduce(function(a,t){return a+t.amount;},0);var ds=[];for(var i=w[0];i<=w[1];i++)ds.push(i);return {id:'w'+w[0],label:w[2]+' Sep',value:v,display:F(v),days:ds};});
  prevTotal=7650;prevLabel='August';range='September so far';}
 var selBar=bars.filter(function(b){return b.id===sel;})[0];
 var days=selBar?selBar.days:[].concat.apply([],bars.map(function(b){return b.days;}));
 var inRange=out.filter(function(t){return days.indexOf(t.day)>-1;});
 var total=-inRange.reduce(function(a,t){return a+t.amount;},0);
 var periodTotal=bars.reduce(function(a,b){return a+b.value;},0);
 var diff=prevTotal?Math.round((periodTotal-prevTotal)/prevTotal*100):0;
 var by={};inRange.forEach(function(t){by[t.bucket||'none']=(by[t.bucket||'none']||0)-t.amount;});
 var items=Object.keys(by).map(function(k){var bk=c.bmap[k]||{name:'Needs a label',color:'soft'};return {id:k,name:bk.name,amount:by[k],tone:bk.color};}).sort(function(a,b){return b.amount-a.amount;});
 return h('div',{className:'stack'},
  h(SM.AppBar,{eyebrow:'Experience · past spending',title:'How your money moved',onBack:c.back},
   h('div',{style:{marginTop:16}},h(SM.SegmentedToggle,{label:'Period',value:mode,onChange:function(v){setMode(v);setSel(null);},options:[{value:'week',label:'Weekly'},{value:'month',label:'Monthly'}]}))),
  h('section',{className:'sm-card surface'},
   h('p',{className:'sm-eyebrow'},selBar?(mode==='week'?dayLabel(+selBar.id.slice(1)):selBar.label):range),
   h('div',{className:'exp-total'},h('span',{className:'v'},F(total)),h('span',{className:'l'},'spent')),
   !selBar?h('span',{className:'sm-chip soft',style:{marginTop:8}},h(SM.Icon,{name:diff<=0?'arrow-down-right':'arrow-up-right',size:16}),(diff<=0?Math.abs(diff)+'% less than ':diff+'% more than ')+prevLabel+(mode==='month'?' (so far)':'')):h('button',{type:'button',className:'sm-chip soft clear',onClick:function(){setSel(null);}},'Show whole '+(mode==='week'?'week':'month'),h(SM.Icon,{name:'close',size:14})),
   h('div',{style:{marginTop:20}},h(SM.BarChart,{bars:bars,selected:sel,onSelect:setSel,label:'Spending by '+(mode==='week'?'day':'week')})),
   h('p',{className:'hint'},'Tap a bar to see that '+(mode==='week'?'day':'week')+'.')),
  items.length?h('section',{className:'sm-card surface'},h('p',{className:'sm-eyebrow'},'By category'),h(SM.BucketBreakdown,{items:items})):null,
  h('section',{className:'sm-card surface list'},h('p',{className:'sm-eyebrow',style:{marginBottom:4}},inRange.length+' transactions'),
   inRange.length?inRange.slice().sort(function(a,b){return b.day-a.day||(a.time<b.time?1:-1);}).map(function(t){var bk=c.bucketOf(t);
    return h(SM.TransactionRow,{key:t.id,vendor:t.forLabel||'Unknown payment',bucket:t.vendor+(bk.outletName?' · '+bk.outletName:''),time:dayLabel(t.day),amount:t.amount,icon:bk.icon,tone:bk.color,onClick:function(){c.setOpenTxn(t.id);}});}):h('p',{className:'muted'},'Nothing spent in this period.')));
}

function Plans(c){
 var ex=useState(null),open=ex[0],setOpen=ex[1];
 var nw=useState(false),isNew=nw[0],setNew=nw[1];
 var dg=useState(null),drag=dg[0],setDrag=dg[1];
 var ov=useState(null),over=ov[0],setOver=ov[1];
 function upd(id,patch){c.setPlans(function(ps){return ps.map(function(x){return x.id===id?Object.assign({},x,patch):x;});});}
 function moveTo(id,section,beforeId){c.setPlans(function(ps){var it=ps.filter(function(x){return x.id===id;})[0];if(!it)return ps;var rest=ps.filter(function(x){return x.id!==id;});var n=Object.assign({},it,{section:section});var idx=beforeId?rest.findIndex(function(x){return x.id===beforeId;}):-1;if(idx<0){var last=-1;rest.forEach(function(x,i){if(x.section===section)last=i;});idx=last<0?(section==='scheduled'?0:rest.length):last+1;}rest.splice(idx,0,n);return rest;});}
 function section(key,title){var items=c.plans.filter(function(x){return x.section===key;});
  return h('div',{className:cx('plan-sec',over===key&&!items.length&&'drop'),onDragOver:function(e){if(drag){e.preventDefault();setOver(key);}},onDrop:function(e){e.preventDefault();if(drag)moveTo(drag,key);setDrag(null);setOver(null);}},
   h(SM.SectionHeader,{title:title+' · '+items.length}),
   items.length?null:h('p',{className:'drop-hint'},'Drag a plan here'),
   items.map(function(it){var isOpen=open===it.id;
    return h(Swipeable,{key:it.id,disabled:isOpen,side:key==='tbd'?'right':'left',label:key==='tbd'?'Move to scheduled':'Move to TBD',onSwipe:function(){var from=key,to=key==='tbd'?'scheduled':'tbd';moveTo(it.id,to);c.say('“'+(it.title||'Untitled plan')+'” moved to '+(to==='scheduled'?'Scheduled':'TBD')+'.',function(){moveTo(it.id,from);});}},
     h(SM.PlanItem,{title:it.title||'Untitled plan',meta:isOpen?null:([it.when,it.amount?F(+String(it.amount).replace(/,/g,'')||0)+' in mind':null,it.notes].filter(Boolean).join(' · ')||'Add more details…'),done:it.done,expanded:isOpen,
     onToggle:function(){upd(it.id,{done:!it.done});},onExpand:function(){setOpen(isOpen?null:it.id);},
     draggable:true,dragging:drag===it.id,onDragStart:function(e){setDrag(it.id);e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain',it.id);}catch(_){}},onDragEnd:function(){setDrag(null);setOver(null);},
     onDragOver:function(e){if(drag&&drag!==it.id){e.preventDefault();e.stopPropagation();setOver(it.id);}},onDrop:function(e){e.preventDefault();e.stopPropagation();if(drag&&drag!==it.id)moveTo(drag,key,it.id);setDrag(null);setOver(null);}},
     h(SM.TextField,{id:'plan-title-'+it.id,label:'What is it?',value:it.title,placeholder:'e.g. Vartika’s birthday',onChange:function(v){upd(it.id,{title:v});}}),
     h(SM.TextField,{id:'plan-when-'+it.id,label:'When',value:it.when,placeholder:'e.g. 25 Sep, or “sometime in October”',onChange:function(v){upd(it.id,{when:v});}}),
     h(SM.TextField,{id:'plan-amount-'+it.id,label:'Amount you have in mind',prefix:'₹',value:it.amount,placeholder:'e.g. 1,500',hint:'Just for you. Plans are never counted in any total, projection or chart.',onChange:function(v){upd(it.id,{amount:v.replace(/[^\d,]/g,'')});}}),
     h(SM.TextField,{id:'plan-notes-'+it.id,label:'Notes',multiline:true,value:it.notes,placeholder:'Who’s going, what to book, a rough idea of cost…',onChange:function(v){upd(it.id,{notes:v});}}),
     h('div',{className:'row-btns'},h(SM.Button,{variant:'danger',size:'sm',icon:'trash',onClick:function(){var snapshot=c.plans;c.setPlans(function(ps){return ps.filter(function(x){return x.id!==it.id;});});setOpen(null);c.say('“'+(it.title||'Untitled plan')+'” removed.',function(){c.setPlans(snapshot);});}},'Remove'))));}));}
 return h('div',{className:'stack'},
  h('section',{className:'sm-appbar'},h('p',{className:'sm-eyebrow',style:{marginTop:8}},'Future / upcoming'),h('h1',{className:'sm-appbar-title'},'What’s planned?'),
   h('p',{className:'plans-lede'},'Notes to yourself about what is coming. They show up as cues before you spend, and are never added to any total.'),
),
  h('section',{className:'sm-card surface plans'},section('scheduled','Scheduled'),section('tbd','TBD'),
   h('div',{style:{marginTop:16}},h(SM.Button,{full:true,icon:'plus',onClick:function(){setNew(true);}},'Make notes on upcoming expenses'))),
  isNew?h(NewPlanSheet,{onClose:function(){setNew(false);},onAdd:function(p){c.setPlans(function(ps){return ps.concat([p]);});setNew(false);}}):null);
}

function Swipeable(p){
 var st=useState(0),dx=st[0],setDx=st[1];
 var start=React.useRef(null);
 function down(e){if(p.disabled)return;start.current=e.clientX;try{e.currentTarget.setPointerCapture(e.pointerId);}catch(_){}}
 function move(e){if(start.current===null||start.current===undefined)return;var d=e.clientX-start.current;
  if(p.side==='right')d=Math.max(-24,d);else d=Math.min(24,d);setDx(d);}
 function up(){if(start.current===null||start.current===undefined)return;var d=dx;start.current=null;setDx(0);
  if((p.side==='right'&&d>90)||(p.side==='left'&&d<-90))p.onSwipe();}
 return h('div',{className:'swipe-wrap'},
  h('span',{className:cx('swipe-bg',p.side),'aria-hidden':true},h(SM.Icon,{name:'swap',size:16}),p.label),
  h('div',{className:'swipe-layer',style:dx?{transform:'translateX('+dx+'px)'}:null,onPointerDown:down,onPointerMove:move,onPointerUp:up,onPointerCancel:up},p.children));
}

function NewPlanSheet(p){
 var st=useState({title:'',when:'',amount:'',notes:'',section:''}),f=st[0],setF=st[1];
 function set(k,v){var n={};n[k]=v;setF(Object.assign({},f,n));}
 var valid=f.title.trim()&&f.section;
 return h('div',{className:'sheet-host'},h(SM.BottomSheet,{open:true,onClose:p.onClose,pill:'New plan',title:f.title||'What’s coming up?',subtitle:'A reminder for yourself — never counted in any total',
  footer:[h(SM.Button,{key:'a',full:true,disabled:!valid,onClick:function(){p.onAdd({id:'p'+Date.now(),section:f.section,title:f.title.trim(),when:f.when,amount:f.amount,notes:f.notes,done:false});}},'Add plan'),
   !f.section?h('p',{key:'h',className:'sheet-hint'},'Pick scheduled or TBD to add it.'):null]},
  h(SM.TextField,{id:'np-title',label:'What is it?',value:f.title,placeholder:'e.g. Vartika’s birthday',onChange:function(v){set('title',v);}}),
  h(SM.TextField,{id:'np-when',label:'When',value:f.when,placeholder:'e.g. 25 Sep, or “sometime in October”',onChange:function(v){set('when',v);}}),
  h(SM.TextField,{id:'np-amount',label:'Amount you have in mind',prefix:'₹',value:f.amount,placeholder:'e.g. 1,500',hint:'Just for you. Plans are never counted in any total, projection or chart.',onChange:function(v){set('amount',v.replace(/[^\d,]/g,''));}}),
  h(SM.TextField,{id:'np-notes',label:'Notes',multiline:true,value:f.notes,placeholder:'Who’s going, what to book, a rough idea of cost…',onChange:function(v){set('notes',v);}}),
  h('div',{className:'sm-field'},h('span',{className:'l'},'Where does it go?'),
   h(SM.FilterChips,{single:true,label:'Where does it go?',value:f.section?[f.section]:[],onChange:function(v){set('section',v[0]||'');},
    options:[{value:'scheduled',label:'Scheduled'},{value:'tbd',label:'TBD'}]}),
   h('p',{className:'hint-s'},'Scheduled is decided. TBD is still a maybe. You can drag it across later.'))));
}

function AddTxnSheet(p){
 var st=useState({amount:'',forLabel:'',vendor:'',bucket:'',outlet:'',when:'Today'}),f=st[0],setF=st[1];
 function set(k,v){var n={};n[k]=v;setF(Object.assign({},f,n));}
 if(!p.open)return null;
 var cur=p.buckets.filter(function(b){return b.id===f.bucket;})[0];
 var amt=+String(f.amount).replace(/[^\d]/g,'');
 var valid=amt>0&&f.forLabel.trim();
 return h('div',{className:'sheet-host'},h(SM.BottomSheet,{open:true,onClose:p.onClose,pill:'By hand',title:'Add a payment',subtitle:'For cash, or anything the app did not catch',
  footer:h(SM.Button,{full:true,disabled:!valid,onClick:function(){p.onAdd({id:'t'+Date.now(),day:TODAY,time:'18:30',vendor:f.vendor.trim()||'Cash',forLabel:f.forLabel.trim(),
   amount:-amt,bucket:f.bucket||null,income:false,outlet:f.outlet||null,note:'',frequent:false,social:false,planned:false});}},'Add payment')},
  h(SM.TextField,{id:'at-amount',label:'Amount',prefix:'₹',inputMode:'numeric',value:f.amount,placeholder:'0',onChange:function(v){set('amount',v.replace(/[^\d,]/g,''));}}),
  h(SM.TextField,{id:'at-for',label:'For?',value:f.forLabel,placeholder:'e.g. auto to college',onChange:function(v){set('forLabel',v);}}),
  h(SM.TextField,{id:'at-vendor',label:'Paid to (optional)',value:f.vendor,placeholder:'e.g. Chai tapri, or leave blank for cash',onChange:function(v){set('vendor',v);}}),
  h('div',{className:'sm-field'},h('span',{className:'l'},'Category'),h(SM.FilterChips,{single:true,label:'Category',value:f.bucket?[f.bucket]:[],onChange:function(v){set('bucket',v[0]||'');setF(function(x){return x;});},options:p.buckets.map(function(b){return {value:b.id,label:b.name};})})),
  cur?h('div',{className:'sm-field'},h('span',{className:'l'},'Section'),h(SM.FilterChips,{single:true,label:'Section',value:f.outlet?[f.outlet]:[],onChange:function(v){set('outlet',v[0]||'');},options:cur.outlets.map(function(o){return {value:o.id,label:o.name};})})):null,
  h('p',{className:'hint-s'},'Nothing is checked against a limit — this only adds what you spent.')));
}

function LabelPromptSheet(p){
 var pr=p.prompt;
 var st=useState({bucket:pr?pr.bucket||'':'',outlet:''}),f=st[0],setF=st[1];
 if(!pr)return null;
 var cur=p.buckets.filter(function(b){return b.id===f.bucket;})[0];
 return h('div',{className:'sheet-host'},h(SM.BottomSheet,{open:true,onClose:p.onClose,pill:'Noticed a pattern',title:pr.vendor,subtitle:'You paid this '+pr.count+' times in September',
  footer:[h(SM.Button,{key:'f',full:true,disabled:!(f.bucket&&f.outlet),onClick:function(){p.onFile(f.bucket,f.outlet,pr.vendor);}},'File it here'),
   h(SM.Button,{key:'n',full:true,variant:'soft',onClick:p.onClose},'Not now')]},
  h('p',{className:'info-body'},'Filing it means future payments to '+pr.vendor+' land in the same place by themselves. You can change it any time.'),
  h('div',{className:'sm-field'},h('span',{className:'l'},'Category'),h(SM.FilterChips,{single:true,label:'Category',value:f.bucket?[f.bucket]:[],onChange:function(v){setF({bucket:v[0]||'',outlet:''});},options:p.buckets.map(function(b){return {value:b.id,label:b.name};})})),
  cur?h('div',{className:'sm-field'},h('span',{className:'l'},'Section'),h(SM.FilterChips,{single:true,label:'Section',value:f.outlet?[f.outlet]:[],onChange:function(v){setF(Object.assign({},f,{outlet:v[0]||''}));},options:cur.outlets.map(function(o){return {value:o.id,label:o.name};})})):null));
}

function Cue(c){
 var rules=useState(['evenings','weekends']),r=rules[0],setRules=rules[1];
 return h('div',{className:'lockwrap'},
  h('div',{className:'lock'},
   h('p',{className:'lock-date'},'Friday, 18 September'),
   h('p',{className:'lock-time'},'6:40'),
   h('div',{className:'notif'},
    h('div',{className:'notif-head'},h('span',{className:'notif-app'},'Student Money'),h('span',{className:'notif-time'},'now')),
    h('p',{className:'notif-title'},'₹7,943 free · going out tonight?'),
    h('p',{className:'notif-body'},'Last three Fridays you spent ₹860 on average. Check before you go.'),
    h('div',{className:'notif-actions'},
     h('button',{type:'button',className:'na primary',onClick:function(){c.setDecision(null);c.back();c.push('estimate');}},'Check'),
     h('button',{type:'button',className:'na',onClick:function(){c.say('Quiet for the rest of the week.');c.back();}},'Not now')))),
  h('div',{className:'lock-notes'},
   h(SM.SectionHeader,{onCanvas:true,title:'When this is allowed to interrupt'}),
   h('div',{className:'sm-card surface'},
    h(SM.FilterChips,{label:'Cue rules',value:r,onChange:setRules,options:[{value:'evenings',label:'Friday and Saturday evenings'},{value:'weekends',label:'Before a planned outing'},{value:'lowdays',label:'When money is running low'}]}),
    h('ul',{className:'rules-list'},
     h('li',null,'At most two cues a week, never two days running.'),
     h('li',null,'Silent after a “Not now” until the next week.'),
     h('li',null,'Never during the night, and never on exam days you mark.'),
     h('li',null,'A cue only ever reports your own figures. It never says what to do.'))),
   h(SM.Button,{full:true,variant:'soft',onClick:c.back},'Back to the app')));
}

function Widget(c){
 return h('div',{className:'homescreen'},
  h('p',{className:'hs-date'},'Friday, 18 September'),
  h('div',{className:'hs-grid'},['Messages','Camera','Maps','UPI','Photos','Notes','Music','Files'].map(function(n){return h('span',{key:n,className:'hs-app'},h('span',{className:'hs-ico'}),n);})),
  h('button',{type:'button',className:'hs-widget',onClick:function(){c.setDecision(null);c.back();c.push('estimate');}},
   h('span',{className:'w-top'},h('span',{className:'w-name'},'Kharcha?'),h('span',{className:'sm-iconbtn sm-sm dark','aria-hidden':true},h(SM.Icon,{name:'arrow-up-right',size:16}))),
   h('span',{className:'w-value'},F(c.free)),
   h('span',{className:'w-label'},'free to spend · 13 days left'),
   h('span',{className:'w-bars'},c.splits().slice(0,4).map(function(x){return h('span',{key:x.id,className:'w-bar t-'+x.tone,style:{flexGrow:x.pct}});}))),
  h('p',{className:'hs-note'},'Tap the widget to check a spend without opening the app first.'),
  h('div',{style:{padding:'0 8px'}},h(SM.Button,{full:true,variant:'soft',onClick:c.back},'Back to the app')));
}

function Onboarding(c){
 var st=useState({reads:['remarks','amounts'],keep:['eat','travel','subs','shop','ess']}),f=st[0],setF=st[1];
 var step=c.step;
 var pages=[
  {eyebrow:'Welcome',title:'Money you can actually see',body:'This app does not budget for you and never tells you what to spend. It shows what a spend would do to the rest of your month, in your own numbers, and leaves the choice to you.',
   points:['Check any spend before you make it','See where your money actually went, by outlet','Keep notes on what is coming up'],cta:'Next'},
  {eyebrow:'What it reads',title:'You decide what it can see',body:'Pick what the app is allowed to use. You can change this any time, and clear everything from your profile.',cta:'Next'},
  {eyebrow:'Your categories',title:'Start with these?',body:'Keep the ones that sound like you. You can rename them, add sections and add new ones later.',cta:'Start'}
 ];
 var pg=pages[step];
 return h('div',{className:'stack onboard'},
  h('div',{className:'ob-dots'},[0,1,2].map(function(i){return h('span',{key:i,className:i===step?'on':''});})),
  h('section',{className:'sm-appbar'},h('p',{className:'sm-eyebrow'},pg.eyebrow),h('h1',{className:'sm-appbar-title'},pg.title),h('p',{className:'plans-lede'},pg.body)),
  step===0?h('div',{className:'sm-card surface'},h('ul',{className:'rules-list'},pg.points.map(function(x){return h('li',{key:x},x);}))):null,
  step===1?h('div',{className:'sm-card surface'},
   h(SM.FilterChips,{label:'What the app reads',value:f.reads,onChange:function(v){setF(Object.assign({},f,{reads:v}));},
    options:[{value:'remarks',label:'Payment remarks'},{value:'amounts',label:'Amounts and dates'},{value:'contacts',label:'Who you paid'}]}),
   h('p',{className:'hint-s'},'Remarks and amounts are what make “dinner with Riya” possible. Nothing leaves your phone, and none of it is needed to use the app — without them you can still add payments by hand.')):null,
  step===2?h('div',{className:'sm-card surface'},
   h(SM.FilterChips,{label:'Categories to start with',value:f.keep,onChange:function(v){setF(Object.assign({},f,{keep:v}));},
    options:c.buckets.map(function(b){return {value:b.id,label:b.name};})}),
   h('p',{className:'hint-s'},'Sections inside them — delivery apps, cafés, tapri — fill in as you spend.')):null,
  h('div',{className:'exits'},
   h(SM.Button,{full:true,onClick:function(){if(step<2){c.setStep(step+1);}else{c.setBuckets(function(bs){return bs.filter(function(b){return f.keep.indexOf(b.id)>-1;});});c.say('Set up. You can change any of this later.');c.tab('home');}}},pg.cta),
   step>0?h('button',{type:'button',className:'plainlink',onClick:function(){c.setStep(step-1);}},'Back'):h('button',{type:'button',className:'plainlink',onClick:c.back},'Skip for now')));
}

function EmptyHome(c){
 return h('div',{className:'stack'},
  h('h1',{className:'greeting'},'Hi Parisha,'),
  h('p',{className:'greeting-sub'},'Nothing to show yet.'),
  h('section',{className:'sm-projection'},
   h('p',{className:'sm-eyebrow'},'Free to spend'),
   h('p',{className:'v'},'—'),
   h('p',{className:'c'},'Your first payment will fill this in. Until then, there is nothing to report.'),
   h('div',{className:'empty-bars','aria-hidden':true},[1,2,3].map(function(i){return h('span',{key:i});}))),
  h('button',{type:'button',className:'sm-card sunflower cta',onClick:function(){c.setDecision(null);c.back();c.push('estimate');}},
   h('span',{className:'t'},'Kharcha with friends?'),h('span',{className:'s'},'Works from day one — it only needs the amount'),
   h('span',{className:'sm-iconbtn dark sm-lg','aria-hidden':true},h(SM.Icon,{name:'arrow-up-right'}))),
  h(SM.SectionHeader,{onCanvas:true,title:'Get going'}),
  h(SM.LinkRow,{tone:'surface',title:'Add your first payment',caption:'Cash or anything the app did not catch',onClick:function(){c.back();c.push('txns');c.setAdd(true);}}),
  h(SM.LinkRow,{tone:'surface',title:'Note something coming up',caption:'A birthday, a trip, an appointment',onClick:function(){c.back();c.tab('plans');}}),
  h(SM.LinkRow,{tone:'butter',title:'Choose what the app reads',caption:'Remarks and amounts, or nothing at all',onClick:function(){c.back();c.push('onboard');}}),
  h('div',{style:{marginTop:16}},h(SM.Button,{full:true,variant:'soft',onClick:c.back},'Back to the filled-in app')));
}

ReactDOM.createRoot(document.getElementById('app')).render(h(App));
})();
