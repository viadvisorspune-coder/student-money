/* @ds-bundle: {"format":4,"namespace":"StudentMoney","components":[{"name":"Icon"},{"name":"IconButton"},{"name":"Chip"},{"name":"SegmentedToggle"},{"name":"AvatarStack"},{"name":"CalendarHeader"},{"name":"GreetingHero"},{"name":"HighlightCard"},{"name":"TaskCard"},{"name":"ProgressCard"},{"name":"PlanRow"},{"name":"BottomNav"},{"name":"Button"},{"name":"AppBar"},{"name":"SectionHeader"},{"name":"LinkRow"},{"name":"AmountSummary"},{"name":"RingChart"},{"name":"BarChart"},{"name":"BucketBreakdown"},{"name":"BucketCard"},{"name":"TransactionRow"},{"name":"FilterChips"},{"name":"DecisionInput"},{"name":"TextField"},{"name":"BottomSheet"},{"name":"PlanItem"},{"name":"NestedBreakdown"},{"name":"CategoryCard"},{"name":"SelectField"},{"name":"ResultHeadline"},{"name":"ProjectionCard"},{"name":"InsightCard"},{"name":"CueRow"},{"name":"PieChart"},{"name":"BarList"}]} */
(function(){
var React=window.React,h=React.createElement;
function cx(){return Array.prototype.filter.call(arguments,Boolean).join(' ');}
var P={
 'arrow-up-right':'M7 17L17 7M9 7h8v8',
 'arrow-down-right':'M7 7l10 10M17 9v8H9',
 check:'M5 12.5l4.5 4.5L19 7.5',
 close:'M6 6l12 12M18 6L6 18',
 edit:'M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4',
 share:'M17 5.5a2 2 0 1 0 .01 0M7 12a2 2 0 1 0 .01 0M17 18.5a2 2 0 1 0 .01 0M8.8 11l6.4-4M8.8 13l6.4 4',
 chart:'M4 16l5-5 4 3 7-7M15 7h5v5',
 swap:'M7 8h11l-3-3M17 16H6l3 3',
 'chevron-down':'M6 9l6 6 6-6',
 home:'M4 11l8-7 8 7v9h-5v-6H9v6H4z',
 grid:'M5 5h6v6H5zM13 13h6v6h-6z',
 settings:'M12 9a3 3 0 1 0 .01 0M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1',
 user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20c1-3.5 3.8-5 7-5s6 1.5 7 5',
 menu:'M4 7h16M4 12h16M4 17h16',
 wallet:'M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4zM4 7V6a2 2 0 0 1 2-2h10M16 13.5h.01',
 plus:'M12 5v14M5 12h14',
 filter:'M4 6h16M7 12h10M10 18h4',
 'arrow-left':'M19 12H5M11 6l-6 6 6 6',
 'arrow-down-left':'M17 7L7 17M15 17H7V9',
 grip:'M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01',
 trash:'M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12',
 food:'M4 11h16a8 8 0 0 1-16 0zM9 4v3M12 3v4M15 4v3',
 bag:'M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2',
 bus:'M6 4h12v12H6zM6 11h12M8 19v-3M16 19v-3M9 14h.01M15 14h.01',
 play:'M8 5v14l11-7z',
 receipt:'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6',
 target:'M12 12h.01M12 7a5 5 0 1 0 .01 0M12 3a9 9 0 1 0 .01 0'
};
function Icon(p){var s=p.size||20;return h('svg',{className:cx('sm-icon',p.className),width:s,height:s,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.75,strokeLinecap:'round',strokeLinejoin:'round','aria-hidden':true},h('path',{d:P[p.name]||''}));}
function IconButton(p){var v=p.variant||'soft';return h('button',{type:'button',className:cx('sm-iconbtn',v,p.size==='lg'&&'sm-lg',p.size==='sm'&&'sm-sm',p.className),'aria-label':p.label,onClick:p.onClick},h(Icon,{name:p.icon,size:p.size==='sm'?16:20}));}
function Chip(p){var v=p.variant||'soft';return h('span',{className:cx('sm-chip',v,p.className)},p.icon?h(Icon,{name:p.icon,size:16,className:p.trend==='up'?'sm-pos':p.trend==='down'?'sm-neg':null}):null,p.children);}
function SegmentedToggle(p){var st=React.useState(p.defaultValue||(p.options[0]&&p.options[0].value));var val=p.value!==undefined?p.value:st[0];
 return h('div',{className:'sm-seg',role:'group','aria-label':p.label||'View'},p.options.map(function(o){return h('button',{key:o.value,type:'button','aria-pressed':val===o.value,onClick:function(){st[1](o.value);p.onChange&&p.onChange(o.value);}},o.label);}));}
function AvatarStack(p){var people=p.people||[];var max=p.max||3;var shown=people.slice(0,max);var extra=(p.extra||0)+Math.max(0,people.length-max);
 return h('div',{className:'sm-avatars',role:'img','aria-label':(people.length+(p.extra||0))+' people'},shown.map(function(x,i){return h('span',{key:i,className:cx('sm-avatar','t-'+(x.tone||'soft'),p.size==='lg'&&'sm-lg'),title:x.name},x.initials);}),extra>0?h('span',{className:cx('sm-avatar',p.extraTone==='coral'?'t-coral':'t-ink',p.size==='lg'&&'sm-lg')},'+'+extra):null);}
function CalendarHeader(p){var st=React.useState(p.defaultSelected);var sel=p.selected!==undefined?p.selected:st[0];
 return h('header',{className:'sm-header'},
  h('div',{className:'sm-header-top'},h('button',{type:'button',className:'sm-iconbtn sm-sm',style:{background:'none',color:'inherit'},'aria-label':'Menu'},h(Icon,{name:'menu',size:24})),p.avatar||null),
  h('button',{type:'button',className:'sm-month',style:{marginTop:24},onClick:p.onMonthClick},p.month,h(Icon,{name:'chevron-down',size:22})),
  h('div',{className:'sm-dates',role:'group','aria-label':'Choose a day'},(p.days||[]).map(function(d){return h('button',{key:d.date,type:'button',className:'sm-date','aria-pressed':sel===d.date,onClick:function(){st[1](d.date);p.onSelect&&p.onSelect(d.date);}},h('span',{className:'w'},d.weekday),h('span',{className:'d'},d.date));})));}
function GreetingHero(p){return h('section',{className:'sm-hero'},
  h('div',{className:'sm-header-top'},p.leading||h('span',null),p.trailing||null),
  p.eyebrow?h('p',{className:'eyebrow'},p.eyebrow):null,
  h('h1',null,p.children),
  p.stats?h('div',{className:'sm-hero-stats'},p.stats):null);}
function HighlightCard(p){return h('div',{className:cx('sm-card sm-highlight',p.tone||'sunflower')},
  h('div',{className:'txt'},h('p',{className:'t'},p.title),p.subtitle?h('p',{className:'s'},p.subtitle):null),p.action||null);}
function TaskCard(p){return h('article',{className:cx('sm-card sm-task',p.tone||'surface')},
  h('div',{className:'top'},h('div',null,p.time?h('p',{className:'time'},p.time):null,h('h3',{className:'t'},p.title)),p.people||null),
  p.subtitle?h('p',{className:'s'},p.subtitle):null,
  h('div',{className:'foot'},(p.chips||[]).map(function(c,i){return h(Chip,{key:i},c);}),h(IconButton,{variant:'dark',icon:'arrow-up-right',size:'lg',label:p.openLabel||('Open '+p.title),onClick:p.onOpen})));}
function ProgressCard(p){return h('section',{className:cx('sm-card sm-progress',p.tone||'sky')},
  h('div',{className:'head'},h('span',{className:'sm-iconbtn sm-sm light','aria-hidden':true},h(Icon,{name:p.icon||'chart',size:16})),p.toggle||null),
  h('div',{className:'body'},h('div',null,h('p',{className:'l'},p.label),h('p',{className:'m'},p.message)),h('span',{className:'v'},p.value)));}
function PlanRow(p){return h('button',{type:'button',className:'sm-plan','aria-current':p.active?'step':undefined,onClick:p.onClick},h('span',{className:'t'},p.title),h('span',{className:'time'},p.time));}
function BottomNav(p){var st=React.useState(p.defaultActive||(p.items[0]&&p.items[0].id));var act=p.active!==undefined?p.active:st[0];
 return h('nav',{className:'sm-nav','aria-label':'Main'},p.items.map(function(it){return h('button',{key:it.id,type:'button','aria-current':act===it.id?'page':undefined,'aria-label':it.label,onClick:function(){st[1](it.id);p.onChange&&p.onChange(it.id);}},h(Icon,{name:it.icon,size:22}),p.showLabels?h('span',{className:'lab'},it.label):null);}));}

function formatINR(n,o){o=o||{};var d=o.decimals||0;var s=Math.abs(n).toLocaleString('en-IN',{minimumFractionDigits:d,maximumFractionDigits:d});var sign=n<0?'−':(o.sign&&n>0?'+':'');return sign+'₹'+s;}
function Button(p){var v=p.variant||'dark';return h('button',{type:p.type||'button',className:cx('sm-button',v,p.full&&'sm-full',p.size==='sm'&&'sm-sm',p.className),onClick:p.onClick,disabled:p.disabled},p.children,p.icon?h(Icon,{name:p.icon,size:18}):null);}
function AppBar(p){return h('header',{className:'sm-appbar'},
 h('div',{className:'sm-appbar-top'},p.onBack?h(IconButton,{icon:'arrow-left',label:p.backLabel||'Back',onClick:p.onBack}):h('span',null),p.trailing||null),
 p.eyebrow?h('p',{className:'sm-eyebrow'},p.eyebrow):null,
 h('h1',{className:'sm-appbar-title'},p.title),
 p.children||null);}
function SectionHeader(p){return h('div',{className:cx('sm-section',p.onCanvas&&'on-canvas')},h('h2',null,p.title),p.action||null);}
function LinkRow(p){return h('button',{type:'button',className:cx('sm-linkrow',p.tone||'soft'),onClick:p.onClick},h('span',{className:'main'},h('span',{className:'t'},p.title),p.caption?h('span',{className:'c'},p.caption):null),h('span',{className:'sm-iconbtn sm-sm dark','aria-hidden':true},h(Icon,{name:p.icon||'arrow-up-right',size:16})));}
function Stack(p){var segs=p.segments||[];var tot=segs.reduce(function(a,s){return a+Math.max(0,s.value);},0)||1;
 return h('div',{className:'sm-stack',role:'img','aria-label':p.label||segs.map(function(s){return s.label+' '+(s.display||s.value);}).join(', ')},segs.map(function(s,i){return h('span',{key:i,className:cx('seg','t-'+(s.tone||'sky'),s.hatch&&'hatch'),style:{flexGrow:Math.max(0,s.value)/tot}});}));}
function AmountSummary(p){var parts=p.parts||[];
 return h('section',{className:cx('sm-card sm-amount',p.tone||'surface',p.size==='lg'&&'sm-lg')},
  p.eyebrow?h('p',{className:'sm-eyebrow'},p.eyebrow):null,
  h('p',{className:'v'},p.value),
  p.caption?h('p',{className:'c'},p.caption):null,
  p.segments?h(Stack,{segments:p.segments}):null,
  parts.length?h('dl',{className:'sm-parts'},parts.map(function(x,i){return h('div',{key:i},h('dt',null,x.tone?h('i',{className:cx('dot','t-'+x.tone,x.hatch&&'hatch')}):null,x.label),h('dd',null,x.value));})):null,
  p.children||null);}
function RingChart(p){var rings=p.rings||[];var n=rings.length;var sw=n>5?8:(n>3?10:14),gap=n>5?5:(n>3?6:8),R=100;var size=p.size||200;
 var fig=h('div',{className:'sm-ring-fig',style:{width:size,height:size}},
  h('svg',{viewBox:'0 0 220 220',width:size,height:size,role:'img','aria-label':rings.map(function(r){return r.label+': '+(r.display||r.value);}).join(', ')},
   rings.map(function(r,i){var rad=R-i*(sw+gap);var c=2*Math.PI*rad;var f=Math.max(0,Math.min(1,r.value/(r.max||1)));
    return h('g',{key:i,transform:'rotate(-90 110 110)'},h('circle',{cx:110,cy:110,r:rad,fill:'none',className:'track',strokeWidth:sw}),f>0?h('circle',{cx:110,cy:110,r:rad,fill:'none',className:'arc t-'+(r.tone||'sky'),strokeWidth:sw,strokeLinecap:'round',strokeDasharray:(c*f)+' '+c}):null);})),
  p.centerValue&&n<=3?h('div',{className:'sm-ring-center'},h('span',{className:'v'},p.centerValue),p.centerLabel?h('span',{className:'l'},p.centerLabel):null):null);
 var legend=h('ul',{className:'sm-legend'},rings.map(function(r,i){return h('li',{key:i},h('i',{className:'dot t-'+(r.tone||'sky')}),h('span',{className:'l'},r.label),h('span',{className:'v'},r.display||r.value));}));
 var inner=[(p.title||p.trailing)?h('div',{key:'h',className:'sm-ringcard-head'},h('p',{className:'sm-eyebrow'},p.title),p.trailing||null):null,h('div',{key:'b',className:'sm-ring'},fig,legend)];
 return p.onClick?h('button',{type:'button',className:'sm-ringcard is-btn',onClick:p.onClick},inner):h('section',{className:'sm-ringcard'},inner);}
function BarChart(p){var bars=p.bars||[];var max=p.max||Math.max.apply(null,bars.map(function(b){return b.value;}).concat([1]));var H=p.height||132;
 return h('div',{className:'sm-bars',role:'group','aria-label':p.label||'Spending chart'},bars.map(function(b){var on=p.selected===b.id;var hh=Math.max(4,Math.round(b.value/max*H));
  return h('button',{key:b.id,type:'button',className:'sm-bar','aria-pressed':on,'aria-label':b.label+': '+(b.display||b.value),onClick:function(){p.onSelect&&p.onSelect(on?null:b.id);}},
   h('span',{className:'val'},b.display||b.value),h('span',{className:'col',style:{height:hh}}),h('span',{className:'lab'},b.label));}));}
function BucketBreakdown(p){var items=(p.items||[]).filter(function(x){return x.amount>0;});var total=items.reduce(function(a,x){return a+x.amount;},0)||1;
 return h('div',{className:'sm-breakdown'},h(Stack,{segments:items.map(function(x){return {label:x.name,value:x.amount,tone:x.tone,display:x.display};})}),
  h('ul',null,items.map(function(x){return h('li',{key:x.id||x.name},h('i',{className:'dot t-'+x.tone}),h('span',{className:'n'},x.name),h('span',{className:'pct'},Math.round(x.amount/total*100)+'%'),h('span',{className:'a'},x.display||formatINR(x.amount)));})));}
function BucketCard(p){var f=p.limit?p.value/p.limit:0;var over=p.goal?false:p.value>p.limit;var left=p.limit-p.value;
 return h('article',{className:cx('sm-card sm-bucket',p.tone||'surface')},
  h('div',{className:'top'},h('span',{className:'sm-badge t-'+(p.color||'sky')},h(Icon,{name:p.icon||'wallet',size:18})),
   h('div',{className:'main'},h('h3',{className:'t'},p.name),p.caption?h('p',{className:'s'},p.caption):null),
   p.onEdit?h(IconButton,{icon:'edit',label:'Edit '+p.name,onClick:p.onEdit}):null),
  h('div',{className:'sm-meter',role:'meter','aria-valuemin':0,'aria-valuemax':p.limit,'aria-valuenow':p.value,'aria-label':p.name},h('span',{className:cx('fill','t-'+(p.color||'sky'),over&&'over'),style:{width:Math.min(100,f*100)+'%'}})),
  h('div',{className:'nums'},h('span',null,h('b',null,formatINR(p.value)),' of '+formatINR(p.limit)+(p.goal?' saved':'')),
   h('span',{className:over?'neg':''},over?[h(Icon,{key:'i',name:'arrow-up-right',size:14}),formatINR(-left)+' over']:(p.goal?Math.round(f*100)+'%':formatINR(left)+' left'))));}
function TransactionRow(p){var inc=p.amount>0;return h('button',{type:'button',className:'sm-txn',onClick:p.onClick},
 h('span',{className:'sm-badge t-'+(p.tone||'soft')},p.initials||h(Icon,{name:p.icon||'wallet',size:18})),
 h('span',{className:'sm-txn-main'},h('span',{className:'v'},p.vendor),h('span',{className:'m'},[p.bucket,p.time].filter(Boolean).join(' · '))),
 h('span',{className:cx('sm-txn-amt',inc?'pos':'out')},h(Icon,{name:inc?'arrow-down-left':'arrow-up-right',size:14}),formatINR(p.amount,{sign:true,decimals:p.decimals})));}
function FilterChips(p){var st=React.useState(p.defaultValue||[]);var val=p.value||st[0];
 return h('div',{className:'sm-filters',role:'group','aria-label':p.label||'Filter'},p.options.map(function(o){var on=val.indexOf(o.value)>-1;
  return h('button',{key:o.value,type:'button',className:'sm-filter','aria-pressed':on,onClick:function(){var nv=p.single?(on?[]:[o.value]):(on?val.filter(function(v){return v!==o.value;}):val.concat([o.value]));st[1](nv);p.onChange&&p.onChange(nv);}},on?h(Icon,{name:'check',size:16}):null,o.label,o.count!=null?h('span',{className:'n'},o.count):null);}));}
function DecisionInput(p){var st=React.useState('');
 return h('form',{className:'sm-card sunflower sm-decide',onSubmit:function(e){e.preventDefault();p.onSubmit&&p.onSubmit(st[0]);}},
  h('p',{className:'sm-eyebrow'},p.eyebrow||'Make a decision'),
  h('div',{className:'sm-decide-row'},
   h('input',{id:p.id||'decision',value:st[0],onChange:function(e){st[1](e.target.value);},placeholder:p.placeholder||'Kharcha?','aria-label':p.label||'What do you want to spend on?',autoComplete:'off'}),
   h('button',{type:'submit',className:'sm-iconbtn dark sm-lg','aria-label':p.submitLabel||'See the impact'},h(Icon,{name:'arrow-up-right'}))),
  p.suggestions?h('div',{className:'sm-decide-sugg'},p.suggestions.map(function(s){return h('button',{key:s,type:'button',className:'sm-chip light',onClick:function(){st[1](s);p.onSuggest&&p.onSuggest(s);}},s);})):null);}
function TextField(p){var id=p.id||('f-'+String(p.label||'field').replace(/\W+/g,'-').toLowerCase());
 return h('div',{className:'sm-field'},h('label',{htmlFor:id,className:'l'},p.label),
  h('div',{className:'box'},p.prefix?h('span',{className:'pre'},p.prefix):null,
   h(p.multiline?'textarea':'input',{id:id,value:p.value,placeholder:p.placeholder,inputMode:p.inputMode,rows:p.multiline?3:undefined,onChange:function(e){p.onChange&&p.onChange(e.target.value);}})),
  p.hint?h('p',{className:'hint'},p.hint):null);}
function BottomSheet(p){var open=p.open;React.useEffect(function(){if(!open)return;function k(e){if(e.key==='Escape'&&p.onClose)p.onClose();}document.addEventListener('keydown',k);return function(){document.removeEventListener('keydown',k);};},[open]);
 if(!open)return null;
 return h('div',{className:cx('sm-sheet-wrap',p.inline&&'inline')},h('div',{className:'sm-scrim',onClick:p.onClose}),
  h('div',{className:'sm-sheet',role:'dialog','aria-modal':!p.inline,'aria-label':p.title},
   h('div',{className:'sm-sheet-grab','aria-hidden':true}),
   h('div',{className:'sm-sheet-head'},h(IconButton,{icon:'close',label:'Close',onClick:p.onClose}),p.pill?h('span',{className:'sm-chip dark'},p.pill):h('span',null),p.trailing||h('span',{className:'sm-sheet-sp'})),
   p.title?h('h2',{className:'sm-sheet-title'},p.title):null,
   p.subtitle?h('p',{className:'sm-sheet-sub'},p.subtitle):null,
   h('div',{className:'sm-sheet-body'},p.children),
   p.footer?h('div',{className:'sm-sheet-foot'},p.footer):null));}
function PlanItem(p){return h('div',{className:cx('sm-planitem',p.expanded&&'open',p.done&&'done',p.dragging&&'dragging'),draggable:!!p.draggable&&!p.expanded,onDragStart:p.onDragStart,onDragEnd:p.onDragEnd,onDragOver:p.onDragOver,onDrop:p.onDrop},
 h('button',{type:'button',className:'sm-check','aria-pressed':!!p.done,'aria-label':(p.done?'Mark not done: ':'Mark done: ')+p.title,onClick:p.onToggle},p.done?h(Icon,{name:'check',size:16}):null),
 h('button',{type:'button',className:'sm-planitem-main','aria-expanded':!!p.expanded,onClick:p.onExpand},h('span',{className:'t'},p.title),p.meta?h('span',{className:'m'},p.meta):null),
 p.amount?h('span',{className:'sm-planitem-amt'},p.amount):null,
 p.expanded?h(IconButton,{icon:'close',size:'sm',label:'Close details',onClick:p.onExpand}):h('span',{className:'sm-grip','aria-hidden':true},h(Icon,{name:'grip',size:20})),
 p.expanded&&p.children?h('div',{className:'sm-planitem-body'},p.children):null);}


function nestTones(color,n){var base=['sunflower','sky','soft','grey','coral'];var warm=color==='sunflower'||color==='butter';var r=[color||'coral'].concat(base.filter(function(t){return t!==color&&!(warm&&(t==='butter'||t==='sunflower'));}));return r.slice(0,n);}
function foldItems(items,max){var s=(items||[]).filter(function(x){return x.amount>0;}).slice().sort(function(a,b){return b.amount-a.amount;});if(s.length>max){var rest=s.slice(max-1);s=s.slice(0,max-1).concat([{id:'__other',label:'Other',amount:rest.reduce(function(a,x){return a+x.amount;},0),caption:rest.map(function(x){return x.label;}).join(', ')}]);}return s;}
function NestedBreakdown(p){var max=p.maxLevels||4;var items=foldItems(p.items,max);
 var total=items.reduce(function(a,x){return a+x.amount;},0);var H=p.height||280;
 if(!total)return h('div',{className:'sm-nest-empty',style:{height:Math.round(H/2)}},p.emptyText||'Nothing spent here yet');
 var tones=nestTones(p.color,items.length);var cum=1,hs=[],ws=[];
 return h('div',{className:'sm-nest',style:{height:H},role:'group','aria-label':p.label||'Breakdown'},items.map(function(x,i){var c=cum;cum-=x.amount/total;var s=Math.sqrt(c);
  var hh=i?Math.max(64,Math.min(H*s,hs[i-1]-66)):H, ww=i?Math.max(36,Math.min(100*s,ws[i-1]-20)):100;hs.push(hh);ws.push(ww);
  var tone=x.tone||tones[i];var on=p.selected===x.id;var pct=Math.round(x.amount/total*100);
  return h('button',{key:x.id,type:'button',className:cx('sm-nest-box','t-'+tone,on&&'on'),style:{width:ww+'%',height:hh,zIndex:i+1},'aria-pressed':on,'aria-label':x.label+': '+formatINR(x.amount)+', '+pct+'% of this category',onClick:function(){p.onSelect&&p.onSelect(on?null:x.id);}},
   h('span',{className:'v'},formatINR(x.amount)),h('span',{className:'l'},x.label),h('span',{className:'pct'},pct+'%'));}));}
function CategoryCard(p){var max=p.maxLevels||4;var shown=foldItems(p.items,max);
 var tones=nestTones(p.color,shown.length);var total=shown.reduce(function(a,x){return a+x.amount;},0)||1;
 var over=p.limit&&p.spent>p.limit;
 return h('article',{className:'sm-card surface sm-category'},
  h('div',{className:'sm-category-head'},h('div',{className:'main'},h('h3',{className:'t'},p.name),
    h('p',{className:'s'},h('b',null,formatINR(p.spent)),p.limit?' of '+formatINR(p.limit):'',p.limit?h('span',{className:over?'neg':''},over?[' · ',h(Icon,{key:'i',name:'arrow-up-right',size:14}),formatINR(p.spent-p.limit)+' over']:' · '+formatINR(p.limit-p.spent)+' left'):null)),
   p.onEdit?h(IconButton,{icon:'edit',label:'Edit '+p.name,onClick:p.onEdit}):null),
  h(NestedBreakdown,{items:p.items,color:p.color,selected:p.selected,onSelect:p.onSelect,height:p.height,label:p.name+' by section',showPercent:p.showPercent,maxLevels:max}),
  (function(){var sel=shown.filter(function(x){return x.id===p.selected;})[0];
   return h('p',{className:'sm-category-note'},sel?(sel.label+' · '+formatINR(sel.amount)+' · '+Math.round(sel.amount/total*100)+'% of '+p.name+(sel.caption?' · '+sel.caption:'')):'Tap a block to see what is inside it');})(),
  p.footer||null);}

function SelectField(p){var id=p.id||('s-'+String(p.label||'field').replace(/\W+/g,'-').toLowerCase());
 return h('div',{className:'sm-field sm-select'},h('label',{htmlFor:id,className:'l'},p.label),
  h('div',{className:'box'},h('select',{id:id,value:p.value||'',onChange:function(e){p.onChange&&p.onChange(e.target.value);}},
   p.placeholder?h('option',{value:''},p.placeholder):null,
   (p.options||[]).map(function(o){return h('option',{key:o.value,value:o.value},o.label);})),h(Icon,{name:'chevron-down',size:20})),
  p.hint?h('p',{className:'hint'},p.hint):null);}
function ResultHeadline(p){return h('section',{className:cx('sm-card sm-result',p.tone||'surface')},
  p.eyebrow?h('p',{className:'sm-eyebrow'},p.eyebrow):null,
  h('p',{className:'nums'},h('span',{className:'from'},p.before),h(Icon,{name:'arrow-up-right',size:22,className:'sep'}),h('span',{className:'to'},p.after)),
  p.caption?h('p',{className:'c'},p.caption):null,
  p.insight?h('p',{className:'ins'},p.insight):null,p.children||null);}
function ProjectionCard(p){var splits=p.splits||[];var sel=p.selected;
 return h('section',{className:'sm-projection'},
  h('div',{className:'head'},h('p',{className:'sm-eyebrow'},p.eyebrow||'This month'),p.onExpand?h(IconButton,{icon:'arrow-up-right',variant:'light',size:'sm',label:p.expandLabel||'See all spending',onClick:p.onExpand}):null),
  h('p',{className:'v'},p.value),p.caption?h('p',{className:'c'},p.caption):null,
  h('ul',{className:'splits'},splits.map(function(s){var on=sel===s.id;
   return h('li',{key:s.id},h('button',{type:'button','aria-pressed':on,onClick:function(){p.onSelect&&p.onSelect(on?null:s.id);}},
    h('span',{className:'n'},s.label),h('span',{className:'bar'},h('span',{className:'fill t-'+(s.tone||'sky'),style:{width:s.pct+'%'}})),h('span',{className:'p'},s.pct+'%')));})),
  p.children||null);}
function InsightCard(p){return h('article',{className:cx('sm-insight',p.tone||'soft')},
  h('p',{className:'sm-eyebrow'},p.kind||'Pattern'),
  h('p',{className:'t'},p.children),
  p.detail?h('p',{className:'d'},p.detail):null);}
function CueRow(p){var inner=[h('span',{key:'t',className:'t'},p.title),p.when?h('span',{key:'w',className:'w'},p.when):null,p.note?h('span',{key:'n',className:'n'},p.note):null];
 return p.onClick?h('button',{type:'button',className:'sm-cue',onClick:p.onClick},inner,h(Icon,{name:'arrow-up-right',size:16})):h('div',{className:'sm-cue'},inner);}

function polar(cx,cy,r,a){var t=(a-90)*Math.PI/180;return [cx+r*Math.cos(t),cy+r*Math.sin(t)];}
function slicePath(cx,cy,r,ri,a0,a1){if(a1-a0>=359.999)a1=a0+359.999;
 var s=polar(cx,cy,r,a1),e=polar(cx,cy,r,a0),si=polar(cx,cy,ri,a0),ei=polar(cx,cy,ri,a1),big=a1-a0>180?1:0;
 return ['M',s[0],s[1],'A',r,r,0,big,0,e[0],e[1],'L',si[0],si[1],'A',ri,ri,0,big,1,ei[0],ei[1],'Z'].join(' ');}
function PieChart(p){var items=(p.items||[]).filter(function(x){return x.value>0;});
 var total=p.total||items.reduce(function(a,x){return a+x.value;},0)||1;var size=p.size||190;var a=0;
 return h('div',{className:'sm-pie'},
  h('div',{className:'sm-pie-fig',style:{width:size,height:size}},
   h('svg',{viewBox:'0 0 190 190',width:size,height:size,role:'img','aria-label':items.map(function(x){return x.label+' '+Math.round(x.value/total*100)+'%';}).join(', ')},
    items.map(function(x,i){var sweep=x.value/total*360;var d=slicePath(95,95,88,p.donut===false?0:52,a,a+sweep);a+=sweep;
     return h('path',{key:x.id||i,d:d,className:cx('slice','t-'+(x.tone||'sky'),p.selected===x.id&&'on'),onClick:p.onSelect?function(){p.onSelect(p.selected===x.id?null:x.id);}:null});})),
   p.centerValue?h('div',{className:'sm-pie-center'},h('span',{className:'v'},p.centerValue),p.centerLabel?h('span',{className:'l'},p.centerLabel):null):null),
  h('ul',{className:'sm-pie-legend'},items.map(function(x,i){var pct=Math.round(x.value/total*100);
   return h('li',{key:x.id||i},h('button',{type:'button','aria-pressed':p.selected===x.id,onClick:p.onSelect?function(){p.onSelect(p.selected===x.id?null:x.id);}:null},
    h('i',{className:'dot t-'+(x.tone||'sky')}),h('span',{className:'l'},x.label),h('span',{className:'p'},pct+'%'),x.display?h('span',{className:'v'},x.display):null));})));}
function BarList(p){var items=p.items||[];var max=p.max||Math.max.apply(null,items.map(function(x){return x.value;}).concat([1]));
 return h('ul',{className:cx('sm-barlist',p.onDark&&'on-dark')},items.map(function(x,i){
  return h('li',{key:x.id||i},h('button',{type:'button','aria-pressed':p.selected===x.id,'aria-label':x.label+': '+(x.display||x.value),onClick:p.onSelect?function(){p.onSelect(p.selected===x.id?null:x.id);}:null},
   h('span',{className:'n'},x.label),h('span',{className:'bar'},h('span',{className:'fill t-'+(x.tone||'sky'),style:{width:Math.max(2,x.value/max*100)+'%'}})),h('span',{className:'v'},x.display||x.value)));}));}
window.StudentMoney=Object.assign(window.StudentMoney||{},{Icon:Icon,IconButton:IconButton,Chip:Chip,SegmentedToggle:SegmentedToggle,AvatarStack:AvatarStack,CalendarHeader:CalendarHeader,GreetingHero:GreetingHero,HighlightCard:HighlightCard,TaskCard:TaskCard,ProgressCard:ProgressCard,PlanRow:PlanRow,BottomNav:BottomNav,Button:Button,AppBar:AppBar,SectionHeader:SectionHeader,LinkRow:LinkRow,AmountSummary:AmountSummary,RingChart:RingChart,BarChart:BarChart,BucketBreakdown:BucketBreakdown,BucketCard:BucketCard,TransactionRow:TransactionRow,FilterChips:FilterChips,DecisionInput:DecisionInput,TextField:TextField,BottomSheet:BottomSheet,PlanItem:PlanItem,NestedBreakdown:NestedBreakdown,CategoryCard:CategoryCard,SelectField:SelectField,ResultHeadline:ResultHeadline,ProjectionCard:ProjectionCard,InsightCard:InsightCard,CueRow:CueRow,PieChart:PieChart,BarList:BarList,formatINR:formatINR,iconNames:Object.keys(P)});
})();
