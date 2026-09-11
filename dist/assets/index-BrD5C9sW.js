(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))s(l);new MutationObserver(l=>{for(const c of l)if(c.type==="childList")for(const f of c.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&s(f)}).observe(document,{childList:!0,subtree:!0});function i(l){const c={};return l.integrity&&(c.integrity=l.integrity),l.referrerPolicy&&(c.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?c.credentials="include":l.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(l){if(l.ep)return;l.ep=!0;const c=i(l);fetch(l.href,c)}})();function Ty(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var Rd={exports:{}},ko={};var u_;function Ay(){if(u_)return ko;u_=1;var r=Symbol.for("react.transitional.element"),e=Symbol.for("react.fragment");function i(s,l,c){var f=null;if(c!==void 0&&(f=""+c),l.key!==void 0&&(f=""+l.key),"key"in l){c={};for(var m in l)m!=="key"&&(c[m]=l[m])}else c=l;return l=c.ref,{$$typeof:r,type:s,key:f,ref:l!==void 0?l:null,props:c}}return ko.Fragment=e,ko.jsx=i,ko.jsxs=i,ko}var f_;function Ry(){return f_||(f_=1,Rd.exports=Ay()),Rd.exports}var H=Ry(),Cd={exports:{}},rt={};var d_;function Cy(){if(d_)return rt;d_=1;var r=Symbol.for("react.transitional.element"),e=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),l=Symbol.for("react.profiler"),c=Symbol.for("react.consumer"),f=Symbol.for("react.context"),m=Symbol.for("react.forward_ref"),h=Symbol.for("react.suspense"),d=Symbol.for("react.memo"),g=Symbol.for("react.lazy"),_=Symbol.for("react.activity"),v=Symbol.iterator;function y(L){return L===null||typeof L!="object"?null:(L=v&&L[v]||L["@@iterator"],typeof L=="function"?L:null)}var M={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},w=Object.assign,b={};function x(L,ne,_e){this.props=L,this.context=ne,this.refs=b,this.updater=_e||M}x.prototype.isReactComponent={},x.prototype.setState=function(L,ne){if(typeof L!="object"&&typeof L!="function"&&L!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,L,ne,"setState")},x.prototype.forceUpdate=function(L){this.updater.enqueueForceUpdate(this,L,"forceUpdate")};function I(){}I.prototype=x.prototype;function G(L,ne,_e){this.props=L,this.context=ne,this.refs=b,this.updater=_e||M}var R=G.prototype=new I;R.constructor=G,w(R,x.prototype),R.isPureReactComponent=!0;var D=Array.isArray;function U(){}var P={H:null,A:null,T:null,S:null},T=Object.prototype.hasOwnProperty;function N(L,ne,_e){var Ee=_e.ref;return{$$typeof:r,type:L,key:ne,ref:Ee!==void 0?Ee:null,props:_e}}function z(L,ne){return N(L.type,ne,L.props)}function q(L){return typeof L=="object"&&L!==null&&L.$$typeof===r}function $(L){var ne={"=":"=0",":":"=2"};return"$"+L.replace(/[=:]/g,function(_e){return ne[_e]})}var j=/\/+/g;function X(L,ne){return typeof L=="object"&&L!==null&&L.key!=null?$(""+L.key):ne.toString(36)}function te(L){switch(L.status){case"fulfilled":return L.value;case"rejected":throw L.reason;default:switch(typeof L.status=="string"?L.then(U,U):(L.status="pending",L.then(function(ne){L.status==="pending"&&(L.status="fulfilled",L.value=ne)},function(ne){L.status==="pending"&&(L.status="rejected",L.reason=ne)})),L.status){case"fulfilled":return L.value;case"rejected":throw L.reason}}throw L}function F(L,ne,_e,Ee,Le){var Xe=typeof L;(Xe==="undefined"||Xe==="boolean")&&(L=null);var re=!1;if(L===null)re=!0;else switch(Xe){case"bigint":case"string":case"number":re=!0;break;case"object":switch(L.$$typeof){case r:case e:re=!0;break;case g:return re=L._init,F(re(L._payload),ne,_e,Ee,Le)}}if(re)return Le=Le(L),re=Ee===""?"."+X(L,0):Ee,D(Le)?(_e="",re!=null&&(_e=re.replace(j,"$&/")+"/"),F(Le,ne,_e,"",function(tt){return tt})):Le!=null&&(q(Le)&&(Le=z(Le,_e+(Le.key==null||L&&L.key===Le.key?"":(""+Le.key).replace(j,"$&/")+"/")+re)),ne.push(Le)),1;re=0;var ve=Ee===""?".":Ee+":";if(D(L))for(var Ae=0;Ae<L.length;Ae++)Ee=L[Ae],Xe=ve+X(Ee,Ae),re+=F(Ee,ne,_e,Xe,Le);else if(Ae=y(L),typeof Ae=="function")for(L=Ae.call(L),Ae=0;!(Ee=L.next()).done;)Ee=Ee.value,Xe=ve+X(Ee,Ae++),re+=F(Ee,ne,_e,Xe,Le);else if(Xe==="object"){if(typeof L.then=="function")return F(te(L),ne,_e,Ee,Le);throw ne=String(L),Error("Objects are not valid as a React child (found: "+(ne==="[object Object]"?"object with keys {"+Object.keys(L).join(", ")+"}":ne)+"). If you meant to render a collection of children, use an array instead.")}return re}function V(L,ne,_e){if(L==null)return L;var Ee=[],Le=0;return F(L,Ee,"","",function(Xe){return ne.call(_e,Xe,Le++)}),Ee}function ue(L){if(L._status===-1){var ne=L._result;ne=ne(),ne.then(function(_e){(L._status===0||L._status===-1)&&(L._status=1,L._result=_e)},function(_e){(L._status===0||L._status===-1)&&(L._status=2,L._result=_e)}),L._status===-1&&(L._status=0,L._result=ne)}if(L._status===1)return L._result.default;throw L._result}var K=typeof reportError=="function"?reportError:function(L){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var ne=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof L=="object"&&L!==null&&typeof L.message=="string"?String(L.message):String(L),error:L});if(!window.dispatchEvent(ne))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",L);return}console.error(L)},he={map:V,forEach:function(L,ne,_e){V(L,function(){ne.apply(this,arguments)},_e)},count:function(L){var ne=0;return V(L,function(){ne++}),ne},toArray:function(L){return V(L,function(ne){return ne})||[]},only:function(L){if(!q(L))throw Error("React.Children.only expected to receive a single React element child.");return L}};return rt.Activity=_,rt.Children=he,rt.Component=x,rt.Fragment=i,rt.Profiler=l,rt.PureComponent=G,rt.StrictMode=s,rt.Suspense=h,rt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=P,rt.__COMPILER_RUNTIME={__proto__:null,c:function(L){return P.H.useMemoCache(L)}},rt.cache=function(L){return function(){return L.apply(null,arguments)}},rt.cacheSignal=function(){return null},rt.cloneElement=function(L,ne,_e){if(L==null)throw Error("The argument must be a React element, but you passed "+L+".");var Ee=w({},L.props),Le=L.key;if(ne!=null)for(Xe in ne.key!==void 0&&(Le=""+ne.key),ne)!T.call(ne,Xe)||Xe==="key"||Xe==="__self"||Xe==="__source"||Xe==="ref"&&ne.ref===void 0||(Ee[Xe]=ne[Xe]);var Xe=arguments.length-2;if(Xe===1)Ee.children=_e;else if(1<Xe){for(var re=Array(Xe),ve=0;ve<Xe;ve++)re[ve]=arguments[ve+2];Ee.children=re}return N(L.type,Le,Ee)},rt.createContext=function(L){return L={$$typeof:f,_currentValue:L,_currentValue2:L,_threadCount:0,Provider:null,Consumer:null},L.Provider=L,L.Consumer={$$typeof:c,_context:L},L},rt.createElement=function(L,ne,_e){var Ee,Le={},Xe=null;if(ne!=null)for(Ee in ne.key!==void 0&&(Xe=""+ne.key),ne)T.call(ne,Ee)&&Ee!=="key"&&Ee!=="__self"&&Ee!=="__source"&&(Le[Ee]=ne[Ee]);var re=arguments.length-2;if(re===1)Le.children=_e;else if(1<re){for(var ve=Array(re),Ae=0;Ae<re;Ae++)ve[Ae]=arguments[Ae+2];Le.children=ve}if(L&&L.defaultProps)for(Ee in re=L.defaultProps,re)Le[Ee]===void 0&&(Le[Ee]=re[Ee]);return N(L,Xe,Le)},rt.createRef=function(){return{current:null}},rt.forwardRef=function(L){return{$$typeof:m,render:L}},rt.isValidElement=q,rt.lazy=function(L){return{$$typeof:g,_payload:{_status:-1,_result:L},_init:ue}},rt.memo=function(L,ne){return{$$typeof:d,type:L,compare:ne===void 0?null:ne}},rt.startTransition=function(L){var ne=P.T,_e={};P.T=_e;try{var Ee=L(),Le=P.S;Le!==null&&Le(_e,Ee),typeof Ee=="object"&&Ee!==null&&typeof Ee.then=="function"&&Ee.then(U,K)}catch(Xe){K(Xe)}finally{ne!==null&&_e.types!==null&&(ne.types=_e.types),P.T=ne}},rt.unstable_useCacheRefresh=function(){return P.H.useCacheRefresh()},rt.use=function(L){return P.H.use(L)},rt.useActionState=function(L,ne,_e){return P.H.useActionState(L,ne,_e)},rt.useCallback=function(L,ne){return P.H.useCallback(L,ne)},rt.useContext=function(L){return P.H.useContext(L)},rt.useDebugValue=function(){},rt.useDeferredValue=function(L,ne){return P.H.useDeferredValue(L,ne)},rt.useEffect=function(L,ne){return P.H.useEffect(L,ne)},rt.useEffectEvent=function(L){return P.H.useEffectEvent(L)},rt.useId=function(){return P.H.useId()},rt.useImperativeHandle=function(L,ne,_e){return P.H.useImperativeHandle(L,ne,_e)},rt.useInsertionEffect=function(L,ne){return P.H.useInsertionEffect(L,ne)},rt.useLayoutEffect=function(L,ne){return P.H.useLayoutEffect(L,ne)},rt.useMemo=function(L,ne){return P.H.useMemo(L,ne)},rt.useOptimistic=function(L,ne){return P.H.useOptimistic(L,ne)},rt.useReducer=function(L,ne,_e){return P.H.useReducer(L,ne,_e)},rt.useRef=function(L){return P.H.useRef(L)},rt.useState=function(L){return P.H.useState(L)},rt.useSyncExternalStore=function(L,ne,_e){return P.H.useSyncExternalStore(L,ne,_e)},rt.useTransition=function(){return P.H.useTransition()},rt.version="19.2.8",rt}var h_;function cp(){return h_||(h_=1,Cd.exports=Cy()),Cd.exports}var jt=cp();const yc=Ty(jt);var wd={exports:{}},Xo={},Dd={exports:{}},Nd={};var p_;function wy(){return p_||(p_=1,(function(r){function e(F,V){var ue=F.length;F.push(V);e:for(;0<ue;){var K=ue-1>>>1,he=F[K];if(0<l(he,V))F[K]=V,F[ue]=he,ue=K;else break e}}function i(F){return F.length===0?null:F[0]}function s(F){if(F.length===0)return null;var V=F[0],ue=F.pop();if(ue!==V){F[0]=ue;e:for(var K=0,he=F.length,L=he>>>1;K<L;){var ne=2*(K+1)-1,_e=F[ne],Ee=ne+1,Le=F[Ee];if(0>l(_e,ue))Ee<he&&0>l(Le,_e)?(F[K]=Le,F[Ee]=ue,K=Ee):(F[K]=_e,F[ne]=ue,K=ne);else if(Ee<he&&0>l(Le,ue))F[K]=Le,F[Ee]=ue,K=Ee;else break e}}return V}function l(F,V){var ue=F.sortIndex-V.sortIndex;return ue!==0?ue:F.id-V.id}if(r.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var c=performance;r.unstable_now=function(){return c.now()}}else{var f=Date,m=f.now();r.unstable_now=function(){return f.now()-m}}var h=[],d=[],g=1,_=null,v=3,y=!1,M=!1,w=!1,b=!1,x=typeof setTimeout=="function"?setTimeout:null,I=typeof clearTimeout=="function"?clearTimeout:null,G=typeof setImmediate<"u"?setImmediate:null;function R(F){for(var V=i(d);V!==null;){if(V.callback===null)s(d);else if(V.startTime<=F)s(d),V.sortIndex=V.expirationTime,e(h,V);else break;V=i(d)}}function D(F){if(w=!1,R(F),!M)if(i(h)!==null)M=!0,U||(U=!0,$());else{var V=i(d);V!==null&&te(D,V.startTime-F)}}var U=!1,P=-1,T=5,N=-1;function z(){return b?!0:!(r.unstable_now()-N<T)}function q(){if(b=!1,U){var F=r.unstable_now();N=F;var V=!0;try{e:{M=!1,w&&(w=!1,I(P),P=-1),y=!0;var ue=v;try{t:{for(R(F),_=i(h);_!==null&&!(_.expirationTime>F&&z());){var K=_.callback;if(typeof K=="function"){_.callback=null,v=_.priorityLevel;var he=K(_.expirationTime<=F);if(F=r.unstable_now(),typeof he=="function"){_.callback=he,R(F),V=!0;break t}_===i(h)&&s(h),R(F)}else s(h);_=i(h)}if(_!==null)V=!0;else{var L=i(d);L!==null&&te(D,L.startTime-F),V=!1}}break e}finally{_=null,v=ue,y=!1}V=void 0}}finally{V?$():U=!1}}}var $;if(typeof G=="function")$=function(){G(q)};else if(typeof MessageChannel<"u"){var j=new MessageChannel,X=j.port2;j.port1.onmessage=q,$=function(){X.postMessage(null)}}else $=function(){x(q,0)};function te(F,V){P=x(function(){F(r.unstable_now())},V)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(F){F.callback=null},r.unstable_forceFrameRate=function(F){0>F||125<F?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):T=0<F?Math.floor(1e3/F):5},r.unstable_getCurrentPriorityLevel=function(){return v},r.unstable_next=function(F){switch(v){case 1:case 2:case 3:var V=3;break;default:V=v}var ue=v;v=V;try{return F()}finally{v=ue}},r.unstable_requestPaint=function(){b=!0},r.unstable_runWithPriority=function(F,V){switch(F){case 1:case 2:case 3:case 4:case 5:break;default:F=3}var ue=v;v=F;try{return V()}finally{v=ue}},r.unstable_scheduleCallback=function(F,V,ue){var K=r.unstable_now();switch(typeof ue=="object"&&ue!==null?(ue=ue.delay,ue=typeof ue=="number"&&0<ue?K+ue:K):ue=K,F){case 1:var he=-1;break;case 2:he=250;break;case 5:he=1073741823;break;case 4:he=1e4;break;default:he=5e3}return he=ue+he,F={id:g++,callback:V,priorityLevel:F,startTime:ue,expirationTime:he,sortIndex:-1},ue>K?(F.sortIndex=ue,e(d,F),i(h)===null&&F===i(d)&&(w?(I(P),P=-1):w=!0,te(D,ue-K))):(F.sortIndex=he,e(h,F),M||y||(M=!0,U||(U=!0,$()))),F},r.unstable_shouldYield=z,r.unstable_wrapCallback=function(F){var V=v;return function(){var ue=v;v=V;try{return F.apply(this,arguments)}finally{v=ue}}}})(Nd)),Nd}var m_;function Dy(){return m_||(m_=1,Dd.exports=wy()),Dd.exports}var Ud={exports:{}},Pn={};var g_;function Ny(){if(g_)return Pn;g_=1;var r=cp();function e(h){var d="https://react.dev/errors/"+h;if(1<arguments.length){d+="?args[]="+encodeURIComponent(arguments[1]);for(var g=2;g<arguments.length;g++)d+="&args[]="+encodeURIComponent(arguments[g])}return"Minified React error #"+h+"; visit "+d+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function i(){}var s={d:{f:i,r:function(){throw Error(e(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},l=Symbol.for("react.portal");function c(h,d,g){var _=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:l,key:_==null?null:""+_,children:h,containerInfo:d,implementation:g}}var f=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function m(h,d){if(h==="font")return"";if(typeof d=="string")return d==="use-credentials"?d:""}return Pn.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=s,Pn.createPortal=function(h,d){var g=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!d||d.nodeType!==1&&d.nodeType!==9&&d.nodeType!==11)throw Error(e(299));return c(h,d,null,g)},Pn.flushSync=function(h){var d=f.T,g=s.p;try{if(f.T=null,s.p=2,h)return h()}finally{f.T=d,s.p=g,s.d.f()}},Pn.preconnect=function(h,d){typeof h=="string"&&(d?(d=d.crossOrigin,d=typeof d=="string"?d==="use-credentials"?d:"":void 0):d=null,s.d.C(h,d))},Pn.prefetchDNS=function(h){typeof h=="string"&&s.d.D(h)},Pn.preinit=function(h,d){if(typeof h=="string"&&d&&typeof d.as=="string"){var g=d.as,_=m(g,d.crossOrigin),v=typeof d.integrity=="string"?d.integrity:void 0,y=typeof d.fetchPriority=="string"?d.fetchPriority:void 0;g==="style"?s.d.S(h,typeof d.precedence=="string"?d.precedence:void 0,{crossOrigin:_,integrity:v,fetchPriority:y}):g==="script"&&s.d.X(h,{crossOrigin:_,integrity:v,fetchPriority:y,nonce:typeof d.nonce=="string"?d.nonce:void 0})}},Pn.preinitModule=function(h,d){if(typeof h=="string")if(typeof d=="object"&&d!==null){if(d.as==null||d.as==="script"){var g=m(d.as,d.crossOrigin);s.d.M(h,{crossOrigin:g,integrity:typeof d.integrity=="string"?d.integrity:void 0,nonce:typeof d.nonce=="string"?d.nonce:void 0})}}else d==null&&s.d.M(h)},Pn.preload=function(h,d){if(typeof h=="string"&&typeof d=="object"&&d!==null&&typeof d.as=="string"){var g=d.as,_=m(g,d.crossOrigin);s.d.L(h,g,{crossOrigin:_,integrity:typeof d.integrity=="string"?d.integrity:void 0,nonce:typeof d.nonce=="string"?d.nonce:void 0,type:typeof d.type=="string"?d.type:void 0,fetchPriority:typeof d.fetchPriority=="string"?d.fetchPriority:void 0,referrerPolicy:typeof d.referrerPolicy=="string"?d.referrerPolicy:void 0,imageSrcSet:typeof d.imageSrcSet=="string"?d.imageSrcSet:void 0,imageSizes:typeof d.imageSizes=="string"?d.imageSizes:void 0,media:typeof d.media=="string"?d.media:void 0})}},Pn.preloadModule=function(h,d){if(typeof h=="string")if(d){var g=m(d.as,d.crossOrigin);s.d.m(h,{as:typeof d.as=="string"&&d.as!=="script"?d.as:void 0,crossOrigin:g,integrity:typeof d.integrity=="string"?d.integrity:void 0})}else s.d.m(h)},Pn.requestFormReset=function(h){s.d.r(h)},Pn.unstable_batchedUpdates=function(h,d){return h(d)},Pn.useFormState=function(h,d,g){return f.H.useFormState(h,d,g)},Pn.useFormStatus=function(){return f.H.useHostTransitionStatus()},Pn.version="19.2.8",Pn}var __;function Uy(){if(__)return Ud.exports;__=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),Ud.exports=Ny(),Ud.exports}var v_;function Ly(){if(v_)return Xo;v_=1;var r=Dy(),e=cp(),i=Uy();function s(t){var n="https://react.dev/errors/"+t;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+t+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function c(t){var n=t,a=t;if(t.alternate)for(;n.return;)n=n.return;else{t=n;do n=t,(n.flags&4098)!==0&&(a=n.return),t=n.return;while(t)}return n.tag===3?a:null}function f(t){if(t.tag===13){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function m(t){if(t.tag===31){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function h(t){if(c(t)!==t)throw Error(s(188))}function d(t){var n=t.alternate;if(!n){if(n=c(t),n===null)throw Error(s(188));return n!==t?null:t}for(var a=t,o=n;;){var u=a.return;if(u===null)break;var p=u.alternate;if(p===null){if(o=u.return,o!==null){a=o;continue}break}if(u.child===p.child){for(p=u.child;p;){if(p===a)return h(u),t;if(p===o)return h(u),n;p=p.sibling}throw Error(s(188))}if(a.return!==o.return)a=u,o=p;else{for(var S=!1,C=u.child;C;){if(C===a){S=!0,a=u,o=p;break}if(C===o){S=!0,o=u,a=p;break}C=C.sibling}if(!S){for(C=p.child;C;){if(C===a){S=!0,a=p,o=u;break}if(C===o){S=!0,o=p,a=u;break}C=C.sibling}if(!S)throw Error(s(189))}}if(a.alternate!==o)throw Error(s(190))}if(a.tag!==3)throw Error(s(188));return a.stateNode.current===a?t:n}function g(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t;for(t=t.child;t!==null;){if(n=g(t),n!==null)return n;t=t.sibling}return null}var _=Object.assign,v=Symbol.for("react.element"),y=Symbol.for("react.transitional.element"),M=Symbol.for("react.portal"),w=Symbol.for("react.fragment"),b=Symbol.for("react.strict_mode"),x=Symbol.for("react.profiler"),I=Symbol.for("react.consumer"),G=Symbol.for("react.context"),R=Symbol.for("react.forward_ref"),D=Symbol.for("react.suspense"),U=Symbol.for("react.suspense_list"),P=Symbol.for("react.memo"),T=Symbol.for("react.lazy"),N=Symbol.for("react.activity"),z=Symbol.for("react.memo_cache_sentinel"),q=Symbol.iterator;function $(t){return t===null||typeof t!="object"?null:(t=q&&t[q]||t["@@iterator"],typeof t=="function"?t:null)}var j=Symbol.for("react.client.reference");function X(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===j?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case w:return"Fragment";case x:return"Profiler";case b:return"StrictMode";case D:return"Suspense";case U:return"SuspenseList";case N:return"Activity"}if(typeof t=="object")switch(t.$$typeof){case M:return"Portal";case G:return t.displayName||"Context";case I:return(t._context.displayName||"Context")+".Consumer";case R:var n=t.render;return t=t.displayName,t||(t=n.displayName||n.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case P:return n=t.displayName||null,n!==null?n:X(t.type)||"Memo";case T:n=t._payload,t=t._init;try{return X(t(n))}catch{}}return null}var te=Array.isArray,F=e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,V=i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ue={pending:!1,data:null,method:null,action:null},K=[],he=-1;function L(t){return{current:t}}function ne(t){0>he||(t.current=K[he],K[he]=null,he--)}function _e(t,n){he++,K[he]=t.current,t.current=n}var Ee=L(null),Le=L(null),Xe=L(null),re=L(null);function ve(t,n){switch(_e(Xe,n),_e(Le,t),_e(Ee,null),n.nodeType){case 9:case 11:t=(t=n.documentElement)&&(t=t.namespaceURI)?L0(t):0;break;default:if(t=n.tagName,n=n.namespaceURI)n=L0(n),t=O0(n,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}ne(Ee),_e(Ee,t)}function Ae(){ne(Ee),ne(Le),ne(Xe)}function tt(t){t.memoizedState!==null&&_e(re,t);var n=Ee.current,a=O0(n,t.type);n!==a&&(_e(Le,t),_e(Ee,a))}function He(t){Le.current===t&&(ne(Ee),ne(Le)),re.current===t&&(ne(re),zo._currentValue=ue)}var ct,an;function st(t){if(ct===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);ct=n&&n[1]||"",an=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+ct+t+an}var yt=!1;function Ot(t,n){if(!t||yt)return"";yt=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var o={DetermineComponentFrameRoot:function(){try{if(n){var Me=function(){throw Error()};if(Object.defineProperty(Me.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(Me,[])}catch(de){var ce=de}Reflect.construct(t,[],Me)}else{try{Me.call()}catch(de){ce=de}t.call(Me.prototype)}}else{try{throw Error()}catch(de){ce=de}(Me=t())&&typeof Me.catch=="function"&&Me.catch(function(){})}}catch(de){if(de&&ce&&typeof de.stack=="string")return[de.stack,ce.stack]}return[null,null]}};o.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var u=Object.getOwnPropertyDescriptor(o.DetermineComponentFrameRoot,"name");u&&u.configurable&&Object.defineProperty(o.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var p=o.DetermineComponentFrameRoot(),S=p[0],C=p[1];if(S&&C){var B=S.split(`
`),oe=C.split(`
`);for(u=o=0;o<B.length&&!B[o].includes("DetermineComponentFrameRoot");)o++;for(;u<oe.length&&!oe[u].includes("DetermineComponentFrameRoot");)u++;if(o===B.length||u===oe.length)for(o=B.length-1,u=oe.length-1;1<=o&&0<=u&&B[o]!==oe[u];)u--;for(;1<=o&&0<=u;o--,u--)if(B[o]!==oe[u]){if(o!==1||u!==1)do if(o--,u--,0>u||B[o]!==oe[u]){var xe=`
`+B[o].replace(" at new "," at ");return t.displayName&&xe.includes("<anonymous>")&&(xe=xe.replace("<anonymous>",t.displayName)),xe}while(1<=o&&0<=u);break}}}finally{yt=!1,Error.prepareStackTrace=a}return(a=t?t.displayName||t.name:"")?st(a):""}function gt(t,n){switch(t.tag){case 26:case 27:case 5:return st(t.type);case 16:return st("Lazy");case 13:return t.child!==n&&n!==null?st("Suspense Fallback"):st("Suspense");case 19:return st("SuspenseList");case 0:case 15:return Ot(t.type,!1);case 11:return Ot(t.type.render,!1);case 1:return Ot(t.type,!0);case 31:return st("Activity");default:return""}}function Wt(t){try{var n="",a=null;do n+=gt(t,a),a=t,t=t.return;while(t);return n}catch(o){return`
Error generating stack: `+o.message+`
`+o.stack}}var sn=Object.prototype.hasOwnProperty,Tn=r.unstable_scheduleCallback,Yt=r.unstable_cancelCallback,rn=r.unstable_shouldYield,Z=r.unstable_requestPaint,Pt=r.unstable_now,Nt=r.unstable_getCurrentPriorityLevel,O=r.unstable_ImmediatePriority,E=r.unstable_UserBlockingPriority,J=r.unstable_NormalPriority,le=r.unstable_LowPriority,pe=r.unstable_IdlePriority,Te=r.log,De=r.unstable_setDisableYieldValue,me=null,ge=null;function Re(t){if(typeof Te=="function"&&De(t),ge&&typeof ge.setStrictMode=="function")try{ge.setStrictMode(me,t)}catch{}}var Ge=Math.clz32?Math.clz32:Qe,Oe=Math.log,Ne=Math.LN2;function Qe(t){return t>>>=0,t===0?32:31-(Oe(t)/Ne|0)|0}var Je=256,it=262144,Y=4194304;function Ce(t){var n=t&42;if(n!==0)return n;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return t&261888;case 262144:case 524288:case 1048576:case 2097152:return t&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function Se(t,n,a){var o=t.pendingLanes;if(o===0)return 0;var u=0,p=t.suspendedLanes,S=t.pingedLanes;t=t.warmLanes;var C=o&134217727;return C!==0?(o=C&~p,o!==0?u=Ce(o):(S&=C,S!==0?u=Ce(S):a||(a=C&~t,a!==0&&(u=Ce(a))))):(C=o&~p,C!==0?u=Ce(C):S!==0?u=Ce(S):a||(a=o&~t,a!==0&&(u=Ce(a)))),u===0?0:n!==0&&n!==u&&(n&p)===0&&(p=u&-u,a=n&-n,p>=a||p===32&&(a&4194048)!==0)?n:u}function we(t,n){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&n)===0}function Fe(t,n){switch(t){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function be(){var t=Y;return Y<<=1,(Y&62914560)===0&&(Y=4194304),t}function Ke(t){for(var n=[],a=0;31>a;a++)n.push(t);return n}function We(t,n){t.pendingLanes|=n,n!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function Ht(t,n,a,o,u,p){var S=t.pendingLanes;t.pendingLanes=a,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=a,t.entangledLanes&=a,t.errorRecoveryDisabledLanes&=a,t.shellSuspendCounter=0;var C=t.entanglements,B=t.expirationTimes,oe=t.hiddenUpdates;for(a=S&~a;0<a;){var xe=31-Ge(a),Me=1<<xe;C[xe]=0,B[xe]=-1;var ce=oe[xe];if(ce!==null)for(oe[xe]=null,xe=0;xe<ce.length;xe++){var de=ce[xe];de!==null&&(de.lane&=-536870913)}a&=~Me}o!==0&&At(t,o,0),p!==0&&u===0&&t.tag!==0&&(t.suspendedLanes|=p&~(S&~n))}function At(t,n,a){t.pendingLanes|=n,t.suspendedLanes&=~n;var o=31-Ge(n);t.entangledLanes|=n,t.entanglements[o]=t.entanglements[o]|1073741824|a&261930}function Yn(t,n){var a=t.entangledLanes|=n;for(t=t.entanglements;a;){var o=31-Ge(a),u=1<<o;u&n|t[o]&n&&(t[o]|=n),a&=~u}}function si(t,n){var a=n&-n;return a=(a&42)!==0?1:Qr(a),(a&(t.suspendedLanes|n))!==0?0:a}function Qr(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function Jr(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function $r(){var t=V.p;return t!==0?t:(t=window.event,t===void 0?32:i_(t.type))}function Ys(t,n){var a=V.p;try{return V.p=t,n()}finally{V.p=a}}var Gi=Math.random().toString(36).slice(2),fn="__reactFiber$"+Gi,Cn="__reactProps$"+Gi,qn="__reactContainer$"+Gi,_s="__reactEvents$"+Gi,ul="__reactListeners$"+Gi,fl="__reactHandles$"+Gi,vs="__reactResources$"+Gi,Oa="__reactMarker$"+Gi;function Pa(t){delete t[fn],delete t[Cn],delete t[_s],delete t[ul],delete t[fl]}function aa(t){var n=t[fn];if(n)return n;for(var a=t.parentNode;a;){if(n=a[qn]||a[fn]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(t=G0(t);t!==null;){if(a=t[fn])return a;t=G0(t)}return n}t=a,a=t.parentNode}return null}function sa(t){if(t=t[fn]||t[qn]){var n=t.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return t}return null}function xs(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t.stateNode;throw Error(s(33))}function Ia(t){var n=t[vs];return n||(n=t[vs]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function dn(t){t[Oa]=!0}var dl=new Set,eo={};function A(t,n){k(t,n),k(t+"Capture",n)}function k(t,n){for(eo[t]=n,t=0;t<n.length;t++)dl.add(n[t])}var fe=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),ie={},ae={};function Pe(t){return sn.call(ae,t)?!0:sn.call(ie,t)?!1:fe.test(t)?ae[t]=!0:(ie[t]=!0,!1)}function Ve(t,n,a){if(Pe(n))if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":t.removeAttribute(n);return;case"boolean":var o=n.toLowerCase().slice(0,5);if(o!=="data-"&&o!=="aria-"){t.removeAttribute(n);return}}t.setAttribute(n,""+a)}}function Ue(t,n,a){if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(n);return}t.setAttribute(n,""+a)}}function Be(t,n,a,o){if(o===null)t.removeAttribute(a);else{switch(typeof o){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(a);return}t.setAttributeNS(n,a,""+o)}}function ze(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function lt(t){var n=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function mt(t,n,a){var o=Object.getOwnPropertyDescriptor(t.constructor.prototype,n);if(!t.hasOwnProperty(n)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var u=o.get,p=o.set;return Object.defineProperty(t,n,{configurable:!0,get:function(){return u.call(this)},set:function(S){a=""+S,p.call(this,S)}}),Object.defineProperty(t,n,{enumerable:o.enumerable}),{getValue:function(){return a},setValue:function(S){a=""+S},stopTracking:function(){t._valueTracker=null,delete t[n]}}}}function Ye(t){if(!t._valueTracker){var n=lt(t)?"checked":"value";t._valueTracker=mt(t,n,""+t[n])}}function Rt(t){if(!t)return!1;var n=t._valueTracker;if(!n)return!0;var a=n.getValue(),o="";return t&&(o=lt(t)?t.checked?"true":"false":t.value),t=o,t!==a?(n.setValue(t),!0):!1}function Kt(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}var qt=/[\n"\\]/g;function dt(t){return t.replace(qt,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function hn(t,n,a,o,u,p,S,C){t.name="",S!=null&&typeof S!="function"&&typeof S!="symbol"&&typeof S!="boolean"?t.type=S:t.removeAttribute("type"),n!=null?S==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+ze(n)):t.value!==""+ze(n)&&(t.value=""+ze(n)):S!=="submit"&&S!=="reset"||t.removeAttribute("value"),n!=null?xn(t,S,ze(n)):a!=null?xn(t,S,ze(a)):o!=null&&t.removeAttribute("value"),u==null&&p!=null&&(t.defaultChecked=!!p),u!=null&&(t.checked=u&&typeof u!="function"&&typeof u!="symbol"),C!=null&&typeof C!="function"&&typeof C!="symbol"&&typeof C!="boolean"?t.name=""+ze(C):t.removeAttribute("name")}function ke(t,n,a,o,u,p,S,C){if(p!=null&&typeof p!="function"&&typeof p!="symbol"&&typeof p!="boolean"&&(t.type=p),n!=null||a!=null){if(!(p!=="submit"&&p!=="reset"||n!=null)){Ye(t);return}a=a!=null?""+ze(a):"",n=n!=null?""+ze(n):a,C||n===t.value||(t.value=n),t.defaultValue=n}o=o??u,o=typeof o!="function"&&typeof o!="symbol"&&!!o,t.checked=C?t.checked:!!o,t.defaultChecked=!!o,S!=null&&typeof S!="function"&&typeof S!="symbol"&&typeof S!="boolean"&&(t.name=S),Ye(t)}function xn(t,n,a){n==="number"&&Kt(t.ownerDocument)===t||t.defaultValue===""+a||(t.defaultValue=""+a)}function ht(t,n,a,o){if(t=t.options,n){n={};for(var u=0;u<a.length;u++)n["$"+a[u]]=!0;for(a=0;a<t.length;a++)u=n.hasOwnProperty("$"+t[a].value),t[a].selected!==u&&(t[a].selected=u),u&&o&&(t[a].defaultSelected=!0)}else{for(a=""+ze(a),n=null,u=0;u<t.length;u++){if(t[u].value===a){t[u].selected=!0,o&&(t[u].defaultSelected=!0);return}n!==null||t[u].disabled||(n=t[u])}n!==null&&(n.selected=!0)}}function zn(t,n,a){if(n!=null&&(n=""+ze(n),n!==t.value&&(t.value=n),a==null)){t.defaultValue!==n&&(t.defaultValue=n);return}t.defaultValue=a!=null?""+ze(a):""}function ri(t,n,a,o){if(n==null){if(o!=null){if(a!=null)throw Error(s(92));if(te(o)){if(1<o.length)throw Error(s(93));o=o[0]}a=o}a==null&&(a=""),n=a}a=ze(n),t.defaultValue=a,o=t.textContent,o===a&&o!==""&&o!==null&&(t.value=o),Ye(t)}function Hn(t,n){if(n){var a=t.firstChild;if(a&&a===t.lastChild&&a.nodeType===3){a.nodeValue=n;return}}t.textContent=n}var Fa=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Ut(t,n,a){var o=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?o?t.setProperty(n,""):n==="float"?t.cssFloat="":t[n]="":o?t.setProperty(n,a):typeof a!="number"||a===0||Fa.has(n)?n==="float"?t.cssFloat=a:t[n]=(""+a).trim():t[n]=a+"px"}function $t(t,n,a){if(n!=null&&typeof n!="object")throw Error(s(62));if(t=t.style,a!=null){for(var o in a)!a.hasOwnProperty(o)||n!=null&&n.hasOwnProperty(o)||(o.indexOf("--")===0?t.setProperty(o,""):o==="float"?t.cssFloat="":t[o]="");for(var u in n)o=n[u],n.hasOwnProperty(u)&&a[u]!==o&&Ut(t,u,o)}else for(var p in n)n.hasOwnProperty(p)&&Ut(t,p,n[p])}function _i(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Gt=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Vi=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Di(t){return Vi.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}function vi(){}var bu=null;function Eu(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var qs=null,Zs=null;function Up(t){var n=sa(t);if(n&&(t=n.stateNode)){var a=t[Cn]||null;e:switch(t=n.stateNode,n.type){case"input":if(hn(t,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=t;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+dt(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var o=a[n];if(o!==t&&o.form===t.form){var u=o[Cn]||null;if(!u)throw Error(s(90));hn(o,u.value,u.defaultValue,u.defaultValue,u.checked,u.defaultChecked,u.type,u.name)}}for(n=0;n<a.length;n++)o=a[n],o.form===t.form&&Rt(o)}break e;case"textarea":zn(t,a.value,a.defaultValue);break e;case"select":n=a.value,n!=null&&ht(t,!!a.multiple,n,!1)}}}var Tu=!1;function Lp(t,n,a){if(Tu)return t(n,a);Tu=!0;try{var o=t(n);return o}finally{if(Tu=!1,(qs!==null||Zs!==null)&&($l(),qs&&(n=qs,t=Zs,Zs=qs=null,Up(n),t)))for(n=0;n<t.length;n++)Up(t[n])}}function to(t,n){var a=t.stateNode;if(a===null)return null;var o=a[Cn]||null;if(o===null)return null;a=o[n];e:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(t=t.type,o=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!o;break e;default:t=!1}if(t)return null;if(a&&typeof a!="function")throw Error(s(231,n,typeof a));return a}var ra=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Au=!1;if(ra)try{var no={};Object.defineProperty(no,"passive",{get:function(){Au=!0}}),window.addEventListener("test",no,no),window.removeEventListener("test",no,no)}catch{Au=!1}var Ba=null,Ru=null,hl=null;function Op(){if(hl)return hl;var t,n=Ru,a=n.length,o,u="value"in Ba?Ba.value:Ba.textContent,p=u.length;for(t=0;t<a&&n[t]===u[t];t++);var S=a-t;for(o=1;o<=S&&n[a-o]===u[p-o];o++);return hl=u.slice(t,1<o?1-o:void 0)}function pl(t){var n=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&n===13&&(t=13)):t=n,t===10&&(t=13),32<=t||t===13?t:0}function ml(){return!0}function Pp(){return!1}function Zn(t){function n(a,o,u,p,S){this._reactName=a,this._targetInst=u,this.type=o,this.nativeEvent=p,this.target=S,this.currentTarget=null;for(var C in t)t.hasOwnProperty(C)&&(a=t[C],this[C]=a?a(p):p[C]);return this.isDefaultPrevented=(p.defaultPrevented!=null?p.defaultPrevented:p.returnValue===!1)?ml:Pp,this.isPropagationStopped=Pp,this}return _(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=ml)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=ml)},persist:function(){},isPersistent:ml}),n}var Ss={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},gl=Zn(Ss),io=_({},Ss,{view:0,detail:0}),bx=Zn(io),Cu,wu,ao,_l=_({},io,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Nu,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==ao&&(ao&&t.type==="mousemove"?(Cu=t.screenX-ao.screenX,wu=t.screenY-ao.screenY):wu=Cu=0,ao=t),Cu)},movementY:function(t){return"movementY"in t?t.movementY:wu}}),Ip=Zn(_l),Ex=_({},_l,{dataTransfer:0}),Tx=Zn(Ex),Ax=_({},io,{relatedTarget:0}),Du=Zn(Ax),Rx=_({},Ss,{animationName:0,elapsedTime:0,pseudoElement:0}),Cx=Zn(Rx),wx=_({},Ss,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Dx=Zn(wx),Nx=_({},Ss,{data:0}),Fp=Zn(Nx),Ux={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Lx={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Ox={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Px(t){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(t):(t=Ox[t])?!!n[t]:!1}function Nu(){return Px}var Ix=_({},io,{key:function(t){if(t.key){var n=Ux[t.key]||t.key;if(n!=="Unidentified")return n}return t.type==="keypress"?(t=pl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Lx[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Nu,charCode:function(t){return t.type==="keypress"?pl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?pl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Fx=Zn(Ix),Bx=_({},_l,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Bp=Zn(Bx),zx=_({},io,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Nu}),Hx=Zn(zx),Gx=_({},Ss,{propertyName:0,elapsedTime:0,pseudoElement:0}),Vx=Zn(Gx),kx=_({},_l,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),Xx=Zn(kx),Wx=_({},Ss,{newState:0,oldState:0}),Yx=Zn(Wx),qx=[9,13,27,32],Uu=ra&&"CompositionEvent"in window,so=null;ra&&"documentMode"in document&&(so=document.documentMode);var Zx=ra&&"TextEvent"in window&&!so,zp=ra&&(!Uu||so&&8<so&&11>=so),Hp=" ",Gp=!1;function Vp(t,n){switch(t){case"keyup":return qx.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function kp(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var js=!1;function jx(t,n){switch(t){case"compositionend":return kp(n);case"keypress":return n.which!==32?null:(Gp=!0,Hp);case"textInput":return t=n.data,t===Hp&&Gp?null:t;default:return null}}function Kx(t,n){if(js)return t==="compositionend"||!Uu&&Vp(t,n)?(t=Op(),hl=Ru=Ba=null,js=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return zp&&n.locale!=="ko"?null:n.data;default:return null}}var Qx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Xp(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n==="input"?!!Qx[t.type]:n==="textarea"}function Wp(t,n,a,o){qs?Zs?Zs.push(o):Zs=[o]:qs=o,n=rc(n,"onChange"),0<n.length&&(a=new gl("onChange","change",null,a,o),t.push({event:a,listeners:n}))}var ro=null,oo=null;function Jx(t){R0(t,0)}function vl(t){var n=xs(t);if(Rt(n))return t}function Yp(t,n){if(t==="change")return n}var qp=!1;if(ra){var Lu;if(ra){var Ou="oninput"in document;if(!Ou){var Zp=document.createElement("div");Zp.setAttribute("oninput","return;"),Ou=typeof Zp.oninput=="function"}Lu=Ou}else Lu=!1;qp=Lu&&(!document.documentMode||9<document.documentMode)}function jp(){ro&&(ro.detachEvent("onpropertychange",Kp),oo=ro=null)}function Kp(t){if(t.propertyName==="value"&&vl(oo)){var n=[];Wp(n,oo,t,Eu(t)),Lp(Jx,n)}}function $x(t,n,a){t==="focusin"?(jp(),ro=n,oo=a,ro.attachEvent("onpropertychange",Kp)):t==="focusout"&&jp()}function eS(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return vl(oo)}function tS(t,n){if(t==="click")return vl(n)}function nS(t,n){if(t==="input"||t==="change")return vl(n)}function iS(t,n){return t===n&&(t!==0||1/t===1/n)||t!==t&&n!==n}var oi=typeof Object.is=="function"?Object.is:iS;function lo(t,n){if(oi(t,n))return!0;if(typeof t!="object"||t===null||typeof n!="object"||n===null)return!1;var a=Object.keys(t),o=Object.keys(n);if(a.length!==o.length)return!1;for(o=0;o<a.length;o++){var u=a[o];if(!sn.call(n,u)||!oi(t[u],n[u]))return!1}return!0}function Qp(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Jp(t,n){var a=Qp(t);t=0;for(var o;a;){if(a.nodeType===3){if(o=t+a.textContent.length,t<=n&&o>=n)return{node:a,offset:n-t};t=o}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=Qp(a)}}function $p(t,n){return t&&n?t===n?!0:t&&t.nodeType===3?!1:n&&n.nodeType===3?$p(t,n.parentNode):"contains"in t?t.contains(n):t.compareDocumentPosition?!!(t.compareDocumentPosition(n)&16):!1:!1}function em(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var n=Kt(t.document);n instanceof t.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)t=n.contentWindow;else break;n=Kt(t.document)}return n}function Pu(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n&&(n==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||n==="textarea"||t.contentEditable==="true")}var aS=ra&&"documentMode"in document&&11>=document.documentMode,Ks=null,Iu=null,co=null,Fu=!1;function tm(t,n,a){var o=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Fu||Ks==null||Ks!==Kt(o)||(o=Ks,"selectionStart"in o&&Pu(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),co&&lo(co,o)||(co=o,o=rc(Iu,"onSelect"),0<o.length&&(n=new gl("onSelect","select",null,n,a),t.push({event:n,listeners:o}),n.target=Ks)))}function ys(t,n){var a={};return a[t.toLowerCase()]=n.toLowerCase(),a["Webkit"+t]="webkit"+n,a["Moz"+t]="moz"+n,a}var Qs={animationend:ys("Animation","AnimationEnd"),animationiteration:ys("Animation","AnimationIteration"),animationstart:ys("Animation","AnimationStart"),transitionrun:ys("Transition","TransitionRun"),transitionstart:ys("Transition","TransitionStart"),transitioncancel:ys("Transition","TransitionCancel"),transitionend:ys("Transition","TransitionEnd")},Bu={},nm={};ra&&(nm=document.createElement("div").style,"AnimationEvent"in window||(delete Qs.animationend.animation,delete Qs.animationiteration.animation,delete Qs.animationstart.animation),"TransitionEvent"in window||delete Qs.transitionend.transition);function Ms(t){if(Bu[t])return Bu[t];if(!Qs[t])return t;var n=Qs[t],a;for(a in n)if(n.hasOwnProperty(a)&&a in nm)return Bu[t]=n[a];return t}var im=Ms("animationend"),am=Ms("animationiteration"),sm=Ms("animationstart"),sS=Ms("transitionrun"),rS=Ms("transitionstart"),oS=Ms("transitioncancel"),rm=Ms("transitionend"),om=new Map,zu="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");zu.push("scrollEnd");function Ni(t,n){om.set(t,n),A(n,[t])}var xl=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},xi=[],Js=0,Hu=0;function Sl(){for(var t=Js,n=Hu=Js=0;n<t;){var a=xi[n];xi[n++]=null;var o=xi[n];xi[n++]=null;var u=xi[n];xi[n++]=null;var p=xi[n];if(xi[n++]=null,o!==null&&u!==null){var S=o.pending;S===null?u.next=u:(u.next=S.next,S.next=u),o.pending=u}p!==0&&lm(a,u,p)}}function yl(t,n,a,o){xi[Js++]=t,xi[Js++]=n,xi[Js++]=a,xi[Js++]=o,Hu|=o,t.lanes|=o,t=t.alternate,t!==null&&(t.lanes|=o)}function Gu(t,n,a,o){return yl(t,n,a,o),Ml(t)}function bs(t,n){return yl(t,null,null,n),Ml(t)}function lm(t,n,a){t.lanes|=a;var o=t.alternate;o!==null&&(o.lanes|=a);for(var u=!1,p=t.return;p!==null;)p.childLanes|=a,o=p.alternate,o!==null&&(o.childLanes|=a),p.tag===22&&(t=p.stateNode,t===null||t._visibility&1||(u=!0)),t=p,p=p.return;return t.tag===3?(p=t.stateNode,u&&n!==null&&(u=31-Ge(a),t=p.hiddenUpdates,o=t[u],o===null?t[u]=[n]:o.push(n),n.lane=a|536870912),p):null}function Ml(t){if(50<Uo)throw Uo=0,Qf=null,Error(s(185));for(var n=t.return;n!==null;)t=n,n=t.return;return t.tag===3?t.stateNode:null}var $s={};function lS(t,n,a,o){this.tag=t,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function li(t,n,a,o){return new lS(t,n,a,o)}function Vu(t){return t=t.prototype,!(!t||!t.isReactComponent)}function oa(t,n){var a=t.alternate;return a===null?(a=li(t.tag,n,t.key,t.mode),a.elementType=t.elementType,a.type=t.type,a.stateNode=t.stateNode,a.alternate=t,t.alternate=a):(a.pendingProps=n,a.type=t.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=t.flags&65011712,a.childLanes=t.childLanes,a.lanes=t.lanes,a.child=t.child,a.memoizedProps=t.memoizedProps,a.memoizedState=t.memoizedState,a.updateQueue=t.updateQueue,n=t.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=t.sibling,a.index=t.index,a.ref=t.ref,a.refCleanup=t.refCleanup,a}function cm(t,n){t.flags&=65011714;var a=t.alternate;return a===null?(t.childLanes=0,t.lanes=n,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=a.childLanes,t.lanes=a.lanes,t.child=a.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=a.memoizedProps,t.memoizedState=a.memoizedState,t.updateQueue=a.updateQueue,t.type=a.type,n=a.dependencies,t.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t}function bl(t,n,a,o,u,p){var S=0;if(o=t,typeof t=="function")Vu(t)&&(S=1);else if(typeof t=="string")S=hy(t,a,Ee.current)?26:t==="html"||t==="head"||t==="body"?27:5;else e:switch(t){case N:return t=li(31,a,n,u),t.elementType=N,t.lanes=p,t;case w:return Es(a.children,u,p,n);case b:S=8,u|=24;break;case x:return t=li(12,a,n,u|2),t.elementType=x,t.lanes=p,t;case D:return t=li(13,a,n,u),t.elementType=D,t.lanes=p,t;case U:return t=li(19,a,n,u),t.elementType=U,t.lanes=p,t;default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case G:S=10;break e;case I:S=9;break e;case R:S=11;break e;case P:S=14;break e;case T:S=16,o=null;break e}S=29,a=Error(s(130,t===null?"null":typeof t,"")),o=null}return n=li(S,a,n,u),n.elementType=t,n.type=o,n.lanes=p,n}function Es(t,n,a,o){return t=li(7,t,o,n),t.lanes=a,t}function ku(t,n,a){return t=li(6,t,null,n),t.lanes=a,t}function um(t){var n=li(18,null,null,0);return n.stateNode=t,n}function Xu(t,n,a){return n=li(4,t.children!==null?t.children:[],t.key,n),n.lanes=a,n.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},n}var fm=new WeakMap;function Si(t,n){if(typeof t=="object"&&t!==null){var a=fm.get(t);return a!==void 0?a:(n={value:t,source:n,stack:Wt(n)},fm.set(t,n),n)}return{value:t,source:n,stack:Wt(n)}}var er=[],tr=0,El=null,uo=0,yi=[],Mi=0,za=null,ki=1,Xi="";function la(t,n){er[tr++]=uo,er[tr++]=El,El=t,uo=n}function dm(t,n,a){yi[Mi++]=ki,yi[Mi++]=Xi,yi[Mi++]=za,za=t;var o=ki;t=Xi;var u=32-Ge(o)-1;o&=~(1<<u),a+=1;var p=32-Ge(n)+u;if(30<p){var S=u-u%5;p=(o&(1<<S)-1).toString(32),o>>=S,u-=S,ki=1<<32-Ge(n)+u|a<<u|o,Xi=p+t}else ki=1<<p|a<<u|o,Xi=t}function Wu(t){t.return!==null&&(la(t,1),dm(t,1,0))}function Yu(t){for(;t===El;)El=er[--tr],er[tr]=null,uo=er[--tr],er[tr]=null;for(;t===za;)za=yi[--Mi],yi[Mi]=null,Xi=yi[--Mi],yi[Mi]=null,ki=yi[--Mi],yi[Mi]=null}function hm(t,n){yi[Mi++]=ki,yi[Mi++]=Xi,yi[Mi++]=za,ki=n.id,Xi=n.overflow,za=t}var wn=null,Qt=null,Et=!1,Ha=null,bi=!1,qu=Error(s(519));function Ga(t){var n=Error(s(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw fo(Si(n,t)),qu}function pm(t){var n=t.stateNode,a=t.type,o=t.memoizedProps;switch(n[fn]=t,n[Cn]=o,a){case"dialog":xt("cancel",n),xt("close",n);break;case"iframe":case"object":case"embed":xt("load",n);break;case"video":case"audio":for(a=0;a<Oo.length;a++)xt(Oo[a],n);break;case"source":xt("error",n);break;case"img":case"image":case"link":xt("error",n),xt("load",n);break;case"details":xt("toggle",n);break;case"input":xt("invalid",n),ke(n,o.value,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name,!0);break;case"select":xt("invalid",n);break;case"textarea":xt("invalid",n),ri(n,o.value,o.defaultValue,o.children)}a=o.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||o.suppressHydrationWarning===!0||N0(n.textContent,a)?(o.popover!=null&&(xt("beforetoggle",n),xt("toggle",n)),o.onScroll!=null&&xt("scroll",n),o.onScrollEnd!=null&&xt("scrollend",n),o.onClick!=null&&(n.onclick=vi),n=!0):n=!1,n||Ga(t,!0)}function mm(t){for(wn=t.return;wn;)switch(wn.tag){case 5:case 31:case 13:bi=!1;return;case 27:case 3:bi=!0;return;default:wn=wn.return}}function nr(t){if(t!==wn)return!1;if(!Et)return mm(t),Et=!0,!1;var n=t.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=t.type,a=!(a!=="form"&&a!=="button")||dd(t.type,t.memoizedProps)),a=!a),a&&Qt&&Ga(t),mm(t),n===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(s(317));Qt=H0(t)}else if(n===31){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(s(317));Qt=H0(t)}else n===27?(n=Qt,ts(t.type)?(t=_d,_d=null,Qt=t):Qt=n):Qt=wn?Ti(t.stateNode.nextSibling):null;return!0}function Ts(){Qt=wn=null,Et=!1}function Zu(){var t=Ha;return t!==null&&(Jn===null?Jn=t:Jn.push.apply(Jn,t),Ha=null),t}function fo(t){Ha===null?Ha=[t]:Ha.push(t)}var ju=L(null),As=null,ca=null;function Va(t,n,a){_e(ju,n._currentValue),n._currentValue=a}function ua(t){t._currentValue=ju.current,ne(ju)}function Ku(t,n,a){for(;t!==null;){var o=t.alternate;if((t.childLanes&n)!==n?(t.childLanes|=n,o!==null&&(o.childLanes|=n)):o!==null&&(o.childLanes&n)!==n&&(o.childLanes|=n),t===a)break;t=t.return}}function Qu(t,n,a,o){var u=t.child;for(u!==null&&(u.return=t);u!==null;){var p=u.dependencies;if(p!==null){var S=u.child;p=p.firstContext;e:for(;p!==null;){var C=p;p=u;for(var B=0;B<n.length;B++)if(C.context===n[B]){p.lanes|=a,C=p.alternate,C!==null&&(C.lanes|=a),Ku(p.return,a,t),o||(S=null);break e}p=C.next}}else if(u.tag===18){if(S=u.return,S===null)throw Error(s(341));S.lanes|=a,p=S.alternate,p!==null&&(p.lanes|=a),Ku(S,a,t),S=null}else S=u.child;if(S!==null)S.return=u;else for(S=u;S!==null;){if(S===t){S=null;break}if(u=S.sibling,u!==null){u.return=S.return,S=u;break}S=S.return}u=S}}function ir(t,n,a,o){t=null;for(var u=n,p=!1;u!==null;){if(!p){if((u.flags&524288)!==0)p=!0;else if((u.flags&262144)!==0)break}if(u.tag===10){var S=u.alternate;if(S===null)throw Error(s(387));if(S=S.memoizedProps,S!==null){var C=u.type;oi(u.pendingProps.value,S.value)||(t!==null?t.push(C):t=[C])}}else if(u===re.current){if(S=u.alternate,S===null)throw Error(s(387));S.memoizedState.memoizedState!==u.memoizedState.memoizedState&&(t!==null?t.push(zo):t=[zo])}u=u.return}t!==null&&Qu(n,t,a,o),n.flags|=262144}function Tl(t){for(t=t.firstContext;t!==null;){if(!oi(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function Rs(t){As=t,ca=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function Dn(t){return gm(As,t)}function Al(t,n){return As===null&&Rs(t),gm(t,n)}function gm(t,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},ca===null){if(t===null)throw Error(s(308));ca=n,t.dependencies={lanes:0,firstContext:n},t.flags|=524288}else ca=ca.next=n;return a}var cS=typeof AbortController<"u"?AbortController:function(){var t=[],n=this.signal={aborted:!1,addEventListener:function(a,o){t.push(o)}};this.abort=function(){n.aborted=!0,t.forEach(function(a){return a()})}},uS=r.unstable_scheduleCallback,fS=r.unstable_NormalPriority,pn={$$typeof:G,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Ju(){return{controller:new cS,data:new Map,refCount:0}}function ho(t){t.refCount--,t.refCount===0&&uS(fS,function(){t.controller.abort()})}var po=null,$u=0,ar=0,sr=null;function dS(t,n){if(po===null){var a=po=[];$u=0,ar=id(),sr={status:"pending",value:void 0,then:function(o){a.push(o)}}}return $u++,n.then(_m,_m),n}function _m(){if(--$u===0&&po!==null){sr!==null&&(sr.status="fulfilled");var t=po;po=null,ar=0,sr=null;for(var n=0;n<t.length;n++)(0,t[n])()}}function hS(t,n){var a=[],o={status:"pending",value:null,reason:null,then:function(u){a.push(u)}};return t.then(function(){o.status="fulfilled",o.value=n;for(var u=0;u<a.length;u++)(0,a[u])(n)},function(u){for(o.status="rejected",o.reason=u,u=0;u<a.length;u++)(0,a[u])(void 0)}),o}var vm=F.S;F.S=function(t,n){t0=Pt(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&dS(t,n),vm!==null&&vm(t,n)};var Cs=L(null);function ef(){var t=Cs.current;return t!==null?t:Zt.pooledCache}function Rl(t,n){n===null?_e(Cs,Cs.current):_e(Cs,n.pool)}function xm(){var t=ef();return t===null?null:{parent:pn._currentValue,pool:t}}var rr=Error(s(460)),tf=Error(s(474)),Cl=Error(s(542)),wl={then:function(){}};function Sm(t){return t=t.status,t==="fulfilled"||t==="rejected"}function ym(t,n,a){switch(a=t[a],a===void 0?t.push(n):a!==n&&(n.then(vi,vi),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,bm(t),t;default:if(typeof n.status=="string")n.then(vi,vi);else{if(t=Zt,t!==null&&100<t.shellSuspendCounter)throw Error(s(482));t=n,t.status="pending",t.then(function(o){if(n.status==="pending"){var u=n;u.status="fulfilled",u.value=o}},function(o){if(n.status==="pending"){var u=n;u.status="rejected",u.reason=o}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,bm(t),t}throw Ds=n,rr}}function ws(t){try{var n=t._init;return n(t._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(Ds=a,rr):a}}var Ds=null;function Mm(){if(Ds===null)throw Error(s(459));var t=Ds;return Ds=null,t}function bm(t){if(t===rr||t===Cl)throw Error(s(483))}var or=null,mo=0;function Dl(t){var n=mo;return mo+=1,or===null&&(or=[]),ym(or,t,n)}function go(t,n){n=n.props.ref,t.ref=n!==void 0?n:null}function Nl(t,n){throw n.$$typeof===v?Error(s(525)):(t=Object.prototype.toString.call(n),Error(s(31,t==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":t)))}function Em(t){function n(Q,W){if(t){var se=Q.deletions;se===null?(Q.deletions=[W],Q.flags|=16):se.push(W)}}function a(Q,W){if(!t)return null;for(;W!==null;)n(Q,W),W=W.sibling;return null}function o(Q){for(var W=new Map;Q!==null;)Q.key!==null?W.set(Q.key,Q):W.set(Q.index,Q),Q=Q.sibling;return W}function u(Q,W){return Q=oa(Q,W),Q.index=0,Q.sibling=null,Q}function p(Q,W,se){return Q.index=se,t?(se=Q.alternate,se!==null?(se=se.index,se<W?(Q.flags|=67108866,W):se):(Q.flags|=67108866,W)):(Q.flags|=1048576,W)}function S(Q){return t&&Q.alternate===null&&(Q.flags|=67108866),Q}function C(Q,W,se,ye){return W===null||W.tag!==6?(W=ku(se,Q.mode,ye),W.return=Q,W):(W=u(W,se),W.return=Q,W)}function B(Q,W,se,ye){var $e=se.type;return $e===w?xe(Q,W,se.props.children,ye,se.key):W!==null&&(W.elementType===$e||typeof $e=="object"&&$e!==null&&$e.$$typeof===T&&ws($e)===W.type)?(W=u(W,se.props),go(W,se),W.return=Q,W):(W=bl(se.type,se.key,se.props,null,Q.mode,ye),go(W,se),W.return=Q,W)}function oe(Q,W,se,ye){return W===null||W.tag!==4||W.stateNode.containerInfo!==se.containerInfo||W.stateNode.implementation!==se.implementation?(W=Xu(se,Q.mode,ye),W.return=Q,W):(W=u(W,se.children||[]),W.return=Q,W)}function xe(Q,W,se,ye,$e){return W===null||W.tag!==7?(W=Es(se,Q.mode,ye,$e),W.return=Q,W):(W=u(W,se),W.return=Q,W)}function Me(Q,W,se){if(typeof W=="string"&&W!==""||typeof W=="number"||typeof W=="bigint")return W=ku(""+W,Q.mode,se),W.return=Q,W;if(typeof W=="object"&&W!==null){switch(W.$$typeof){case y:return se=bl(W.type,W.key,W.props,null,Q.mode,se),go(se,W),se.return=Q,se;case M:return W=Xu(W,Q.mode,se),W.return=Q,W;case T:return W=ws(W),Me(Q,W,se)}if(te(W)||$(W))return W=Es(W,Q.mode,se,null),W.return=Q,W;if(typeof W.then=="function")return Me(Q,Dl(W),se);if(W.$$typeof===G)return Me(Q,Al(Q,W),se);Nl(Q,W)}return null}function ce(Q,W,se,ye){var $e=W!==null?W.key:null;if(typeof se=="string"&&se!==""||typeof se=="number"||typeof se=="bigint")return $e!==null?null:C(Q,W,""+se,ye);if(typeof se=="object"&&se!==null){switch(se.$$typeof){case y:return se.key===$e?B(Q,W,se,ye):null;case M:return se.key===$e?oe(Q,W,se,ye):null;case T:return se=ws(se),ce(Q,W,se,ye)}if(te(se)||$(se))return $e!==null?null:xe(Q,W,se,ye,null);if(typeof se.then=="function")return ce(Q,W,Dl(se),ye);if(se.$$typeof===G)return ce(Q,W,Al(Q,se),ye);Nl(Q,se)}return null}function de(Q,W,se,ye,$e){if(typeof ye=="string"&&ye!==""||typeof ye=="number"||typeof ye=="bigint")return Q=Q.get(se)||null,C(W,Q,""+ye,$e);if(typeof ye=="object"&&ye!==null){switch(ye.$$typeof){case y:return Q=Q.get(ye.key===null?se:ye.key)||null,B(W,Q,ye,$e);case M:return Q=Q.get(ye.key===null?se:ye.key)||null,oe(W,Q,ye,$e);case T:return ye=ws(ye),de(Q,W,se,ye,$e)}if(te(ye)||$(ye))return Q=Q.get(se)||null,xe(W,Q,ye,$e,null);if(typeof ye.then=="function")return de(Q,W,se,Dl(ye),$e);if(ye.$$typeof===G)return de(Q,W,se,Al(W,ye),$e);Nl(W,ye)}return null}function qe(Q,W,se,ye){for(var $e=null,wt=null,je=W,ft=W=0,bt=null;je!==null&&ft<se.length;ft++){je.index>ft?(bt=je,je=null):bt=je.sibling;var Dt=ce(Q,je,se[ft],ye);if(Dt===null){je===null&&(je=bt);break}t&&je&&Dt.alternate===null&&n(Q,je),W=p(Dt,W,ft),wt===null?$e=Dt:wt.sibling=Dt,wt=Dt,je=bt}if(ft===se.length)return a(Q,je),Et&&la(Q,ft),$e;if(je===null){for(;ft<se.length;ft++)je=Me(Q,se[ft],ye),je!==null&&(W=p(je,W,ft),wt===null?$e=je:wt.sibling=je,wt=je);return Et&&la(Q,ft),$e}for(je=o(je);ft<se.length;ft++)bt=de(je,Q,ft,se[ft],ye),bt!==null&&(t&&bt.alternate!==null&&je.delete(bt.key===null?ft:bt.key),W=p(bt,W,ft),wt===null?$e=bt:wt.sibling=bt,wt=bt);return t&&je.forEach(function(rs){return n(Q,rs)}),Et&&la(Q,ft),$e}function et(Q,W,se,ye){if(se==null)throw Error(s(151));for(var $e=null,wt=null,je=W,ft=W=0,bt=null,Dt=se.next();je!==null&&!Dt.done;ft++,Dt=se.next()){je.index>ft?(bt=je,je=null):bt=je.sibling;var rs=ce(Q,je,Dt.value,ye);if(rs===null){je===null&&(je=bt);break}t&&je&&rs.alternate===null&&n(Q,je),W=p(rs,W,ft),wt===null?$e=rs:wt.sibling=rs,wt=rs,je=bt}if(Dt.done)return a(Q,je),Et&&la(Q,ft),$e;if(je===null){for(;!Dt.done;ft++,Dt=se.next())Dt=Me(Q,Dt.value,ye),Dt!==null&&(W=p(Dt,W,ft),wt===null?$e=Dt:wt.sibling=Dt,wt=Dt);return Et&&la(Q,ft),$e}for(je=o(je);!Dt.done;ft++,Dt=se.next())Dt=de(je,Q,ft,Dt.value,ye),Dt!==null&&(t&&Dt.alternate!==null&&je.delete(Dt.key===null?ft:Dt.key),W=p(Dt,W,ft),wt===null?$e=Dt:wt.sibling=Dt,wt=Dt);return t&&je.forEach(function(Ey){return n(Q,Ey)}),Et&&la(Q,ft),$e}function Xt(Q,W,se,ye){if(typeof se=="object"&&se!==null&&se.type===w&&se.key===null&&(se=se.props.children),typeof se=="object"&&se!==null){switch(se.$$typeof){case y:e:{for(var $e=se.key;W!==null;){if(W.key===$e){if($e=se.type,$e===w){if(W.tag===7){a(Q,W.sibling),ye=u(W,se.props.children),ye.return=Q,Q=ye;break e}}else if(W.elementType===$e||typeof $e=="object"&&$e!==null&&$e.$$typeof===T&&ws($e)===W.type){a(Q,W.sibling),ye=u(W,se.props),go(ye,se),ye.return=Q,Q=ye;break e}a(Q,W);break}else n(Q,W);W=W.sibling}se.type===w?(ye=Es(se.props.children,Q.mode,ye,se.key),ye.return=Q,Q=ye):(ye=bl(se.type,se.key,se.props,null,Q.mode,ye),go(ye,se),ye.return=Q,Q=ye)}return S(Q);case M:e:{for($e=se.key;W!==null;){if(W.key===$e)if(W.tag===4&&W.stateNode.containerInfo===se.containerInfo&&W.stateNode.implementation===se.implementation){a(Q,W.sibling),ye=u(W,se.children||[]),ye.return=Q,Q=ye;break e}else{a(Q,W);break}else n(Q,W);W=W.sibling}ye=Xu(se,Q.mode,ye),ye.return=Q,Q=ye}return S(Q);case T:return se=ws(se),Xt(Q,W,se,ye)}if(te(se))return qe(Q,W,se,ye);if($(se)){if($e=$(se),typeof $e!="function")throw Error(s(150));return se=$e.call(se),et(Q,W,se,ye)}if(typeof se.then=="function")return Xt(Q,W,Dl(se),ye);if(se.$$typeof===G)return Xt(Q,W,Al(Q,se),ye);Nl(Q,se)}return typeof se=="string"&&se!==""||typeof se=="number"||typeof se=="bigint"?(se=""+se,W!==null&&W.tag===6?(a(Q,W.sibling),ye=u(W,se),ye.return=Q,Q=ye):(a(Q,W),ye=ku(se,Q.mode,ye),ye.return=Q,Q=ye),S(Q)):a(Q,W)}return function(Q,W,se,ye){try{mo=0;var $e=Xt(Q,W,se,ye);return or=null,$e}catch(je){if(je===rr||je===Cl)throw je;var wt=li(29,je,null,Q.mode);return wt.lanes=ye,wt.return=Q,wt}}}var Ns=Em(!0),Tm=Em(!1),ka=!1;function nf(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function af(t,n){t=t.updateQueue,n.updateQueue===t&&(n.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function Xa(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function Wa(t,n,a){var o=t.updateQueue;if(o===null)return null;if(o=o.shared,(Lt&2)!==0){var u=o.pending;return u===null?n.next=n:(n.next=u.next,u.next=n),o.pending=n,n=Ml(t),lm(t,null,a),n}return yl(t,o,n,a),Ml(t)}function _o(t,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var o=n.lanes;o&=t.pendingLanes,a|=o,n.lanes=a,Yn(t,a)}}function sf(t,n){var a=t.updateQueue,o=t.alternate;if(o!==null&&(o=o.updateQueue,a===o)){var u=null,p=null;if(a=a.firstBaseUpdate,a!==null){do{var S={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};p===null?u=p=S:p=p.next=S,a=a.next}while(a!==null);p===null?u=p=n:p=p.next=n}else u=p=n;a={baseState:o.baseState,firstBaseUpdate:u,lastBaseUpdate:p,shared:o.shared,callbacks:o.callbacks},t.updateQueue=a;return}t=a.lastBaseUpdate,t===null?a.firstBaseUpdate=n:t.next=n,a.lastBaseUpdate=n}var rf=!1;function vo(){if(rf){var t=sr;if(t!==null)throw t}}function xo(t,n,a,o){rf=!1;var u=t.updateQueue;ka=!1;var p=u.firstBaseUpdate,S=u.lastBaseUpdate,C=u.shared.pending;if(C!==null){u.shared.pending=null;var B=C,oe=B.next;B.next=null,S===null?p=oe:S.next=oe,S=B;var xe=t.alternate;xe!==null&&(xe=xe.updateQueue,C=xe.lastBaseUpdate,C!==S&&(C===null?xe.firstBaseUpdate=oe:C.next=oe,xe.lastBaseUpdate=B))}if(p!==null){var Me=u.baseState;S=0,xe=oe=B=null,C=p;do{var ce=C.lane&-536870913,de=ce!==C.lane;if(de?(Mt&ce)===ce:(o&ce)===ce){ce!==0&&ce===ar&&(rf=!0),xe!==null&&(xe=xe.next={lane:0,tag:C.tag,payload:C.payload,callback:null,next:null});e:{var qe=t,et=C;ce=n;var Xt=a;switch(et.tag){case 1:if(qe=et.payload,typeof qe=="function"){Me=qe.call(Xt,Me,ce);break e}Me=qe;break e;case 3:qe.flags=qe.flags&-65537|128;case 0:if(qe=et.payload,ce=typeof qe=="function"?qe.call(Xt,Me,ce):qe,ce==null)break e;Me=_({},Me,ce);break e;case 2:ka=!0}}ce=C.callback,ce!==null&&(t.flags|=64,de&&(t.flags|=8192),de=u.callbacks,de===null?u.callbacks=[ce]:de.push(ce))}else de={lane:ce,tag:C.tag,payload:C.payload,callback:C.callback,next:null},xe===null?(oe=xe=de,B=Me):xe=xe.next=de,S|=ce;if(C=C.next,C===null){if(C=u.shared.pending,C===null)break;de=C,C=de.next,de.next=null,u.lastBaseUpdate=de,u.shared.pending=null}}while(!0);xe===null&&(B=Me),u.baseState=B,u.firstBaseUpdate=oe,u.lastBaseUpdate=xe,p===null&&(u.shared.lanes=0),Ka|=S,t.lanes=S,t.memoizedState=Me}}function Am(t,n){if(typeof t!="function")throw Error(s(191,t));t.call(n)}function Rm(t,n){var a=t.callbacks;if(a!==null)for(t.callbacks=null,t=0;t<a.length;t++)Am(a[t],n)}var lr=L(null),Ul=L(0);function Cm(t,n){t=xa,_e(Ul,t),_e(lr,n),xa=t|n.baseLanes}function of(){_e(Ul,xa),_e(lr,lr.current)}function lf(){xa=Ul.current,ne(lr),ne(Ul)}var ci=L(null),Ei=null;function Ya(t){var n=t.alternate;_e(cn,cn.current&1),_e(ci,t),Ei===null&&(n===null||lr.current!==null||n.memoizedState!==null)&&(Ei=t)}function cf(t){_e(cn,cn.current),_e(ci,t),Ei===null&&(Ei=t)}function wm(t){t.tag===22?(_e(cn,cn.current),_e(ci,t),Ei===null&&(Ei=t)):qa()}function qa(){_e(cn,cn.current),_e(ci,ci.current)}function ui(t){ne(ci),Ei===t&&(Ei=null),ne(cn)}var cn=L(0);function Ll(t){for(var n=t;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||md(a)||gd(a)))return n}else if(n.tag===19&&(n.memoizedProps.revealOrder==="forwards"||n.memoizedProps.revealOrder==="backwards"||n.memoizedProps.revealOrder==="unstable_legacy-backwards"||n.memoizedProps.revealOrder==="together")){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var fa=0,ut=null,Vt=null,mn=null,Ol=!1,cr=!1,Us=!1,Pl=0,So=0,ur=null,pS=0;function on(){throw Error(s(321))}function uf(t,n){if(n===null)return!1;for(var a=0;a<n.length&&a<t.length;a++)if(!oi(t[a],n[a]))return!1;return!0}function ff(t,n,a,o,u,p){return fa=p,ut=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,F.H=t===null||t.memoizedState===null?dg:Af,Us=!1,p=a(o,u),Us=!1,cr&&(p=Nm(n,a,o,u)),Dm(t),p}function Dm(t){F.H=bo;var n=Vt!==null&&Vt.next!==null;if(fa=0,mn=Vt=ut=null,Ol=!1,So=0,ur=null,n)throw Error(s(300));t===null||gn||(t=t.dependencies,t!==null&&Tl(t)&&(gn=!0))}function Nm(t,n,a,o){ut=t;var u=0;do{if(cr&&(ur=null),So=0,cr=!1,25<=u)throw Error(s(301));if(u+=1,mn=Vt=null,t.updateQueue!=null){var p=t.updateQueue;p.lastEffect=null,p.events=null,p.stores=null,p.memoCache!=null&&(p.memoCache.index=0)}F.H=hg,p=n(a,o)}while(cr);return p}function mS(){var t=F.H,n=t.useState()[0];return n=typeof n.then=="function"?yo(n):n,t=t.useState()[0],(Vt!==null?Vt.memoizedState:null)!==t&&(ut.flags|=1024),n}function df(){var t=Pl!==0;return Pl=0,t}function hf(t,n,a){n.updateQueue=t.updateQueue,n.flags&=-2053,t.lanes&=~a}function pf(t){if(Ol){for(t=t.memoizedState;t!==null;){var n=t.queue;n!==null&&(n.pending=null),t=t.next}Ol=!1}fa=0,mn=Vt=ut=null,cr=!1,So=Pl=0,ur=null}function Gn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return mn===null?ut.memoizedState=mn=t:mn=mn.next=t,mn}function un(){if(Vt===null){var t=ut.alternate;t=t!==null?t.memoizedState:null}else t=Vt.next;var n=mn===null?ut.memoizedState:mn.next;if(n!==null)mn=n,Vt=t;else{if(t===null)throw ut.alternate===null?Error(s(467)):Error(s(310));Vt=t,t={memoizedState:Vt.memoizedState,baseState:Vt.baseState,baseQueue:Vt.baseQueue,queue:Vt.queue,next:null},mn===null?ut.memoizedState=mn=t:mn=mn.next=t}return mn}function Il(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function yo(t){var n=So;return So+=1,ur===null&&(ur=[]),t=ym(ur,t,n),n=ut,(mn===null?n.memoizedState:mn.next)===null&&(n=n.alternate,F.H=n===null||n.memoizedState===null?dg:Af),t}function Fl(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return yo(t);if(t.$$typeof===G)return Dn(t)}throw Error(s(438,String(t)))}function mf(t){var n=null,a=ut.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var o=ut.alternate;o!==null&&(o=o.updateQueue,o!==null&&(o=o.memoCache,o!=null&&(n={data:o.data.map(function(u){return u.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=Il(),ut.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(t),o=0;o<t;o++)a[o]=z;return n.index++,a}function da(t,n){return typeof n=="function"?n(t):n}function Bl(t){var n=un();return gf(n,Vt,t)}function gf(t,n,a){var o=t.queue;if(o===null)throw Error(s(311));o.lastRenderedReducer=a;var u=t.baseQueue,p=o.pending;if(p!==null){if(u!==null){var S=u.next;u.next=p.next,p.next=S}n.baseQueue=u=p,o.pending=null}if(p=t.baseState,u===null)t.memoizedState=p;else{n=u.next;var C=S=null,B=null,oe=n,xe=!1;do{var Me=oe.lane&-536870913;if(Me!==oe.lane?(Mt&Me)===Me:(fa&Me)===Me){var ce=oe.revertLane;if(ce===0)B!==null&&(B=B.next={lane:0,revertLane:0,gesture:null,action:oe.action,hasEagerState:oe.hasEagerState,eagerState:oe.eagerState,next:null}),Me===ar&&(xe=!0);else if((fa&ce)===ce){oe=oe.next,ce===ar&&(xe=!0);continue}else Me={lane:0,revertLane:oe.revertLane,gesture:null,action:oe.action,hasEagerState:oe.hasEagerState,eagerState:oe.eagerState,next:null},B===null?(C=B=Me,S=p):B=B.next=Me,ut.lanes|=ce,Ka|=ce;Me=oe.action,Us&&a(p,Me),p=oe.hasEagerState?oe.eagerState:a(p,Me)}else ce={lane:Me,revertLane:oe.revertLane,gesture:oe.gesture,action:oe.action,hasEagerState:oe.hasEagerState,eagerState:oe.eagerState,next:null},B===null?(C=B=ce,S=p):B=B.next=ce,ut.lanes|=Me,Ka|=Me;oe=oe.next}while(oe!==null&&oe!==n);if(B===null?S=p:B.next=C,!oi(p,t.memoizedState)&&(gn=!0,xe&&(a=sr,a!==null)))throw a;t.memoizedState=p,t.baseState=S,t.baseQueue=B,o.lastRenderedState=p}return u===null&&(o.lanes=0),[t.memoizedState,o.dispatch]}function _f(t){var n=un(),a=n.queue;if(a===null)throw Error(s(311));a.lastRenderedReducer=t;var o=a.dispatch,u=a.pending,p=n.memoizedState;if(u!==null){a.pending=null;var S=u=u.next;do p=t(p,S.action),S=S.next;while(S!==u);oi(p,n.memoizedState)||(gn=!0),n.memoizedState=p,n.baseQueue===null&&(n.baseState=p),a.lastRenderedState=p}return[p,o]}function Um(t,n,a){var o=ut,u=un(),p=Et;if(p){if(a===void 0)throw Error(s(407));a=a()}else a=n();var S=!oi((Vt||u).memoizedState,a);if(S&&(u.memoizedState=a,gn=!0),u=u.queue,Sf(Pm.bind(null,o,u,t),[t]),u.getSnapshot!==n||S||mn!==null&&mn.memoizedState.tag&1){if(o.flags|=2048,fr(9,{destroy:void 0},Om.bind(null,o,u,a,n),null),Zt===null)throw Error(s(349));p||(fa&127)!==0||Lm(o,n,a)}return a}function Lm(t,n,a){t.flags|=16384,t={getSnapshot:n,value:a},n=ut.updateQueue,n===null?(n=Il(),ut.updateQueue=n,n.stores=[t]):(a=n.stores,a===null?n.stores=[t]:a.push(t))}function Om(t,n,a,o){n.value=a,n.getSnapshot=o,Im(n)&&Fm(t)}function Pm(t,n,a){return a(function(){Im(n)&&Fm(t)})}function Im(t){var n=t.getSnapshot;t=t.value;try{var a=n();return!oi(t,a)}catch{return!0}}function Fm(t){var n=bs(t,2);n!==null&&$n(n,t,2)}function vf(t){var n=Gn();if(typeof t=="function"){var a=t;if(t=a(),Us){Re(!0);try{a()}finally{Re(!1)}}}return n.memoizedState=n.baseState=t,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:da,lastRenderedState:t},n}function Bm(t,n,a,o){return t.baseState=a,gf(t,Vt,typeof o=="function"?o:da)}function gS(t,n,a,o,u){if(Gl(t))throw Error(s(485));if(t=n.action,t!==null){var p={payload:u,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(S){p.listeners.push(S)}};F.T!==null?a(!0):p.isTransition=!1,o(p),a=n.pending,a===null?(p.next=n.pending=p,zm(n,p)):(p.next=a.next,n.pending=a.next=p)}}function zm(t,n){var a=n.action,o=n.payload,u=t.state;if(n.isTransition){var p=F.T,S={};F.T=S;try{var C=a(u,o),B=F.S;B!==null&&B(S,C),Hm(t,n,C)}catch(oe){xf(t,n,oe)}finally{p!==null&&S.types!==null&&(p.types=S.types),F.T=p}}else try{p=a(u,o),Hm(t,n,p)}catch(oe){xf(t,n,oe)}}function Hm(t,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(o){Gm(t,n,o)},function(o){return xf(t,n,o)}):Gm(t,n,a)}function Gm(t,n,a){n.status="fulfilled",n.value=a,Vm(n),t.state=a,n=t.pending,n!==null&&(a=n.next,a===n?t.pending=null:(a=a.next,n.next=a,zm(t,a)))}function xf(t,n,a){var o=t.pending;if(t.pending=null,o!==null){o=o.next;do n.status="rejected",n.reason=a,Vm(n),n=n.next;while(n!==o)}t.action=null}function Vm(t){t=t.listeners;for(var n=0;n<t.length;n++)(0,t[n])()}function km(t,n){return n}function Xm(t,n){if(Et){var a=Zt.formState;if(a!==null){e:{var o=ut;if(Et){if(Qt){t:{for(var u=Qt,p=bi;u.nodeType!==8;){if(!p){u=null;break t}if(u=Ti(u.nextSibling),u===null){u=null;break t}}p=u.data,u=p==="F!"||p==="F"?u:null}if(u){Qt=Ti(u.nextSibling),o=u.data==="F!";break e}}Ga(o)}o=!1}o&&(n=a[0])}}return a=Gn(),a.memoizedState=a.baseState=n,o={pending:null,lanes:0,dispatch:null,lastRenderedReducer:km,lastRenderedState:n},a.queue=o,a=cg.bind(null,ut,o),o.dispatch=a,o=vf(!1),p=Tf.bind(null,ut,!1,o.queue),o=Gn(),u={state:n,dispatch:null,action:t,pending:null},o.queue=u,a=gS.bind(null,ut,u,p,a),u.dispatch=a,o.memoizedState=t,[n,a,!1]}function Wm(t){var n=un();return Ym(n,Vt,t)}function Ym(t,n,a){if(n=gf(t,n,km)[0],t=Bl(da)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var o=yo(n)}catch(S){throw S===rr?Cl:S}else o=n;n=un();var u=n.queue,p=u.dispatch;return a!==n.memoizedState&&(ut.flags|=2048,fr(9,{destroy:void 0},_S.bind(null,u,a),null)),[o,p,t]}function _S(t,n){t.action=n}function qm(t){var n=un(),a=Vt;if(a!==null)return Ym(n,a,t);un(),n=n.memoizedState,a=un();var o=a.queue.dispatch;return a.memoizedState=t,[n,o,!1]}function fr(t,n,a,o){return t={tag:t,create:a,deps:o,inst:n,next:null},n=ut.updateQueue,n===null&&(n=Il(),ut.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=t.next=t:(o=a.next,a.next=t,t.next=o,n.lastEffect=t),t}function Zm(){return un().memoizedState}function zl(t,n,a,o){var u=Gn();ut.flags|=t,u.memoizedState=fr(1|n,{destroy:void 0},a,o===void 0?null:o)}function Hl(t,n,a,o){var u=un();o=o===void 0?null:o;var p=u.memoizedState.inst;Vt!==null&&o!==null&&uf(o,Vt.memoizedState.deps)?u.memoizedState=fr(n,p,a,o):(ut.flags|=t,u.memoizedState=fr(1|n,p,a,o))}function jm(t,n){zl(8390656,8,t,n)}function Sf(t,n){Hl(2048,8,t,n)}function vS(t){ut.flags|=4;var n=ut.updateQueue;if(n===null)n=Il(),ut.updateQueue=n,n.events=[t];else{var a=n.events;a===null?n.events=[t]:a.push(t)}}function Km(t){var n=un().memoizedState;return vS({ref:n,nextImpl:t}),function(){if((Lt&2)!==0)throw Error(s(440));return n.impl.apply(void 0,arguments)}}function Qm(t,n){return Hl(4,2,t,n)}function Jm(t,n){return Hl(4,4,t,n)}function $m(t,n){if(typeof n=="function"){t=t();var a=n(t);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return t=t(),n.current=t,function(){n.current=null}}function eg(t,n,a){a=a!=null?a.concat([t]):null,Hl(4,4,$m.bind(null,n,t),a)}function yf(){}function tg(t,n){var a=un();n=n===void 0?null:n;var o=a.memoizedState;return n!==null&&uf(n,o[1])?o[0]:(a.memoizedState=[t,n],t)}function ng(t,n){var a=un();n=n===void 0?null:n;var o=a.memoizedState;if(n!==null&&uf(n,o[1]))return o[0];if(o=t(),Us){Re(!0);try{t()}finally{Re(!1)}}return a.memoizedState=[o,n],o}function Mf(t,n,a){return a===void 0||(fa&1073741824)!==0&&(Mt&261930)===0?t.memoizedState=n:(t.memoizedState=a,t=i0(),ut.lanes|=t,Ka|=t,a)}function ig(t,n,a,o){return oi(a,n)?a:lr.current!==null?(t=Mf(t,a,o),oi(t,n)||(gn=!0),t):(fa&42)===0||(fa&1073741824)!==0&&(Mt&261930)===0?(gn=!0,t.memoizedState=a):(t=i0(),ut.lanes|=t,Ka|=t,n)}function ag(t,n,a,o,u){var p=V.p;V.p=p!==0&&8>p?p:8;var S=F.T,C={};F.T=C,Tf(t,!1,n,a);try{var B=u(),oe=F.S;if(oe!==null&&oe(C,B),B!==null&&typeof B=="object"&&typeof B.then=="function"){var xe=hS(B,o);Mo(t,n,xe,hi(t))}else Mo(t,n,o,hi(t))}catch(Me){Mo(t,n,{then:function(){},status:"rejected",reason:Me},hi())}finally{V.p=p,S!==null&&C.types!==null&&(S.types=C.types),F.T=S}}function xS(){}function bf(t,n,a,o){if(t.tag!==5)throw Error(s(476));var u=sg(t).queue;ag(t,u,n,ue,a===null?xS:function(){return rg(t),a(o)})}function sg(t){var n=t.memoizedState;if(n!==null)return n;n={memoizedState:ue,baseState:ue,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:da,lastRenderedState:ue},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:da,lastRenderedState:a},next:null},t.memoizedState=n,t=t.alternate,t!==null&&(t.memoizedState=n),n}function rg(t){var n=sg(t);n.next===null&&(n=t.alternate.memoizedState),Mo(t,n.next.queue,{},hi())}function Ef(){return Dn(zo)}function og(){return un().memoizedState}function lg(){return un().memoizedState}function SS(t){for(var n=t.return;n!==null;){switch(n.tag){case 24:case 3:var a=hi();t=Xa(a);var o=Wa(n,t,a);o!==null&&($n(o,n,a),_o(o,n,a)),n={cache:Ju()},t.payload=n;return}n=n.return}}function yS(t,n,a){var o=hi();a={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Gl(t)?ug(n,a):(a=Gu(t,n,a,o),a!==null&&($n(a,t,o),fg(a,n,o)))}function cg(t,n,a){var o=hi();Mo(t,n,a,o)}function Mo(t,n,a,o){var u={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(Gl(t))ug(n,u);else{var p=t.alternate;if(t.lanes===0&&(p===null||p.lanes===0)&&(p=n.lastRenderedReducer,p!==null))try{var S=n.lastRenderedState,C=p(S,a);if(u.hasEagerState=!0,u.eagerState=C,oi(C,S))return yl(t,n,u,0),Zt===null&&Sl(),!1}catch{}if(a=Gu(t,n,u,o),a!==null)return $n(a,t,o),fg(a,n,o),!0}return!1}function Tf(t,n,a,o){if(o={lane:2,revertLane:id(),gesture:null,action:o,hasEagerState:!1,eagerState:null,next:null},Gl(t)){if(n)throw Error(s(479))}else n=Gu(t,a,o,2),n!==null&&$n(n,t,2)}function Gl(t){var n=t.alternate;return t===ut||n!==null&&n===ut}function ug(t,n){cr=Ol=!0;var a=t.pending;a===null?n.next=n:(n.next=a.next,a.next=n),t.pending=n}function fg(t,n,a){if((a&4194048)!==0){var o=n.lanes;o&=t.pendingLanes,a|=o,n.lanes=a,Yn(t,a)}}var bo={readContext:Dn,use:Fl,useCallback:on,useContext:on,useEffect:on,useImperativeHandle:on,useLayoutEffect:on,useInsertionEffect:on,useMemo:on,useReducer:on,useRef:on,useState:on,useDebugValue:on,useDeferredValue:on,useTransition:on,useSyncExternalStore:on,useId:on,useHostTransitionStatus:on,useFormState:on,useActionState:on,useOptimistic:on,useMemoCache:on,useCacheRefresh:on};bo.useEffectEvent=on;var dg={readContext:Dn,use:Fl,useCallback:function(t,n){return Gn().memoizedState=[t,n===void 0?null:n],t},useContext:Dn,useEffect:jm,useImperativeHandle:function(t,n,a){a=a!=null?a.concat([t]):null,zl(4194308,4,$m.bind(null,n,t),a)},useLayoutEffect:function(t,n){return zl(4194308,4,t,n)},useInsertionEffect:function(t,n){zl(4,2,t,n)},useMemo:function(t,n){var a=Gn();n=n===void 0?null:n;var o=t();if(Us){Re(!0);try{t()}finally{Re(!1)}}return a.memoizedState=[o,n],o},useReducer:function(t,n,a){var o=Gn();if(a!==void 0){var u=a(n);if(Us){Re(!0);try{a(n)}finally{Re(!1)}}}else u=n;return o.memoizedState=o.baseState=u,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:u},o.queue=t,t=t.dispatch=yS.bind(null,ut,t),[o.memoizedState,t]},useRef:function(t){var n=Gn();return t={current:t},n.memoizedState=t},useState:function(t){t=vf(t);var n=t.queue,a=cg.bind(null,ut,n);return n.dispatch=a,[t.memoizedState,a]},useDebugValue:yf,useDeferredValue:function(t,n){var a=Gn();return Mf(a,t,n)},useTransition:function(){var t=vf(!1);return t=ag.bind(null,ut,t.queue,!0,!1),Gn().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,n,a){var o=ut,u=Gn();if(Et){if(a===void 0)throw Error(s(407));a=a()}else{if(a=n(),Zt===null)throw Error(s(349));(Mt&127)!==0||Lm(o,n,a)}u.memoizedState=a;var p={value:a,getSnapshot:n};return u.queue=p,jm(Pm.bind(null,o,p,t),[t]),o.flags|=2048,fr(9,{destroy:void 0},Om.bind(null,o,p,a,n),null),a},useId:function(){var t=Gn(),n=Zt.identifierPrefix;if(Et){var a=Xi,o=ki;a=(o&~(1<<32-Ge(o)-1)).toString(32)+a,n="_"+n+"R_"+a,a=Pl++,0<a&&(n+="H"+a.toString(32)),n+="_"}else a=pS++,n="_"+n+"r_"+a.toString(32)+"_";return t.memoizedState=n},useHostTransitionStatus:Ef,useFormState:Xm,useActionState:Xm,useOptimistic:function(t){var n=Gn();n.memoizedState=n.baseState=t;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=Tf.bind(null,ut,!0,a),a.dispatch=n,[t,n]},useMemoCache:mf,useCacheRefresh:function(){return Gn().memoizedState=SS.bind(null,ut)},useEffectEvent:function(t){var n=Gn(),a={impl:t};return n.memoizedState=a,function(){if((Lt&2)!==0)throw Error(s(440));return a.impl.apply(void 0,arguments)}}},Af={readContext:Dn,use:Fl,useCallback:tg,useContext:Dn,useEffect:Sf,useImperativeHandle:eg,useInsertionEffect:Qm,useLayoutEffect:Jm,useMemo:ng,useReducer:Bl,useRef:Zm,useState:function(){return Bl(da)},useDebugValue:yf,useDeferredValue:function(t,n){var a=un();return ig(a,Vt.memoizedState,t,n)},useTransition:function(){var t=Bl(da)[0],n=un().memoizedState;return[typeof t=="boolean"?t:yo(t),n]},useSyncExternalStore:Um,useId:og,useHostTransitionStatus:Ef,useFormState:Wm,useActionState:Wm,useOptimistic:function(t,n){var a=un();return Bm(a,Vt,t,n)},useMemoCache:mf,useCacheRefresh:lg};Af.useEffectEvent=Km;var hg={readContext:Dn,use:Fl,useCallback:tg,useContext:Dn,useEffect:Sf,useImperativeHandle:eg,useInsertionEffect:Qm,useLayoutEffect:Jm,useMemo:ng,useReducer:_f,useRef:Zm,useState:function(){return _f(da)},useDebugValue:yf,useDeferredValue:function(t,n){var a=un();return Vt===null?Mf(a,t,n):ig(a,Vt.memoizedState,t,n)},useTransition:function(){var t=_f(da)[0],n=un().memoizedState;return[typeof t=="boolean"?t:yo(t),n]},useSyncExternalStore:Um,useId:og,useHostTransitionStatus:Ef,useFormState:qm,useActionState:qm,useOptimistic:function(t,n){var a=un();return Vt!==null?Bm(a,Vt,t,n):(a.baseState=t,[t,a.queue.dispatch])},useMemoCache:mf,useCacheRefresh:lg};hg.useEffectEvent=Km;function Rf(t,n,a,o){n=t.memoizedState,a=a(o,n),a=a==null?n:_({},n,a),t.memoizedState=a,t.lanes===0&&(t.updateQueue.baseState=a)}var Cf={enqueueSetState:function(t,n,a){t=t._reactInternals;var o=hi(),u=Xa(o);u.payload=n,a!=null&&(u.callback=a),n=Wa(t,u,o),n!==null&&($n(n,t,o),_o(n,t,o))},enqueueReplaceState:function(t,n,a){t=t._reactInternals;var o=hi(),u=Xa(o);u.tag=1,u.payload=n,a!=null&&(u.callback=a),n=Wa(t,u,o),n!==null&&($n(n,t,o),_o(n,t,o))},enqueueForceUpdate:function(t,n){t=t._reactInternals;var a=hi(),o=Xa(a);o.tag=2,n!=null&&(o.callback=n),n=Wa(t,o,a),n!==null&&($n(n,t,a),_o(n,t,a))}};function pg(t,n,a,o,u,p,S){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(o,p,S):n.prototype&&n.prototype.isPureReactComponent?!lo(a,o)||!lo(u,p):!0}function mg(t,n,a,o){t=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,o),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,o),n.state!==t&&Cf.enqueueReplaceState(n,n.state,null)}function Ls(t,n){var a=n;if("ref"in n){a={};for(var o in n)o!=="ref"&&(a[o]=n[o])}if(t=t.defaultProps){a===n&&(a=_({},a));for(var u in t)a[u]===void 0&&(a[u]=t[u])}return a}function gg(t){xl(t)}function _g(t){console.error(t)}function vg(t){xl(t)}function Vl(t,n){try{var a=t.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(o){setTimeout(function(){throw o})}}function xg(t,n,a){try{var o=t.onCaughtError;o(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(u){setTimeout(function(){throw u})}}function wf(t,n,a){return a=Xa(a),a.tag=3,a.payload={element:null},a.callback=function(){Vl(t,n)},a}function Sg(t){return t=Xa(t),t.tag=3,t}function yg(t,n,a,o){var u=a.type.getDerivedStateFromError;if(typeof u=="function"){var p=o.value;t.payload=function(){return u(p)},t.callback=function(){xg(n,a,o)}}var S=a.stateNode;S!==null&&typeof S.componentDidCatch=="function"&&(t.callback=function(){xg(n,a,o),typeof u!="function"&&(Qa===null?Qa=new Set([this]):Qa.add(this));var C=o.stack;this.componentDidCatch(o.value,{componentStack:C!==null?C:""})})}function MS(t,n,a,o,u){if(a.flags|=32768,o!==null&&typeof o=="object"&&typeof o.then=="function"){if(n=a.alternate,n!==null&&ir(n,a,u,!0),a=ci.current,a!==null){switch(a.tag){case 31:case 13:return Ei===null?ec():a.alternate===null&&ln===0&&(ln=3),a.flags&=-257,a.flags|=65536,a.lanes=u,o===wl?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([o]):n.add(o),ed(t,o,u)),!1;case 22:return a.flags|=65536,o===wl?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([o])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([o]):a.add(o)),ed(t,o,u)),!1}throw Error(s(435,a.tag))}return ed(t,o,u),ec(),!1}if(Et)return n=ci.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=u,o!==qu&&(t=Error(s(422),{cause:o}),fo(Si(t,a)))):(o!==qu&&(n=Error(s(423),{cause:o}),fo(Si(n,a))),t=t.current.alternate,t.flags|=65536,u&=-u,t.lanes|=u,o=Si(o,a),u=wf(t.stateNode,o,u),sf(t,u),ln!==4&&(ln=2)),!1;var p=Error(s(520),{cause:o});if(p=Si(p,a),No===null?No=[p]:No.push(p),ln!==4&&(ln=2),n===null)return!0;o=Si(o,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,t=u&-u,a.lanes|=t,t=wf(a.stateNode,o,t),sf(a,t),!1;case 1:if(n=a.type,p=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||p!==null&&typeof p.componentDidCatch=="function"&&(Qa===null||!Qa.has(p))))return a.flags|=65536,u&=-u,a.lanes|=u,u=Sg(u),yg(u,t,a,o),sf(a,u),!1}a=a.return}while(a!==null);return!1}var Df=Error(s(461)),gn=!1;function Nn(t,n,a,o){n.child=t===null?Tm(n,null,a,o):Ns(n,t.child,a,o)}function Mg(t,n,a,o,u){a=a.render;var p=n.ref;if("ref"in o){var S={};for(var C in o)C!=="ref"&&(S[C]=o[C])}else S=o;return Rs(n),o=ff(t,n,a,S,p,u),C=df(),t!==null&&!gn?(hf(t,n,u),ha(t,n,u)):(Et&&C&&Wu(n),n.flags|=1,Nn(t,n,o,u),n.child)}function bg(t,n,a,o,u){if(t===null){var p=a.type;return typeof p=="function"&&!Vu(p)&&p.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=p,Eg(t,n,p,o,u)):(t=bl(a.type,null,o,n,n.mode,u),t.ref=n.ref,t.return=n,n.child=t)}if(p=t.child,!Bf(t,u)){var S=p.memoizedProps;if(a=a.compare,a=a!==null?a:lo,a(S,o)&&t.ref===n.ref)return ha(t,n,u)}return n.flags|=1,t=oa(p,o),t.ref=n.ref,t.return=n,n.child=t}function Eg(t,n,a,o,u){if(t!==null){var p=t.memoizedProps;if(lo(p,o)&&t.ref===n.ref)if(gn=!1,n.pendingProps=o=p,Bf(t,u))(t.flags&131072)!==0&&(gn=!0);else return n.lanes=t.lanes,ha(t,n,u)}return Nf(t,n,a,o,u)}function Tg(t,n,a,o){var u=o.children,p=t!==null?t.memoizedState:null;if(t===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),o.mode==="hidden"){if((n.flags&128)!==0){if(p=p!==null?p.baseLanes|a:a,t!==null){for(o=n.child=t.child,u=0;o!==null;)u=u|o.lanes|o.childLanes,o=o.sibling;o=u&~p}else o=0,n.child=null;return Ag(t,n,p,a,o)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},t!==null&&Rl(n,p!==null?p.cachePool:null),p!==null?Cm(n,p):of(),wm(n);else return o=n.lanes=536870912,Ag(t,n,p!==null?p.baseLanes|a:a,a,o)}else p!==null?(Rl(n,p.cachePool),Cm(n,p),qa(),n.memoizedState=null):(t!==null&&Rl(n,null),of(),qa());return Nn(t,n,u,a),n.child}function Eo(t,n){return t!==null&&t.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function Ag(t,n,a,o,u){var p=ef();return p=p===null?null:{parent:pn._currentValue,pool:p},n.memoizedState={baseLanes:a,cachePool:p},t!==null&&Rl(n,null),of(),wm(n),t!==null&&ir(t,n,o,!0),n.childLanes=u,null}function kl(t,n){return n=Wl({mode:n.mode,children:n.children},t.mode),n.ref=t.ref,t.child=n,n.return=t,n}function Rg(t,n,a){return Ns(n,t.child,null,a),t=kl(n,n.pendingProps),t.flags|=2,ui(n),n.memoizedState=null,t}function bS(t,n,a){var o=n.pendingProps,u=(n.flags&128)!==0;if(n.flags&=-129,t===null){if(Et){if(o.mode==="hidden")return t=kl(n,o),n.lanes=536870912,Eo(null,t);if(cf(n),(t=Qt)?(t=z0(t,bi),t=t!==null&&t.data==="&"?t:null,t!==null&&(n.memoizedState={dehydrated:t,treeContext:za!==null?{id:ki,overflow:Xi}:null,retryLane:536870912,hydrationErrors:null},a=um(t),a.return=n,n.child=a,wn=n,Qt=null)):t=null,t===null)throw Ga(n);return n.lanes=536870912,null}return kl(n,o)}var p=t.memoizedState;if(p!==null){var S=p.dehydrated;if(cf(n),u)if(n.flags&256)n.flags&=-257,n=Rg(t,n,a);else if(n.memoizedState!==null)n.child=t.child,n.flags|=128,n=null;else throw Error(s(558));else if(gn||ir(t,n,a,!1),u=(a&t.childLanes)!==0,gn||u){if(o=Zt,o!==null&&(S=si(o,a),S!==0&&S!==p.retryLane))throw p.retryLane=S,bs(t,S),$n(o,t,S),Df;ec(),n=Rg(t,n,a)}else t=p.treeContext,Qt=Ti(S.nextSibling),wn=n,Et=!0,Ha=null,bi=!1,t!==null&&hm(n,t),n=kl(n,o),n.flags|=4096;return n}return t=oa(t.child,{mode:o.mode,children:o.children}),t.ref=n.ref,n.child=t,t.return=n,t}function Xl(t,n){var a=n.ref;if(a===null)t!==null&&t.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(s(284));(t===null||t.ref!==a)&&(n.flags|=4194816)}}function Nf(t,n,a,o,u){return Rs(n),a=ff(t,n,a,o,void 0,u),o=df(),t!==null&&!gn?(hf(t,n,u),ha(t,n,u)):(Et&&o&&Wu(n),n.flags|=1,Nn(t,n,a,u),n.child)}function Cg(t,n,a,o,u,p){return Rs(n),n.updateQueue=null,a=Nm(n,o,a,u),Dm(t),o=df(),t!==null&&!gn?(hf(t,n,p),ha(t,n,p)):(Et&&o&&Wu(n),n.flags|=1,Nn(t,n,a,p),n.child)}function wg(t,n,a,o,u){if(Rs(n),n.stateNode===null){var p=$s,S=a.contextType;typeof S=="object"&&S!==null&&(p=Dn(S)),p=new a(o,p),n.memoizedState=p.state!==null&&p.state!==void 0?p.state:null,p.updater=Cf,n.stateNode=p,p._reactInternals=n,p=n.stateNode,p.props=o,p.state=n.memoizedState,p.refs={},nf(n),S=a.contextType,p.context=typeof S=="object"&&S!==null?Dn(S):$s,p.state=n.memoizedState,S=a.getDerivedStateFromProps,typeof S=="function"&&(Rf(n,a,S,o),p.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof p.getSnapshotBeforeUpdate=="function"||typeof p.UNSAFE_componentWillMount!="function"&&typeof p.componentWillMount!="function"||(S=p.state,typeof p.componentWillMount=="function"&&p.componentWillMount(),typeof p.UNSAFE_componentWillMount=="function"&&p.UNSAFE_componentWillMount(),S!==p.state&&Cf.enqueueReplaceState(p,p.state,null),xo(n,o,p,u),vo(),p.state=n.memoizedState),typeof p.componentDidMount=="function"&&(n.flags|=4194308),o=!0}else if(t===null){p=n.stateNode;var C=n.memoizedProps,B=Ls(a,C);p.props=B;var oe=p.context,xe=a.contextType;S=$s,typeof xe=="object"&&xe!==null&&(S=Dn(xe));var Me=a.getDerivedStateFromProps;xe=typeof Me=="function"||typeof p.getSnapshotBeforeUpdate=="function",C=n.pendingProps!==C,xe||typeof p.UNSAFE_componentWillReceiveProps!="function"&&typeof p.componentWillReceiveProps!="function"||(C||oe!==S)&&mg(n,p,o,S),ka=!1;var ce=n.memoizedState;p.state=ce,xo(n,o,p,u),vo(),oe=n.memoizedState,C||ce!==oe||ka?(typeof Me=="function"&&(Rf(n,a,Me,o),oe=n.memoizedState),(B=ka||pg(n,a,B,o,ce,oe,S))?(xe||typeof p.UNSAFE_componentWillMount!="function"&&typeof p.componentWillMount!="function"||(typeof p.componentWillMount=="function"&&p.componentWillMount(),typeof p.UNSAFE_componentWillMount=="function"&&p.UNSAFE_componentWillMount()),typeof p.componentDidMount=="function"&&(n.flags|=4194308)):(typeof p.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=o,n.memoizedState=oe),p.props=o,p.state=oe,p.context=S,o=B):(typeof p.componentDidMount=="function"&&(n.flags|=4194308),o=!1)}else{p=n.stateNode,af(t,n),S=n.memoizedProps,xe=Ls(a,S),p.props=xe,Me=n.pendingProps,ce=p.context,oe=a.contextType,B=$s,typeof oe=="object"&&oe!==null&&(B=Dn(oe)),C=a.getDerivedStateFromProps,(oe=typeof C=="function"||typeof p.getSnapshotBeforeUpdate=="function")||typeof p.UNSAFE_componentWillReceiveProps!="function"&&typeof p.componentWillReceiveProps!="function"||(S!==Me||ce!==B)&&mg(n,p,o,B),ka=!1,ce=n.memoizedState,p.state=ce,xo(n,o,p,u),vo();var de=n.memoizedState;S!==Me||ce!==de||ka||t!==null&&t.dependencies!==null&&Tl(t.dependencies)?(typeof C=="function"&&(Rf(n,a,C,o),de=n.memoizedState),(xe=ka||pg(n,a,xe,o,ce,de,B)||t!==null&&t.dependencies!==null&&Tl(t.dependencies))?(oe||typeof p.UNSAFE_componentWillUpdate!="function"&&typeof p.componentWillUpdate!="function"||(typeof p.componentWillUpdate=="function"&&p.componentWillUpdate(o,de,B),typeof p.UNSAFE_componentWillUpdate=="function"&&p.UNSAFE_componentWillUpdate(o,de,B)),typeof p.componentDidUpdate=="function"&&(n.flags|=4),typeof p.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof p.componentDidUpdate!="function"||S===t.memoizedProps&&ce===t.memoizedState||(n.flags|=4),typeof p.getSnapshotBeforeUpdate!="function"||S===t.memoizedProps&&ce===t.memoizedState||(n.flags|=1024),n.memoizedProps=o,n.memoizedState=de),p.props=o,p.state=de,p.context=B,o=xe):(typeof p.componentDidUpdate!="function"||S===t.memoizedProps&&ce===t.memoizedState||(n.flags|=4),typeof p.getSnapshotBeforeUpdate!="function"||S===t.memoizedProps&&ce===t.memoizedState||(n.flags|=1024),o=!1)}return p=o,Xl(t,n),o=(n.flags&128)!==0,p||o?(p=n.stateNode,a=o&&typeof a.getDerivedStateFromError!="function"?null:p.render(),n.flags|=1,t!==null&&o?(n.child=Ns(n,t.child,null,u),n.child=Ns(n,null,a,u)):Nn(t,n,a,u),n.memoizedState=p.state,t=n.child):t=ha(t,n,u),t}function Dg(t,n,a,o){return Ts(),n.flags|=256,Nn(t,n,a,o),n.child}var Uf={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Lf(t){return{baseLanes:t,cachePool:xm()}}function Of(t,n,a){return t=t!==null?t.childLanes&~a:0,n&&(t|=di),t}function Ng(t,n,a){var o=n.pendingProps,u=!1,p=(n.flags&128)!==0,S;if((S=p)||(S=t!==null&&t.memoizedState===null?!1:(cn.current&2)!==0),S&&(u=!0,n.flags&=-129),S=(n.flags&32)!==0,n.flags&=-33,t===null){if(Et){if(u?Ya(n):qa(),(t=Qt)?(t=z0(t,bi),t=t!==null&&t.data!=="&"?t:null,t!==null&&(n.memoizedState={dehydrated:t,treeContext:za!==null?{id:ki,overflow:Xi}:null,retryLane:536870912,hydrationErrors:null},a=um(t),a.return=n,n.child=a,wn=n,Qt=null)):t=null,t===null)throw Ga(n);return gd(t)?n.lanes=32:n.lanes=536870912,null}var C=o.children;return o=o.fallback,u?(qa(),u=n.mode,C=Wl({mode:"hidden",children:C},u),o=Es(o,u,a,null),C.return=n,o.return=n,C.sibling=o,n.child=C,o=n.child,o.memoizedState=Lf(a),o.childLanes=Of(t,S,a),n.memoizedState=Uf,Eo(null,o)):(Ya(n),Pf(n,C))}var B=t.memoizedState;if(B!==null&&(C=B.dehydrated,C!==null)){if(p)n.flags&256?(Ya(n),n.flags&=-257,n=If(t,n,a)):n.memoizedState!==null?(qa(),n.child=t.child,n.flags|=128,n=null):(qa(),C=o.fallback,u=n.mode,o=Wl({mode:"visible",children:o.children},u),C=Es(C,u,a,null),C.flags|=2,o.return=n,C.return=n,o.sibling=C,n.child=o,Ns(n,t.child,null,a),o=n.child,o.memoizedState=Lf(a),o.childLanes=Of(t,S,a),n.memoizedState=Uf,n=Eo(null,o));else if(Ya(n),gd(C)){if(S=C.nextSibling&&C.nextSibling.dataset,S)var oe=S.dgst;S=oe,o=Error(s(419)),o.stack="",o.digest=S,fo({value:o,source:null,stack:null}),n=If(t,n,a)}else if(gn||ir(t,n,a,!1),S=(a&t.childLanes)!==0,gn||S){if(S=Zt,S!==null&&(o=si(S,a),o!==0&&o!==B.retryLane))throw B.retryLane=o,bs(t,o),$n(S,t,o),Df;md(C)||ec(),n=If(t,n,a)}else md(C)?(n.flags|=192,n.child=t.child,n=null):(t=B.treeContext,Qt=Ti(C.nextSibling),wn=n,Et=!0,Ha=null,bi=!1,t!==null&&hm(n,t),n=Pf(n,o.children),n.flags|=4096);return n}return u?(qa(),C=o.fallback,u=n.mode,B=t.child,oe=B.sibling,o=oa(B,{mode:"hidden",children:o.children}),o.subtreeFlags=B.subtreeFlags&65011712,oe!==null?C=oa(oe,C):(C=Es(C,u,a,null),C.flags|=2),C.return=n,o.return=n,o.sibling=C,n.child=o,Eo(null,o),o=n.child,C=t.child.memoizedState,C===null?C=Lf(a):(u=C.cachePool,u!==null?(B=pn._currentValue,u=u.parent!==B?{parent:B,pool:B}:u):u=xm(),C={baseLanes:C.baseLanes|a,cachePool:u}),o.memoizedState=C,o.childLanes=Of(t,S,a),n.memoizedState=Uf,Eo(t.child,o)):(Ya(n),a=t.child,t=a.sibling,a=oa(a,{mode:"visible",children:o.children}),a.return=n,a.sibling=null,t!==null&&(S=n.deletions,S===null?(n.deletions=[t],n.flags|=16):S.push(t)),n.child=a,n.memoizedState=null,a)}function Pf(t,n){return n=Wl({mode:"visible",children:n},t.mode),n.return=t,t.child=n}function Wl(t,n){return t=li(22,t,null,n),t.lanes=0,t}function If(t,n,a){return Ns(n,t.child,null,a),t=Pf(n,n.pendingProps.children),t.flags|=2,n.memoizedState=null,t}function Ug(t,n,a){t.lanes|=n;var o=t.alternate;o!==null&&(o.lanes|=n),Ku(t.return,n,a)}function Ff(t,n,a,o,u,p){var S=t.memoizedState;S===null?t.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:o,tail:a,tailMode:u,treeForkCount:p}:(S.isBackwards=n,S.rendering=null,S.renderingStartTime=0,S.last=o,S.tail=a,S.tailMode=u,S.treeForkCount=p)}function Lg(t,n,a){var o=n.pendingProps,u=o.revealOrder,p=o.tail;o=o.children;var S=cn.current,C=(S&2)!==0;if(C?(S=S&1|2,n.flags|=128):S&=1,_e(cn,S),Nn(t,n,o,a),o=Et?uo:0,!C&&t!==null&&(t.flags&128)!==0)e:for(t=n.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Ug(t,a,n);else if(t.tag===19)Ug(t,a,n);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===n)break e;for(;t.sibling===null;){if(t.return===null||t.return===n)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}switch(u){case"forwards":for(a=n.child,u=null;a!==null;)t=a.alternate,t!==null&&Ll(t)===null&&(u=a),a=a.sibling;a=u,a===null?(u=n.child,n.child=null):(u=a.sibling,a.sibling=null),Ff(n,!1,u,a,p,o);break;case"backwards":case"unstable_legacy-backwards":for(a=null,u=n.child,n.child=null;u!==null;){if(t=u.alternate,t!==null&&Ll(t)===null){n.child=u;break}t=u.sibling,u.sibling=a,a=u,u=t}Ff(n,!0,a,null,p,o);break;case"together":Ff(n,!1,null,null,void 0,o);break;default:n.memoizedState=null}return n.child}function ha(t,n,a){if(t!==null&&(n.dependencies=t.dependencies),Ka|=n.lanes,(a&n.childLanes)===0)if(t!==null){if(ir(t,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(t!==null&&n.child!==t.child)throw Error(s(153));if(n.child!==null){for(t=n.child,a=oa(t,t.pendingProps),n.child=a,a.return=n;t.sibling!==null;)t=t.sibling,a=a.sibling=oa(t,t.pendingProps),a.return=n;a.sibling=null}return n.child}function Bf(t,n){return(t.lanes&n)!==0?!0:(t=t.dependencies,!!(t!==null&&Tl(t)))}function ES(t,n,a){switch(n.tag){case 3:ve(n,n.stateNode.containerInfo),Va(n,pn,t.memoizedState.cache),Ts();break;case 27:case 5:tt(n);break;case 4:ve(n,n.stateNode.containerInfo);break;case 10:Va(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,cf(n),null;break;case 13:var o=n.memoizedState;if(o!==null)return o.dehydrated!==null?(Ya(n),n.flags|=128,null):(a&n.child.childLanes)!==0?Ng(t,n,a):(Ya(n),t=ha(t,n,a),t!==null?t.sibling:null);Ya(n);break;case 19:var u=(t.flags&128)!==0;if(o=(a&n.childLanes)!==0,o||(ir(t,n,a,!1),o=(a&n.childLanes)!==0),u){if(o)return Lg(t,n,a);n.flags|=128}if(u=n.memoizedState,u!==null&&(u.rendering=null,u.tail=null,u.lastEffect=null),_e(cn,cn.current),o)break;return null;case 22:return n.lanes=0,Tg(t,n,a,n.pendingProps);case 24:Va(n,pn,t.memoizedState.cache)}return ha(t,n,a)}function Og(t,n,a){if(t!==null)if(t.memoizedProps!==n.pendingProps)gn=!0;else{if(!Bf(t,a)&&(n.flags&128)===0)return gn=!1,ES(t,n,a);gn=(t.flags&131072)!==0}else gn=!1,Et&&(n.flags&1048576)!==0&&dm(n,uo,n.index);switch(n.lanes=0,n.tag){case 16:e:{var o=n.pendingProps;if(t=ws(n.elementType),n.type=t,typeof t=="function")Vu(t)?(o=Ls(t,o),n.tag=1,n=wg(null,n,t,o,a)):(n.tag=0,n=Nf(null,n,t,o,a));else{if(t!=null){var u=t.$$typeof;if(u===R){n.tag=11,n=Mg(null,n,t,o,a);break e}else if(u===P){n.tag=14,n=bg(null,n,t,o,a);break e}}throw n=X(t)||t,Error(s(306,n,""))}}return n;case 0:return Nf(t,n,n.type,n.pendingProps,a);case 1:return o=n.type,u=Ls(o,n.pendingProps),wg(t,n,o,u,a);case 3:e:{if(ve(n,n.stateNode.containerInfo),t===null)throw Error(s(387));o=n.pendingProps;var p=n.memoizedState;u=p.element,af(t,n),xo(n,o,null,a);var S=n.memoizedState;if(o=S.cache,Va(n,pn,o),o!==p.cache&&Qu(n,[pn],a,!0),vo(),o=S.element,p.isDehydrated)if(p={element:o,isDehydrated:!1,cache:S.cache},n.updateQueue.baseState=p,n.memoizedState=p,n.flags&256){n=Dg(t,n,o,a);break e}else if(o!==u){u=Si(Error(s(424)),n),fo(u),n=Dg(t,n,o,a);break e}else for(t=n.stateNode.containerInfo,t.nodeType===9?t=t.body:t=t.nodeName==="HTML"?t.ownerDocument.body:t,Qt=Ti(t.firstChild),wn=n,Et=!0,Ha=null,bi=!0,a=Tm(n,null,o,a),n.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(Ts(),o===u){n=ha(t,n,a);break e}Nn(t,n,o,a)}n=n.child}return n;case 26:return Xl(t,n),t===null?(a=W0(n.type,null,n.pendingProps,null))?n.memoizedState=a:Et||(a=n.type,t=n.pendingProps,o=oc(Xe.current).createElement(a),o[fn]=n,o[Cn]=t,Un(o,a,t),dn(o),n.stateNode=o):n.memoizedState=W0(n.type,t.memoizedProps,n.pendingProps,t.memoizedState),null;case 27:return tt(n),t===null&&Et&&(o=n.stateNode=V0(n.type,n.pendingProps,Xe.current),wn=n,bi=!0,u=Qt,ts(n.type)?(_d=u,Qt=Ti(o.firstChild)):Qt=u),Nn(t,n,n.pendingProps.children,a),Xl(t,n),t===null&&(n.flags|=4194304),n.child;case 5:return t===null&&Et&&((u=o=Qt)&&(o=ey(o,n.type,n.pendingProps,bi),o!==null?(n.stateNode=o,wn=n,Qt=Ti(o.firstChild),bi=!1,u=!0):u=!1),u||Ga(n)),tt(n),u=n.type,p=n.pendingProps,S=t!==null?t.memoizedProps:null,o=p.children,dd(u,p)?o=null:S!==null&&dd(u,S)&&(n.flags|=32),n.memoizedState!==null&&(u=ff(t,n,mS,null,null,a),zo._currentValue=u),Xl(t,n),Nn(t,n,o,a),n.child;case 6:return t===null&&Et&&((t=a=Qt)&&(a=ty(a,n.pendingProps,bi),a!==null?(n.stateNode=a,wn=n,Qt=null,t=!0):t=!1),t||Ga(n)),null;case 13:return Ng(t,n,a);case 4:return ve(n,n.stateNode.containerInfo),o=n.pendingProps,t===null?n.child=Ns(n,null,o,a):Nn(t,n,o,a),n.child;case 11:return Mg(t,n,n.type,n.pendingProps,a);case 7:return Nn(t,n,n.pendingProps,a),n.child;case 8:return Nn(t,n,n.pendingProps.children,a),n.child;case 12:return Nn(t,n,n.pendingProps.children,a),n.child;case 10:return o=n.pendingProps,Va(n,n.type,o.value),Nn(t,n,o.children,a),n.child;case 9:return u=n.type._context,o=n.pendingProps.children,Rs(n),u=Dn(u),o=o(u),n.flags|=1,Nn(t,n,o,a),n.child;case 14:return bg(t,n,n.type,n.pendingProps,a);case 15:return Eg(t,n,n.type,n.pendingProps,a);case 19:return Lg(t,n,a);case 31:return bS(t,n,a);case 22:return Tg(t,n,a,n.pendingProps);case 24:return Rs(n),o=Dn(pn),t===null?(u=ef(),u===null&&(u=Zt,p=Ju(),u.pooledCache=p,p.refCount++,p!==null&&(u.pooledCacheLanes|=a),u=p),n.memoizedState={parent:o,cache:u},nf(n),Va(n,pn,u)):((t.lanes&a)!==0&&(af(t,n),xo(n,null,null,a),vo()),u=t.memoizedState,p=n.memoizedState,u.parent!==o?(u={parent:o,cache:o},n.memoizedState=u,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=u),Va(n,pn,o)):(o=p.cache,Va(n,pn,o),o!==u.cache&&Qu(n,[pn],a,!0))),Nn(t,n,n.pendingProps.children,a),n.child;case 29:throw n.pendingProps}throw Error(s(156,n.tag))}function pa(t){t.flags|=4}function zf(t,n,a,o,u){if((n=(t.mode&32)!==0)&&(n=!1),n){if(t.flags|=16777216,(u&335544128)===u)if(t.stateNode.complete)t.flags|=8192;else if(o0())t.flags|=8192;else throw Ds=wl,tf}else t.flags&=-16777217}function Pg(t,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!K0(n))if(o0())t.flags|=8192;else throw Ds=wl,tf}function Yl(t,n){n!==null&&(t.flags|=4),t.flags&16384&&(n=t.tag!==22?be():536870912,t.lanes|=n,mr|=n)}function To(t,n){if(!Et)switch(t.tailMode){case"hidden":n=t.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?t.tail=null:a.sibling=null;break;case"collapsed":a=t.tail;for(var o=null;a!==null;)a.alternate!==null&&(o=a),a=a.sibling;o===null?n||t.tail===null?t.tail=null:t.tail.sibling=null:o.sibling=null}}function Jt(t){var n=t.alternate!==null&&t.alternate.child===t.child,a=0,o=0;if(n)for(var u=t.child;u!==null;)a|=u.lanes|u.childLanes,o|=u.subtreeFlags&65011712,o|=u.flags&65011712,u.return=t,u=u.sibling;else for(u=t.child;u!==null;)a|=u.lanes|u.childLanes,o|=u.subtreeFlags,o|=u.flags,u.return=t,u=u.sibling;return t.subtreeFlags|=o,t.childLanes=a,n}function TS(t,n,a){var o=n.pendingProps;switch(Yu(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Jt(n),null;case 1:return Jt(n),null;case 3:return a=n.stateNode,o=null,t!==null&&(o=t.memoizedState.cache),n.memoizedState.cache!==o&&(n.flags|=2048),ua(pn),Ae(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(t===null||t.child===null)&&(nr(n)?pa(n):t===null||t.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,Zu())),Jt(n),null;case 26:var u=n.type,p=n.memoizedState;return t===null?(pa(n),p!==null?(Jt(n),Pg(n,p)):(Jt(n),zf(n,u,null,o,a))):p?p!==t.memoizedState?(pa(n),Jt(n),Pg(n,p)):(Jt(n),n.flags&=-16777217):(t=t.memoizedProps,t!==o&&pa(n),Jt(n),zf(n,u,t,o,a)),null;case 27:if(He(n),a=Xe.current,u=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==o&&pa(n);else{if(!o){if(n.stateNode===null)throw Error(s(166));return Jt(n),null}t=Ee.current,nr(n)?pm(n):(t=V0(u,o,a),n.stateNode=t,pa(n))}return Jt(n),null;case 5:if(He(n),u=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==o&&pa(n);else{if(!o){if(n.stateNode===null)throw Error(s(166));return Jt(n),null}if(p=Ee.current,nr(n))pm(n);else{var S=oc(Xe.current);switch(p){case 1:p=S.createElementNS("http://www.w3.org/2000/svg",u);break;case 2:p=S.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;default:switch(u){case"svg":p=S.createElementNS("http://www.w3.org/2000/svg",u);break;case"math":p=S.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;case"script":p=S.createElement("div"),p.innerHTML="<script><\/script>",p=p.removeChild(p.firstChild);break;case"select":p=typeof o.is=="string"?S.createElement("select",{is:o.is}):S.createElement("select"),o.multiple?p.multiple=!0:o.size&&(p.size=o.size);break;default:p=typeof o.is=="string"?S.createElement(u,{is:o.is}):S.createElement(u)}}p[fn]=n,p[Cn]=o;e:for(S=n.child;S!==null;){if(S.tag===5||S.tag===6)p.appendChild(S.stateNode);else if(S.tag!==4&&S.tag!==27&&S.child!==null){S.child.return=S,S=S.child;continue}if(S===n)break e;for(;S.sibling===null;){if(S.return===null||S.return===n)break e;S=S.return}S.sibling.return=S.return,S=S.sibling}n.stateNode=p;e:switch(Un(p,u,o),u){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}o&&pa(n)}}return Jt(n),zf(n,n.type,t===null?null:t.memoizedProps,n.pendingProps,a),null;case 6:if(t&&n.stateNode!=null)t.memoizedProps!==o&&pa(n);else{if(typeof o!="string"&&n.stateNode===null)throw Error(s(166));if(t=Xe.current,nr(n)){if(t=n.stateNode,a=n.memoizedProps,o=null,u=wn,u!==null)switch(u.tag){case 27:case 5:o=u.memoizedProps}t[fn]=n,t=!!(t.nodeValue===a||o!==null&&o.suppressHydrationWarning===!0||N0(t.nodeValue,a)),t||Ga(n,!0)}else t=oc(t).createTextNode(o),t[fn]=n,n.stateNode=t}return Jt(n),null;case 31:if(a=n.memoizedState,t===null||t.memoizedState!==null){if(o=nr(n),a!==null){if(t===null){if(!o)throw Error(s(318));if(t=n.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(s(557));t[fn]=n}else Ts(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Jt(n),t=!1}else a=Zu(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=a),t=!0;if(!t)return n.flags&256?(ui(n),n):(ui(n),null);if((n.flags&128)!==0)throw Error(s(558))}return Jt(n),null;case 13:if(o=n.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(u=nr(n),o!==null&&o.dehydrated!==null){if(t===null){if(!u)throw Error(s(318));if(u=n.memoizedState,u=u!==null?u.dehydrated:null,!u)throw Error(s(317));u[fn]=n}else Ts(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Jt(n),u=!1}else u=Zu(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=u),u=!0;if(!u)return n.flags&256?(ui(n),n):(ui(n),null)}return ui(n),(n.flags&128)!==0?(n.lanes=a,n):(a=o!==null,t=t!==null&&t.memoizedState!==null,a&&(o=n.child,u=null,o.alternate!==null&&o.alternate.memoizedState!==null&&o.alternate.memoizedState.cachePool!==null&&(u=o.alternate.memoizedState.cachePool.pool),p=null,o.memoizedState!==null&&o.memoizedState.cachePool!==null&&(p=o.memoizedState.cachePool.pool),p!==u&&(o.flags|=2048)),a!==t&&a&&(n.child.flags|=8192),Yl(n,n.updateQueue),Jt(n),null);case 4:return Ae(),t===null&&od(n.stateNode.containerInfo),Jt(n),null;case 10:return ua(n.type),Jt(n),null;case 19:if(ne(cn),o=n.memoizedState,o===null)return Jt(n),null;if(u=(n.flags&128)!==0,p=o.rendering,p===null)if(u)To(o,!1);else{if(ln!==0||t!==null&&(t.flags&128)!==0)for(t=n.child;t!==null;){if(p=Ll(t),p!==null){for(n.flags|=128,To(o,!1),t=p.updateQueue,n.updateQueue=t,Yl(n,t),n.subtreeFlags=0,t=a,a=n.child;a!==null;)cm(a,t),a=a.sibling;return _e(cn,cn.current&1|2),Et&&la(n,o.treeForkCount),n.child}t=t.sibling}o.tail!==null&&Pt()>Ql&&(n.flags|=128,u=!0,To(o,!1),n.lanes=4194304)}else{if(!u)if(t=Ll(p),t!==null){if(n.flags|=128,u=!0,t=t.updateQueue,n.updateQueue=t,Yl(n,t),To(o,!0),o.tail===null&&o.tailMode==="hidden"&&!p.alternate&&!Et)return Jt(n),null}else 2*Pt()-o.renderingStartTime>Ql&&a!==536870912&&(n.flags|=128,u=!0,To(o,!1),n.lanes=4194304);o.isBackwards?(p.sibling=n.child,n.child=p):(t=o.last,t!==null?t.sibling=p:n.child=p,o.last=p)}return o.tail!==null?(t=o.tail,o.rendering=t,o.tail=t.sibling,o.renderingStartTime=Pt(),t.sibling=null,a=cn.current,_e(cn,u?a&1|2:a&1),Et&&la(n,o.treeForkCount),t):(Jt(n),null);case 22:case 23:return ui(n),lf(),o=n.memoizedState!==null,t!==null?t.memoizedState!==null!==o&&(n.flags|=8192):o&&(n.flags|=8192),o?(a&536870912)!==0&&(n.flags&128)===0&&(Jt(n),n.subtreeFlags&6&&(n.flags|=8192)):Jt(n),a=n.updateQueue,a!==null&&Yl(n,a.retryQueue),a=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),o=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(o=n.memoizedState.cachePool.pool),o!==a&&(n.flags|=2048),t!==null&&ne(Cs),null;case 24:return a=null,t!==null&&(a=t.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),ua(pn),Jt(n),null;case 25:return null;case 30:return null}throw Error(s(156,n.tag))}function AS(t,n){switch(Yu(n),n.tag){case 1:return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 3:return ua(pn),Ae(),t=n.flags,(t&65536)!==0&&(t&128)===0?(n.flags=t&-65537|128,n):null;case 26:case 27:case 5:return He(n),null;case 31:if(n.memoizedState!==null){if(ui(n),n.alternate===null)throw Error(s(340));Ts()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 13:if(ui(n),t=n.memoizedState,t!==null&&t.dehydrated!==null){if(n.alternate===null)throw Error(s(340));Ts()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 19:return ne(cn),null;case 4:return Ae(),null;case 10:return ua(n.type),null;case 22:case 23:return ui(n),lf(),t!==null&&ne(Cs),t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 24:return ua(pn),null;case 25:return null;default:return null}}function Ig(t,n){switch(Yu(n),n.tag){case 3:ua(pn),Ae();break;case 26:case 27:case 5:He(n);break;case 4:Ae();break;case 31:n.memoizedState!==null&&ui(n);break;case 13:ui(n);break;case 19:ne(cn);break;case 10:ua(n.type);break;case 22:case 23:ui(n),lf(),t!==null&&ne(Cs);break;case 24:ua(pn)}}function Ao(t,n){try{var a=n.updateQueue,o=a!==null?a.lastEffect:null;if(o!==null){var u=o.next;a=u;do{if((a.tag&t)===t){o=void 0;var p=a.create,S=a.inst;o=p(),S.destroy=o}a=a.next}while(a!==u)}}catch(C){Ft(n,n.return,C)}}function Za(t,n,a){try{var o=n.updateQueue,u=o!==null?o.lastEffect:null;if(u!==null){var p=u.next;o=p;do{if((o.tag&t)===t){var S=o.inst,C=S.destroy;if(C!==void 0){S.destroy=void 0,u=n;var B=a,oe=C;try{oe()}catch(xe){Ft(u,B,xe)}}}o=o.next}while(o!==p)}}catch(xe){Ft(n,n.return,xe)}}function Fg(t){var n=t.updateQueue;if(n!==null){var a=t.stateNode;try{Rm(n,a)}catch(o){Ft(t,t.return,o)}}}function Bg(t,n,a){a.props=Ls(t.type,t.memoizedProps),a.state=t.memoizedState;try{a.componentWillUnmount()}catch(o){Ft(t,n,o)}}function Ro(t,n){try{var a=t.ref;if(a!==null){switch(t.tag){case 26:case 27:case 5:var o=t.stateNode;break;case 30:o=t.stateNode;break;default:o=t.stateNode}typeof a=="function"?t.refCleanup=a(o):a.current=o}}catch(u){Ft(t,n,u)}}function Wi(t,n){var a=t.ref,o=t.refCleanup;if(a!==null)if(typeof o=="function")try{o()}catch(u){Ft(t,n,u)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(u){Ft(t,n,u)}else a.current=null}function zg(t){var n=t.type,a=t.memoizedProps,o=t.stateNode;try{e:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&o.focus();break e;case"img":a.src?o.src=a.src:a.srcSet&&(o.srcset=a.srcSet)}}catch(u){Ft(t,t.return,u)}}function Hf(t,n,a){try{var o=t.stateNode;ZS(o,t.type,a,n),o[Cn]=n}catch(u){Ft(t,t.return,u)}}function Hg(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&ts(t.type)||t.tag===4}function Gf(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||Hg(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&ts(t.type)||t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Vf(t,n,a){var o=t.tag;if(o===5||o===6)t=t.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(t,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(t),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=vi));else if(o!==4&&(o===27&&ts(t.type)&&(a=t.stateNode,n=null),t=t.child,t!==null))for(Vf(t,n,a),t=t.sibling;t!==null;)Vf(t,n,a),t=t.sibling}function ql(t,n,a){var o=t.tag;if(o===5||o===6)t=t.stateNode,n?a.insertBefore(t,n):a.appendChild(t);else if(o!==4&&(o===27&&ts(t.type)&&(a=t.stateNode),t=t.child,t!==null))for(ql(t,n,a),t=t.sibling;t!==null;)ql(t,n,a),t=t.sibling}function Gg(t){var n=t.stateNode,a=t.memoizedProps;try{for(var o=t.type,u=n.attributes;u.length;)n.removeAttributeNode(u[0]);Un(n,o,a),n[fn]=t,n[Cn]=a}catch(p){Ft(t,t.return,p)}}var ma=!1,_n=!1,kf=!1,Vg=typeof WeakSet=="function"?WeakSet:Set,An=null;function RS(t,n){if(t=t.containerInfo,ud=pc,t=em(t),Pu(t)){if("selectionStart"in t)var a={start:t.selectionStart,end:t.selectionEnd};else e:{a=(a=t.ownerDocument)&&a.defaultView||window;var o=a.getSelection&&a.getSelection();if(o&&o.rangeCount!==0){a=o.anchorNode;var u=o.anchorOffset,p=o.focusNode;o=o.focusOffset;try{a.nodeType,p.nodeType}catch{a=null;break e}var S=0,C=-1,B=-1,oe=0,xe=0,Me=t,ce=null;t:for(;;){for(var de;Me!==a||u!==0&&Me.nodeType!==3||(C=S+u),Me!==p||o!==0&&Me.nodeType!==3||(B=S+o),Me.nodeType===3&&(S+=Me.nodeValue.length),(de=Me.firstChild)!==null;)ce=Me,Me=de;for(;;){if(Me===t)break t;if(ce===a&&++oe===u&&(C=S),ce===p&&++xe===o&&(B=S),(de=Me.nextSibling)!==null)break;Me=ce,ce=Me.parentNode}Me=de}a=C===-1||B===-1?null:{start:C,end:B}}else a=null}a=a||{start:0,end:0}}else a=null;for(fd={focusedElem:t,selectionRange:a},pc=!1,An=n;An!==null;)if(n=An,t=n.child,(n.subtreeFlags&1028)!==0&&t!==null)t.return=n,An=t;else for(;An!==null;){switch(n=An,p=n.alternate,t=n.flags,n.tag){case 0:if((t&4)!==0&&(t=n.updateQueue,t=t!==null?t.events:null,t!==null))for(a=0;a<t.length;a++)u=t[a],u.ref.impl=u.nextImpl;break;case 11:case 15:break;case 1:if((t&1024)!==0&&p!==null){t=void 0,a=n,u=p.memoizedProps,p=p.memoizedState,o=a.stateNode;try{var qe=Ls(a.type,u);t=o.getSnapshotBeforeUpdate(qe,p),o.__reactInternalSnapshotBeforeUpdate=t}catch(et){Ft(a,a.return,et)}}break;case 3:if((t&1024)!==0){if(t=n.stateNode.containerInfo,a=t.nodeType,a===9)pd(t);else if(a===1)switch(t.nodeName){case"HEAD":case"HTML":case"BODY":pd(t);break;default:t.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((t&1024)!==0)throw Error(s(163))}if(t=n.sibling,t!==null){t.return=n.return,An=t;break}An=n.return}}function kg(t,n,a){var o=a.flags;switch(a.tag){case 0:case 11:case 15:_a(t,a),o&4&&Ao(5,a);break;case 1:if(_a(t,a),o&4)if(t=a.stateNode,n===null)try{t.componentDidMount()}catch(S){Ft(a,a.return,S)}else{var u=Ls(a.type,n.memoizedProps);n=n.memoizedState;try{t.componentDidUpdate(u,n,t.__reactInternalSnapshotBeforeUpdate)}catch(S){Ft(a,a.return,S)}}o&64&&Fg(a),o&512&&Ro(a,a.return);break;case 3:if(_a(t,a),o&64&&(t=a.updateQueue,t!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{Rm(t,n)}catch(S){Ft(a,a.return,S)}}break;case 27:n===null&&o&4&&Gg(a);case 26:case 5:_a(t,a),n===null&&o&4&&zg(a),o&512&&Ro(a,a.return);break;case 12:_a(t,a);break;case 31:_a(t,a),o&4&&Yg(t,a);break;case 13:_a(t,a),o&4&&qg(t,a),o&64&&(t=a.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(a=IS.bind(null,a),ny(t,a))));break;case 22:if(o=a.memoizedState!==null||ma,!o){n=n!==null&&n.memoizedState!==null||_n,u=ma;var p=_n;ma=o,(_n=n)&&!p?va(t,a,(a.subtreeFlags&8772)!==0):_a(t,a),ma=u,_n=p}break;case 30:break;default:_a(t,a)}}function Xg(t){var n=t.alternate;n!==null&&(t.alternate=null,Xg(n)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(n=t.stateNode,n!==null&&Pa(n)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var en=null,jn=!1;function ga(t,n,a){for(a=a.child;a!==null;)Wg(t,n,a),a=a.sibling}function Wg(t,n,a){if(ge&&typeof ge.onCommitFiberUnmount=="function")try{ge.onCommitFiberUnmount(me,a)}catch{}switch(a.tag){case 26:_n||Wi(a,n),ga(t,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:_n||Wi(a,n);var o=en,u=jn;ts(a.type)&&(en=a.stateNode,jn=!1),ga(t,n,a),Io(a.stateNode),en=o,jn=u;break;case 5:_n||Wi(a,n);case 6:if(o=en,u=jn,en=null,ga(t,n,a),en=o,jn=u,en!==null)if(jn)try{(en.nodeType===9?en.body:en.nodeName==="HTML"?en.ownerDocument.body:en).removeChild(a.stateNode)}catch(p){Ft(a,n,p)}else try{en.removeChild(a.stateNode)}catch(p){Ft(a,n,p)}break;case 18:en!==null&&(jn?(t=en,F0(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,a.stateNode),br(t)):F0(en,a.stateNode));break;case 4:o=en,u=jn,en=a.stateNode.containerInfo,jn=!0,ga(t,n,a),en=o,jn=u;break;case 0:case 11:case 14:case 15:Za(2,a,n),_n||Za(4,a,n),ga(t,n,a);break;case 1:_n||(Wi(a,n),o=a.stateNode,typeof o.componentWillUnmount=="function"&&Bg(a,n,o)),ga(t,n,a);break;case 21:ga(t,n,a);break;case 22:_n=(o=_n)||a.memoizedState!==null,ga(t,n,a),_n=o;break;default:ga(t,n,a)}}function Yg(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null))){t=t.dehydrated;try{br(t)}catch(a){Ft(n,n.return,a)}}}function qg(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{br(t)}catch(a){Ft(n,n.return,a)}}function CS(t){switch(t.tag){case 31:case 13:case 19:var n=t.stateNode;return n===null&&(n=t.stateNode=new Vg),n;case 22:return t=t.stateNode,n=t._retryCache,n===null&&(n=t._retryCache=new Vg),n;default:throw Error(s(435,t.tag))}}function Zl(t,n){var a=CS(t);n.forEach(function(o){if(!a.has(o)){a.add(o);var u=FS.bind(null,t,o);o.then(u,u)}})}function Kn(t,n){var a=n.deletions;if(a!==null)for(var o=0;o<a.length;o++){var u=a[o],p=t,S=n,C=S;e:for(;C!==null;){switch(C.tag){case 27:if(ts(C.type)){en=C.stateNode,jn=!1;break e}break;case 5:en=C.stateNode,jn=!1;break e;case 3:case 4:en=C.stateNode.containerInfo,jn=!0;break e}C=C.return}if(en===null)throw Error(s(160));Wg(p,S,u),en=null,jn=!1,p=u.alternate,p!==null&&(p.return=null),u.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)Zg(n,t),n=n.sibling}var Ui=null;function Zg(t,n){var a=t.alternate,o=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:Kn(n,t),Qn(t),o&4&&(Za(3,t,t.return),Ao(3,t),Za(5,t,t.return));break;case 1:Kn(n,t),Qn(t),o&512&&(_n||a===null||Wi(a,a.return)),o&64&&ma&&(t=t.updateQueue,t!==null&&(o=t.callbacks,o!==null&&(a=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=a===null?o:a.concat(o))));break;case 26:var u=Ui;if(Kn(n,t),Qn(t),o&512&&(_n||a===null||Wi(a,a.return)),o&4){var p=a!==null?a.memoizedState:null;if(o=t.memoizedState,a===null)if(o===null)if(t.stateNode===null){e:{o=t.type,a=t.memoizedProps,u=u.ownerDocument||u;t:switch(o){case"title":p=u.getElementsByTagName("title")[0],(!p||p[Oa]||p[fn]||p.namespaceURI==="http://www.w3.org/2000/svg"||p.hasAttribute("itemprop"))&&(p=u.createElement(o),u.head.insertBefore(p,u.querySelector("head > title"))),Un(p,o,a),p[fn]=t,dn(p),o=p;break e;case"link":var S=Z0("link","href",u).get(o+(a.href||""));if(S){for(var C=0;C<S.length;C++)if(p=S[C],p.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&p.getAttribute("rel")===(a.rel==null?null:a.rel)&&p.getAttribute("title")===(a.title==null?null:a.title)&&p.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){S.splice(C,1);break t}}p=u.createElement(o),Un(p,o,a),u.head.appendChild(p);break;case"meta":if(S=Z0("meta","content",u).get(o+(a.content||""))){for(C=0;C<S.length;C++)if(p=S[C],p.getAttribute("content")===(a.content==null?null:""+a.content)&&p.getAttribute("name")===(a.name==null?null:a.name)&&p.getAttribute("property")===(a.property==null?null:a.property)&&p.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&p.getAttribute("charset")===(a.charSet==null?null:a.charSet)){S.splice(C,1);break t}}p=u.createElement(o),Un(p,o,a),u.head.appendChild(p);break;default:throw Error(s(468,o))}p[fn]=t,dn(p),o=p}t.stateNode=o}else j0(u,t.type,t.stateNode);else t.stateNode=q0(u,o,t.memoizedProps);else p!==o?(p===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):p.count--,o===null?j0(u,t.type,t.stateNode):q0(u,o,t.memoizedProps)):o===null&&t.stateNode!==null&&Hf(t,t.memoizedProps,a.memoizedProps)}break;case 27:Kn(n,t),Qn(t),o&512&&(_n||a===null||Wi(a,a.return)),a!==null&&o&4&&Hf(t,t.memoizedProps,a.memoizedProps);break;case 5:if(Kn(n,t),Qn(t),o&512&&(_n||a===null||Wi(a,a.return)),t.flags&32){u=t.stateNode;try{Hn(u,"")}catch(qe){Ft(t,t.return,qe)}}o&4&&t.stateNode!=null&&(u=t.memoizedProps,Hf(t,u,a!==null?a.memoizedProps:u)),o&1024&&(kf=!0);break;case 6:if(Kn(n,t),Qn(t),o&4){if(t.stateNode===null)throw Error(s(162));o=t.memoizedProps,a=t.stateNode;try{a.nodeValue=o}catch(qe){Ft(t,t.return,qe)}}break;case 3:if(uc=null,u=Ui,Ui=lc(n.containerInfo),Kn(n,t),Ui=u,Qn(t),o&4&&a!==null&&a.memoizedState.isDehydrated)try{br(n.containerInfo)}catch(qe){Ft(t,t.return,qe)}kf&&(kf=!1,jg(t));break;case 4:o=Ui,Ui=lc(t.stateNode.containerInfo),Kn(n,t),Qn(t),Ui=o;break;case 12:Kn(n,t),Qn(t);break;case 31:Kn(n,t),Qn(t),o&4&&(o=t.updateQueue,o!==null&&(t.updateQueue=null,Zl(t,o)));break;case 13:Kn(n,t),Qn(t),t.child.flags&8192&&t.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(Kl=Pt()),o&4&&(o=t.updateQueue,o!==null&&(t.updateQueue=null,Zl(t,o)));break;case 22:u=t.memoizedState!==null;var B=a!==null&&a.memoizedState!==null,oe=ma,xe=_n;if(ma=oe||u,_n=xe||B,Kn(n,t),_n=xe,ma=oe,Qn(t),o&8192)e:for(n=t.stateNode,n._visibility=u?n._visibility&-2:n._visibility|1,u&&(a===null||B||ma||_n||Os(t)),a=null,n=t;;){if(n.tag===5||n.tag===26){if(a===null){B=a=n;try{if(p=B.stateNode,u)S=p.style,typeof S.setProperty=="function"?S.setProperty("display","none","important"):S.display="none";else{C=B.stateNode;var Me=B.memoizedProps.style,ce=Me!=null&&Me.hasOwnProperty("display")?Me.display:null;C.style.display=ce==null||typeof ce=="boolean"?"":(""+ce).trim()}}catch(qe){Ft(B,B.return,qe)}}}else if(n.tag===6){if(a===null){B=n;try{B.stateNode.nodeValue=u?"":B.memoizedProps}catch(qe){Ft(B,B.return,qe)}}}else if(n.tag===18){if(a===null){B=n;try{var de=B.stateNode;u?B0(de,!0):B0(B.stateNode,!1)}catch(qe){Ft(B,B.return,qe)}}}else if((n.tag!==22&&n.tag!==23||n.memoizedState===null||n===t)&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break e;for(;n.sibling===null;){if(n.return===null||n.return===t)break e;a===n&&(a=null),n=n.return}a===n&&(a=null),n.sibling.return=n.return,n=n.sibling}o&4&&(o=t.updateQueue,o!==null&&(a=o.retryQueue,a!==null&&(o.retryQueue=null,Zl(t,a))));break;case 19:Kn(n,t),Qn(t),o&4&&(o=t.updateQueue,o!==null&&(t.updateQueue=null,Zl(t,o)));break;case 30:break;case 21:break;default:Kn(n,t),Qn(t)}}function Qn(t){var n=t.flags;if(n&2){try{for(var a,o=t.return;o!==null;){if(Hg(o)){a=o;break}o=o.return}if(a==null)throw Error(s(160));switch(a.tag){case 27:var u=a.stateNode,p=Gf(t);ql(t,p,u);break;case 5:var S=a.stateNode;a.flags&32&&(Hn(S,""),a.flags&=-33);var C=Gf(t);ql(t,C,S);break;case 3:case 4:var B=a.stateNode.containerInfo,oe=Gf(t);Vf(t,oe,B);break;default:throw Error(s(161))}}catch(xe){Ft(t,t.return,xe)}t.flags&=-3}n&4096&&(t.flags&=-4097)}function jg(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var n=t;jg(n),n.tag===5&&n.flags&1024&&n.stateNode.reset(),t=t.sibling}}function _a(t,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)kg(t,n.alternate,n),n=n.sibling}function Os(t){for(t=t.child;t!==null;){var n=t;switch(n.tag){case 0:case 11:case 14:case 15:Za(4,n,n.return),Os(n);break;case 1:Wi(n,n.return);var a=n.stateNode;typeof a.componentWillUnmount=="function"&&Bg(n,n.return,a),Os(n);break;case 27:Io(n.stateNode);case 26:case 5:Wi(n,n.return),Os(n);break;case 22:n.memoizedState===null&&Os(n);break;case 30:Os(n);break;default:Os(n)}t=t.sibling}}function va(t,n,a){for(a=a&&(n.subtreeFlags&8772)!==0,n=n.child;n!==null;){var o=n.alternate,u=t,p=n,S=p.flags;switch(p.tag){case 0:case 11:case 15:va(u,p,a),Ao(4,p);break;case 1:if(va(u,p,a),o=p,u=o.stateNode,typeof u.componentDidMount=="function")try{u.componentDidMount()}catch(oe){Ft(o,o.return,oe)}if(o=p,u=o.updateQueue,u!==null){var C=o.stateNode;try{var B=u.shared.hiddenCallbacks;if(B!==null)for(u.shared.hiddenCallbacks=null,u=0;u<B.length;u++)Am(B[u],C)}catch(oe){Ft(o,o.return,oe)}}a&&S&64&&Fg(p),Ro(p,p.return);break;case 27:Gg(p);case 26:case 5:va(u,p,a),a&&o===null&&S&4&&zg(p),Ro(p,p.return);break;case 12:va(u,p,a);break;case 31:va(u,p,a),a&&S&4&&Yg(u,p);break;case 13:va(u,p,a),a&&S&4&&qg(u,p);break;case 22:p.memoizedState===null&&va(u,p,a),Ro(p,p.return);break;case 30:break;default:va(u,p,a)}n=n.sibling}}function Xf(t,n){var a=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),t=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(t=n.memoizedState.cachePool.pool),t!==a&&(t!=null&&t.refCount++,a!=null&&ho(a))}function Wf(t,n){t=null,n.alternate!==null&&(t=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==t&&(n.refCount++,t!=null&&ho(t))}function Li(t,n,a,o){if(n.subtreeFlags&10256)for(n=n.child;n!==null;)Kg(t,n,a,o),n=n.sibling}function Kg(t,n,a,o){var u=n.flags;switch(n.tag){case 0:case 11:case 15:Li(t,n,a,o),u&2048&&Ao(9,n);break;case 1:Li(t,n,a,o);break;case 3:Li(t,n,a,o),u&2048&&(t=null,n.alternate!==null&&(t=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==t&&(n.refCount++,t!=null&&ho(t)));break;case 12:if(u&2048){Li(t,n,a,o),t=n.stateNode;try{var p=n.memoizedProps,S=p.id,C=p.onPostCommit;typeof C=="function"&&C(S,n.alternate===null?"mount":"update",t.passiveEffectDuration,-0)}catch(B){Ft(n,n.return,B)}}else Li(t,n,a,o);break;case 31:Li(t,n,a,o);break;case 13:Li(t,n,a,o);break;case 23:break;case 22:p=n.stateNode,S=n.alternate,n.memoizedState!==null?p._visibility&2?Li(t,n,a,o):Co(t,n):p._visibility&2?Li(t,n,a,o):(p._visibility|=2,dr(t,n,a,o,(n.subtreeFlags&10256)!==0||!1)),u&2048&&Xf(S,n);break;case 24:Li(t,n,a,o),u&2048&&Wf(n.alternate,n);break;default:Li(t,n,a,o)}}function dr(t,n,a,o,u){for(u=u&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var p=t,S=n,C=a,B=o,oe=S.flags;switch(S.tag){case 0:case 11:case 15:dr(p,S,C,B,u),Ao(8,S);break;case 23:break;case 22:var xe=S.stateNode;S.memoizedState!==null?xe._visibility&2?dr(p,S,C,B,u):Co(p,S):(xe._visibility|=2,dr(p,S,C,B,u)),u&&oe&2048&&Xf(S.alternate,S);break;case 24:dr(p,S,C,B,u),u&&oe&2048&&Wf(S.alternate,S);break;default:dr(p,S,C,B,u)}n=n.sibling}}function Co(t,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=t,o=n,u=o.flags;switch(o.tag){case 22:Co(a,o),u&2048&&Xf(o.alternate,o);break;case 24:Co(a,o),u&2048&&Wf(o.alternate,o);break;default:Co(a,o)}n=n.sibling}}var wo=8192;function hr(t,n,a){if(t.subtreeFlags&wo)for(t=t.child;t!==null;)Qg(t,n,a),t=t.sibling}function Qg(t,n,a){switch(t.tag){case 26:hr(t,n,a),t.flags&wo&&t.memoizedState!==null&&py(a,Ui,t.memoizedState,t.memoizedProps);break;case 5:hr(t,n,a);break;case 3:case 4:var o=Ui;Ui=lc(t.stateNode.containerInfo),hr(t,n,a),Ui=o;break;case 22:t.memoizedState===null&&(o=t.alternate,o!==null&&o.memoizedState!==null?(o=wo,wo=16777216,hr(t,n,a),wo=o):hr(t,n,a));break;default:hr(t,n,a)}}function Jg(t){var n=t.alternate;if(n!==null&&(t=n.child,t!==null)){n.child=null;do n=t.sibling,t.sibling=null,t=n;while(t!==null)}}function Do(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];An=o,e0(o,t)}Jg(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)$g(t),t=t.sibling}function $g(t){switch(t.tag){case 0:case 11:case 15:Do(t),t.flags&2048&&Za(9,t,t.return);break;case 3:Do(t);break;case 12:Do(t);break;case 22:var n=t.stateNode;t.memoizedState!==null&&n._visibility&2&&(t.return===null||t.return.tag!==13)?(n._visibility&=-3,jl(t)):Do(t);break;default:Do(t)}}function jl(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];An=o,e0(o,t)}Jg(t)}for(t=t.child;t!==null;){switch(n=t,n.tag){case 0:case 11:case 15:Za(8,n,n.return),jl(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,jl(n));break;default:jl(n)}t=t.sibling}}function e0(t,n){for(;An!==null;){var a=An;switch(a.tag){case 0:case 11:case 15:Za(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var o=a.memoizedState.cachePool.pool;o!=null&&o.refCount++}break;case 24:ho(a.memoizedState.cache)}if(o=a.child,o!==null)o.return=a,An=o;else e:for(a=t;An!==null;){o=An;var u=o.sibling,p=o.return;if(Xg(o),o===a){An=null;break e}if(u!==null){u.return=p,An=u;break e}An=p}}}var wS={getCacheForType:function(t){var n=Dn(pn),a=n.data.get(t);return a===void 0&&(a=t(),n.data.set(t,a)),a},cacheSignal:function(){return Dn(pn).controller.signal}},DS=typeof WeakMap=="function"?WeakMap:Map,Lt=0,Zt=null,vt=null,Mt=0,It=0,fi=null,ja=!1,pr=!1,Yf=!1,xa=0,ln=0,Ka=0,Ps=0,qf=0,di=0,mr=0,No=null,Jn=null,Zf=!1,Kl=0,t0=0,Ql=1/0,Jl=null,Qa=null,Sn=0,Ja=null,gr=null,Sa=0,jf=0,Kf=null,n0=null,Uo=0,Qf=null;function hi(){return(Lt&2)!==0&&Mt!==0?Mt&-Mt:F.T!==null?id():$r()}function i0(){if(di===0)if((Mt&536870912)===0||Et){var t=it;it<<=1,(it&3932160)===0&&(it=262144),di=t}else di=536870912;return t=ci.current,t!==null&&(t.flags|=32),di}function $n(t,n,a){(t===Zt&&(It===2||It===9)||t.cancelPendingCommit!==null)&&(_r(t,0),$a(t,Mt,di,!1)),We(t,a),((Lt&2)===0||t!==Zt)&&(t===Zt&&((Lt&2)===0&&(Ps|=a),ln===4&&$a(t,Mt,di,!1)),Yi(t))}function a0(t,n,a){if((Lt&6)!==0)throw Error(s(327));var o=!a&&(n&127)===0&&(n&t.expiredLanes)===0||we(t,n),u=o?LS(t,n):$f(t,n,!0),p=o;do{if(u===0){pr&&!o&&$a(t,n,0,!1);break}else{if(a=t.current.alternate,p&&!NS(a)){u=$f(t,n,!1),p=!1;continue}if(u===2){if(p=n,t.errorRecoveryDisabledLanes&p)var S=0;else S=t.pendingLanes&-536870913,S=S!==0?S:S&536870912?536870912:0;if(S!==0){n=S;e:{var C=t;u=No;var B=C.current.memoizedState.isDehydrated;if(B&&(_r(C,S).flags|=256),S=$f(C,S,!1),S!==2){if(Yf&&!B){C.errorRecoveryDisabledLanes|=p,Ps|=p,u=4;break e}p=Jn,Jn=u,p!==null&&(Jn===null?Jn=p:Jn.push.apply(Jn,p))}u=S}if(p=!1,u!==2)continue}}if(u===1){_r(t,0),$a(t,n,0,!0);break}e:{switch(o=t,p=u,p){case 0:case 1:throw Error(s(345));case 4:if((n&4194048)!==n)break;case 6:$a(o,n,di,!ja);break e;case 2:Jn=null;break;case 3:case 5:break;default:throw Error(s(329))}if((n&62914560)===n&&(u=Kl+300-Pt(),10<u)){if($a(o,n,di,!ja),Se(o,0,!0)!==0)break e;Sa=n,o.timeoutHandle=P0(s0.bind(null,o,a,Jn,Jl,Zf,n,di,Ps,mr,ja,p,"Throttled",-0,0),u);break e}s0(o,a,Jn,Jl,Zf,n,di,Ps,mr,ja,p,null,-0,0)}}break}while(!0);Yi(t)}function s0(t,n,a,o,u,p,S,C,B,oe,xe,Me,ce,de){if(t.timeoutHandle=-1,Me=n.subtreeFlags,Me&8192||(Me&16785408)===16785408){Me={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:vi},Qg(n,p,Me);var qe=(p&62914560)===p?Kl-Pt():(p&4194048)===p?t0-Pt():0;if(qe=my(Me,qe),qe!==null){Sa=p,t.cancelPendingCommit=qe(h0.bind(null,t,n,p,a,o,u,S,C,B,xe,Me,null,ce,de)),$a(t,p,S,!oe);return}}h0(t,n,p,a,o,u,S,C,B)}function NS(t){for(var n=t;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var o=0;o<a.length;o++){var u=a[o],p=u.getSnapshot;u=u.value;try{if(!oi(p(),u))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function $a(t,n,a,o){n&=~qf,n&=~Ps,t.suspendedLanes|=n,t.pingedLanes&=~n,o&&(t.warmLanes|=n),o=t.expirationTimes;for(var u=n;0<u;){var p=31-Ge(u),S=1<<p;o[p]=-1,u&=~S}a!==0&&At(t,a,n)}function $l(){return(Lt&6)===0?(Lo(0),!1):!0}function Jf(){if(vt!==null){if(It===0)var t=vt.return;else t=vt,ca=As=null,pf(t),or=null,mo=0,t=vt;for(;t!==null;)Ig(t.alternate,t),t=t.return;vt=null}}function _r(t,n){var a=t.timeoutHandle;a!==-1&&(t.timeoutHandle=-1,QS(a)),a=t.cancelPendingCommit,a!==null&&(t.cancelPendingCommit=null,a()),Sa=0,Jf(),Zt=t,vt=a=oa(t.current,null),Mt=n,It=0,fi=null,ja=!1,pr=we(t,n),Yf=!1,mr=di=qf=Ps=Ka=ln=0,Jn=No=null,Zf=!1,(n&8)!==0&&(n|=n&32);var o=t.entangledLanes;if(o!==0)for(t=t.entanglements,o&=n;0<o;){var u=31-Ge(o),p=1<<u;n|=t[u],o&=~p}return xa=n,Sl(),a}function r0(t,n){ut=null,F.H=bo,n===rr||n===Cl?(n=Mm(),It=3):n===tf?(n=Mm(),It=4):It=n===Df?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,fi=n,vt===null&&(ln=1,Vl(t,Si(n,t.current)))}function o0(){var t=ci.current;return t===null?!0:(Mt&4194048)===Mt?Ei===null:(Mt&62914560)===Mt||(Mt&536870912)!==0?t===Ei:!1}function l0(){var t=F.H;return F.H=bo,t===null?bo:t}function c0(){var t=F.A;return F.A=wS,t}function ec(){ln=4,ja||(Mt&4194048)!==Mt&&ci.current!==null||(pr=!0),(Ka&134217727)===0&&(Ps&134217727)===0||Zt===null||$a(Zt,Mt,di,!1)}function $f(t,n,a){var o=Lt;Lt|=2;var u=l0(),p=c0();(Zt!==t||Mt!==n)&&(Jl=null,_r(t,n)),n=!1;var S=ln;e:do try{if(It!==0&&vt!==null){var C=vt,B=fi;switch(It){case 8:Jf(),S=6;break e;case 3:case 2:case 9:case 6:ci.current===null&&(n=!0);var oe=It;if(It=0,fi=null,vr(t,C,B,oe),a&&pr){S=0;break e}break;default:oe=It,It=0,fi=null,vr(t,C,B,oe)}}US(),S=ln;break}catch(xe){r0(t,xe)}while(!0);return n&&t.shellSuspendCounter++,ca=As=null,Lt=o,F.H=u,F.A=p,vt===null&&(Zt=null,Mt=0,Sl()),S}function US(){for(;vt!==null;)u0(vt)}function LS(t,n){var a=Lt;Lt|=2;var o=l0(),u=c0();Zt!==t||Mt!==n?(Jl=null,Ql=Pt()+500,_r(t,n)):pr=we(t,n);e:do try{if(It!==0&&vt!==null){n=vt;var p=fi;t:switch(It){case 1:It=0,fi=null,vr(t,n,p,1);break;case 2:case 9:if(Sm(p)){It=0,fi=null,f0(n);break}n=function(){It!==2&&It!==9||Zt!==t||(It=7),Yi(t)},p.then(n,n);break e;case 3:It=7;break e;case 4:It=5;break e;case 7:Sm(p)?(It=0,fi=null,f0(n)):(It=0,fi=null,vr(t,n,p,7));break;case 5:var S=null;switch(vt.tag){case 26:S=vt.memoizedState;case 5:case 27:var C=vt;if(S?K0(S):C.stateNode.complete){It=0,fi=null;var B=C.sibling;if(B!==null)vt=B;else{var oe=C.return;oe!==null?(vt=oe,tc(oe)):vt=null}break t}}It=0,fi=null,vr(t,n,p,5);break;case 6:It=0,fi=null,vr(t,n,p,6);break;case 8:Jf(),ln=6;break e;default:throw Error(s(462))}}OS();break}catch(xe){r0(t,xe)}while(!0);return ca=As=null,F.H=o,F.A=u,Lt=a,vt!==null?0:(Zt=null,Mt=0,Sl(),ln)}function OS(){for(;vt!==null&&!rn();)u0(vt)}function u0(t){var n=Og(t.alternate,t,xa);t.memoizedProps=t.pendingProps,n===null?tc(t):vt=n}function f0(t){var n=t,a=n.alternate;switch(n.tag){case 15:case 0:n=Cg(a,n,n.pendingProps,n.type,void 0,Mt);break;case 11:n=Cg(a,n,n.pendingProps,n.type.render,n.ref,Mt);break;case 5:pf(n);default:Ig(a,n),n=vt=cm(n,xa),n=Og(a,n,xa)}t.memoizedProps=t.pendingProps,n===null?tc(t):vt=n}function vr(t,n,a,o){ca=As=null,pf(n),or=null,mo=0;var u=n.return;try{if(MS(t,u,n,a,Mt)){ln=1,Vl(t,Si(a,t.current)),vt=null;return}}catch(p){if(u!==null)throw vt=u,p;ln=1,Vl(t,Si(a,t.current)),vt=null;return}n.flags&32768?(Et||o===1?t=!0:pr||(Mt&536870912)!==0?t=!1:(ja=t=!0,(o===2||o===9||o===3||o===6)&&(o=ci.current,o!==null&&o.tag===13&&(o.flags|=16384))),d0(n,t)):tc(n)}function tc(t){var n=t;do{if((n.flags&32768)!==0){d0(n,ja);return}t=n.return;var a=TS(n.alternate,n,xa);if(a!==null){vt=a;return}if(n=n.sibling,n!==null){vt=n;return}vt=n=t}while(n!==null);ln===0&&(ln=5)}function d0(t,n){do{var a=AS(t.alternate,t);if(a!==null){a.flags&=32767,vt=a;return}if(a=t.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(t=t.sibling,t!==null)){vt=t;return}vt=t=a}while(t!==null);ln=6,vt=null}function h0(t,n,a,o,u,p,S,C,B){t.cancelPendingCommit=null;do nc();while(Sn!==0);if((Lt&6)!==0)throw Error(s(327));if(n!==null){if(n===t.current)throw Error(s(177));if(p=n.lanes|n.childLanes,p|=Hu,Ht(t,a,p,S,C,B),t===Zt&&(vt=Zt=null,Mt=0),gr=n,Ja=t,Sa=a,jf=p,Kf=u,n0=o,(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?(t.callbackNode=null,t.callbackPriority=0,BS(J,function(){return v0(),null})):(t.callbackNode=null,t.callbackPriority=0),o=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||o){o=F.T,F.T=null,u=V.p,V.p=2,S=Lt,Lt|=4;try{RS(t,n,a)}finally{Lt=S,V.p=u,F.T=o}}Sn=1,p0(),m0(),g0()}}function p0(){if(Sn===1){Sn=0;var t=Ja,n=gr,a=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||a){a=F.T,F.T=null;var o=V.p;V.p=2;var u=Lt;Lt|=4;try{Zg(n,t);var p=fd,S=em(t.containerInfo),C=p.focusedElem,B=p.selectionRange;if(S!==C&&C&&C.ownerDocument&&$p(C.ownerDocument.documentElement,C)){if(B!==null&&Pu(C)){var oe=B.start,xe=B.end;if(xe===void 0&&(xe=oe),"selectionStart"in C)C.selectionStart=oe,C.selectionEnd=Math.min(xe,C.value.length);else{var Me=C.ownerDocument||document,ce=Me&&Me.defaultView||window;if(ce.getSelection){var de=ce.getSelection(),qe=C.textContent.length,et=Math.min(B.start,qe),Xt=B.end===void 0?et:Math.min(B.end,qe);!de.extend&&et>Xt&&(S=Xt,Xt=et,et=S);var Q=Jp(C,et),W=Jp(C,Xt);if(Q&&W&&(de.rangeCount!==1||de.anchorNode!==Q.node||de.anchorOffset!==Q.offset||de.focusNode!==W.node||de.focusOffset!==W.offset)){var se=Me.createRange();se.setStart(Q.node,Q.offset),de.removeAllRanges(),et>Xt?(de.addRange(se),de.extend(W.node,W.offset)):(se.setEnd(W.node,W.offset),de.addRange(se))}}}}for(Me=[],de=C;de=de.parentNode;)de.nodeType===1&&Me.push({element:de,left:de.scrollLeft,top:de.scrollTop});for(typeof C.focus=="function"&&C.focus(),C=0;C<Me.length;C++){var ye=Me[C];ye.element.scrollLeft=ye.left,ye.element.scrollTop=ye.top}}pc=!!ud,fd=ud=null}finally{Lt=u,V.p=o,F.T=a}}t.current=n,Sn=2}}function m0(){if(Sn===2){Sn=0;var t=Ja,n=gr,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=F.T,F.T=null;var o=V.p;V.p=2;var u=Lt;Lt|=4;try{kg(t,n.alternate,n)}finally{Lt=u,V.p=o,F.T=a}}Sn=3}}function g0(){if(Sn===4||Sn===3){Sn=0,Z();var t=Ja,n=gr,a=Sa,o=n0;(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?Sn=5:(Sn=0,gr=Ja=null,_0(t,t.pendingLanes));var u=t.pendingLanes;if(u===0&&(Qa=null),Jr(a),n=n.stateNode,ge&&typeof ge.onCommitFiberRoot=="function")try{ge.onCommitFiberRoot(me,n,void 0,(n.current.flags&128)===128)}catch{}if(o!==null){n=F.T,u=V.p,V.p=2,F.T=null;try{for(var p=t.onRecoverableError,S=0;S<o.length;S++){var C=o[S];p(C.value,{componentStack:C.stack})}}finally{F.T=n,V.p=u}}(Sa&3)!==0&&nc(),Yi(t),u=t.pendingLanes,(a&261930)!==0&&(u&42)!==0?t===Qf?Uo++:(Uo=0,Qf=t):Uo=0,Lo(0)}}function _0(t,n){(t.pooledCacheLanes&=n)===0&&(n=t.pooledCache,n!=null&&(t.pooledCache=null,ho(n)))}function nc(){return p0(),m0(),g0(),v0()}function v0(){if(Sn!==5)return!1;var t=Ja,n=jf;jf=0;var a=Jr(Sa),o=F.T,u=V.p;try{V.p=32>a?32:a,F.T=null,a=Kf,Kf=null;var p=Ja,S=Sa;if(Sn=0,gr=Ja=null,Sa=0,(Lt&6)!==0)throw Error(s(331));var C=Lt;if(Lt|=4,$g(p.current),Kg(p,p.current,S,a),Lt=C,Lo(0,!1),ge&&typeof ge.onPostCommitFiberRoot=="function")try{ge.onPostCommitFiberRoot(me,p)}catch{}return!0}finally{V.p=u,F.T=o,_0(t,n)}}function x0(t,n,a){n=Si(a,n),n=wf(t.stateNode,n,2),t=Wa(t,n,2),t!==null&&(We(t,2),Yi(t))}function Ft(t,n,a){if(t.tag===3)x0(t,t,a);else for(;n!==null;){if(n.tag===3){x0(n,t,a);break}else if(n.tag===1){var o=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(Qa===null||!Qa.has(o))){t=Si(a,t),a=Sg(2),o=Wa(n,a,2),o!==null&&(yg(a,o,n,t),We(o,2),Yi(o));break}}n=n.return}}function ed(t,n,a){var o=t.pingCache;if(o===null){o=t.pingCache=new DS;var u=new Set;o.set(n,u)}else u=o.get(n),u===void 0&&(u=new Set,o.set(n,u));u.has(a)||(Yf=!0,u.add(a),t=PS.bind(null,t,n,a),n.then(t,t))}function PS(t,n,a){var o=t.pingCache;o!==null&&o.delete(n),t.pingedLanes|=t.suspendedLanes&a,t.warmLanes&=~a,Zt===t&&(Mt&a)===a&&(ln===4||ln===3&&(Mt&62914560)===Mt&&300>Pt()-Kl?(Lt&2)===0&&_r(t,0):qf|=a,mr===Mt&&(mr=0)),Yi(t)}function S0(t,n){n===0&&(n=be()),t=bs(t,n),t!==null&&(We(t,n),Yi(t))}function IS(t){var n=t.memoizedState,a=0;n!==null&&(a=n.retryLane),S0(t,a)}function FS(t,n){var a=0;switch(t.tag){case 31:case 13:var o=t.stateNode,u=t.memoizedState;u!==null&&(a=u.retryLane);break;case 19:o=t.stateNode;break;case 22:o=t.stateNode._retryCache;break;default:throw Error(s(314))}o!==null&&o.delete(n),S0(t,a)}function BS(t,n){return Tn(t,n)}var ic=null,xr=null,td=!1,ac=!1,nd=!1,es=0;function Yi(t){t!==xr&&t.next===null&&(xr===null?ic=xr=t:xr=xr.next=t),ac=!0,td||(td=!0,HS())}function Lo(t,n){if(!nd&&ac){nd=!0;do for(var a=!1,o=ic;o!==null;){if(t!==0){var u=o.pendingLanes;if(u===0)var p=0;else{var S=o.suspendedLanes,C=o.pingedLanes;p=(1<<31-Ge(42|t)+1)-1,p&=u&~(S&~C),p=p&201326741?p&201326741|1:p?p|2:0}p!==0&&(a=!0,E0(o,p))}else p=Mt,p=Se(o,o===Zt?p:0,o.cancelPendingCommit!==null||o.timeoutHandle!==-1),(p&3)===0||we(o,p)||(a=!0,E0(o,p));o=o.next}while(a);nd=!1}}function zS(){y0()}function y0(){ac=td=!1;var t=0;es!==0&&KS()&&(t=es);for(var n=Pt(),a=null,o=ic;o!==null;){var u=o.next,p=M0(o,n);p===0?(o.next=null,a===null?ic=u:a.next=u,u===null&&(xr=a)):(a=o,(t!==0||(p&3)!==0)&&(ac=!0)),o=u}Sn!==0&&Sn!==5||Lo(t),es!==0&&(es=0)}function M0(t,n){for(var a=t.suspendedLanes,o=t.pingedLanes,u=t.expirationTimes,p=t.pendingLanes&-62914561;0<p;){var S=31-Ge(p),C=1<<S,B=u[S];B===-1?((C&a)===0||(C&o)!==0)&&(u[S]=Fe(C,n)):B<=n&&(t.expiredLanes|=C),p&=~C}if(n=Zt,a=Mt,a=Se(t,t===n?a:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),o=t.callbackNode,a===0||t===n&&(It===2||It===9)||t.cancelPendingCommit!==null)return o!==null&&o!==null&&Yt(o),t.callbackNode=null,t.callbackPriority=0;if((a&3)===0||we(t,a)){if(n=a&-a,n===t.callbackPriority)return n;switch(o!==null&&Yt(o),Jr(a)){case 2:case 8:a=E;break;case 32:a=J;break;case 268435456:a=pe;break;default:a=J}return o=b0.bind(null,t),a=Tn(a,o),t.callbackPriority=n,t.callbackNode=a,n}return o!==null&&o!==null&&Yt(o),t.callbackPriority=2,t.callbackNode=null,2}function b0(t,n){if(Sn!==0&&Sn!==5)return t.callbackNode=null,t.callbackPriority=0,null;var a=t.callbackNode;if(nc()&&t.callbackNode!==a)return null;var o=Mt;return o=Se(t,t===Zt?o:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),o===0?null:(a0(t,o,n),M0(t,Pt()),t.callbackNode!=null&&t.callbackNode===a?b0.bind(null,t):null)}function E0(t,n){if(nc())return null;a0(t,n,!0)}function HS(){JS(function(){(Lt&6)!==0?Tn(O,zS):y0()})}function id(){if(es===0){var t=ar;t===0&&(t=Je,Je<<=1,(Je&261888)===0&&(Je=256)),es=t}return es}function T0(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:Di(""+t)}function A0(t,n){var a=n.ownerDocument.createElement("input");return a.name=n.name,a.value=n.value,t.id&&a.setAttribute("form",t.id),n.parentNode.insertBefore(a,n),t=new FormData(t),a.parentNode.removeChild(a),t}function GS(t,n,a,o,u){if(n==="submit"&&a&&a.stateNode===u){var p=T0((u[Cn]||null).action),S=o.submitter;S&&(n=(n=S[Cn]||null)?T0(n.formAction):S.getAttribute("formAction"),n!==null&&(p=n,S=null));var C=new gl("action","action",null,o,u);t.push({event:C,listeners:[{instance:null,listener:function(){if(o.defaultPrevented){if(es!==0){var B=S?A0(u,S):new FormData(u);bf(a,{pending:!0,data:B,method:u.method,action:p},null,B)}}else typeof p=="function"&&(C.preventDefault(),B=S?A0(u,S):new FormData(u),bf(a,{pending:!0,data:B,method:u.method,action:p},p,B))},currentTarget:u}]})}}for(var ad=0;ad<zu.length;ad++){var sd=zu[ad],VS=sd.toLowerCase(),kS=sd[0].toUpperCase()+sd.slice(1);Ni(VS,"on"+kS)}Ni(im,"onAnimationEnd"),Ni(am,"onAnimationIteration"),Ni(sm,"onAnimationStart"),Ni("dblclick","onDoubleClick"),Ni("focusin","onFocus"),Ni("focusout","onBlur"),Ni(sS,"onTransitionRun"),Ni(rS,"onTransitionStart"),Ni(oS,"onTransitionCancel"),Ni(rm,"onTransitionEnd"),k("onMouseEnter",["mouseout","mouseover"]),k("onMouseLeave",["mouseout","mouseover"]),k("onPointerEnter",["pointerout","pointerover"]),k("onPointerLeave",["pointerout","pointerover"]),A("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),A("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),A("onBeforeInput",["compositionend","keypress","textInput","paste"]),A("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),A("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),A("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Oo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),XS=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Oo));function R0(t,n){n=(n&4)!==0;for(var a=0;a<t.length;a++){var o=t[a],u=o.event;o=o.listeners;e:{var p=void 0;if(n)for(var S=o.length-1;0<=S;S--){var C=o[S],B=C.instance,oe=C.currentTarget;if(C=C.listener,B!==p&&u.isPropagationStopped())break e;p=C,u.currentTarget=oe;try{p(u)}catch(xe){xl(xe)}u.currentTarget=null,p=B}else for(S=0;S<o.length;S++){if(C=o[S],B=C.instance,oe=C.currentTarget,C=C.listener,B!==p&&u.isPropagationStopped())break e;p=C,u.currentTarget=oe;try{p(u)}catch(xe){xl(xe)}u.currentTarget=null,p=B}}}}function xt(t,n){var a=n[_s];a===void 0&&(a=n[_s]=new Set);var o=t+"__bubble";a.has(o)||(C0(n,t,2,!1),a.add(o))}function rd(t,n,a){var o=0;n&&(o|=4),C0(a,t,o,n)}var sc="_reactListening"+Math.random().toString(36).slice(2);function od(t){if(!t[sc]){t[sc]=!0,dl.forEach(function(a){a!=="selectionchange"&&(XS.has(a)||rd(a,!1,t),rd(a,!0,t))});var n=t.nodeType===9?t:t.ownerDocument;n===null||n[sc]||(n[sc]=!0,rd("selectionchange",!1,n))}}function C0(t,n,a,o){switch(i_(n)){case 2:var u=vy;break;case 8:u=xy;break;default:u=Md}a=u.bind(null,n,a,t),u=void 0,!Au||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(u=!0),o?u!==void 0?t.addEventListener(n,a,{capture:!0,passive:u}):t.addEventListener(n,a,!0):u!==void 0?t.addEventListener(n,a,{passive:u}):t.addEventListener(n,a,!1)}function ld(t,n,a,o,u){var p=o;if((n&1)===0&&(n&2)===0&&o!==null)e:for(;;){if(o===null)return;var S=o.tag;if(S===3||S===4){var C=o.stateNode.containerInfo;if(C===u)break;if(S===4)for(S=o.return;S!==null;){var B=S.tag;if((B===3||B===4)&&S.stateNode.containerInfo===u)return;S=S.return}for(;C!==null;){if(S=aa(C),S===null)return;if(B=S.tag,B===5||B===6||B===26||B===27){o=p=S;continue e}C=C.parentNode}}o=o.return}Lp(function(){var oe=p,xe=Eu(a),Me=[];e:{var ce=om.get(t);if(ce!==void 0){var de=gl,qe=t;switch(t){case"keypress":if(pl(a)===0)break e;case"keydown":case"keyup":de=Fx;break;case"focusin":qe="focus",de=Du;break;case"focusout":qe="blur",de=Du;break;case"beforeblur":case"afterblur":de=Du;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":de=Ip;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":de=Tx;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":de=Hx;break;case im:case am:case sm:de=Cx;break;case rm:de=Vx;break;case"scroll":case"scrollend":de=bx;break;case"wheel":de=Xx;break;case"copy":case"cut":case"paste":de=Dx;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":de=Bp;break;case"toggle":case"beforetoggle":de=Yx}var et=(n&4)!==0,Xt=!et&&(t==="scroll"||t==="scrollend"),Q=et?ce!==null?ce+"Capture":null:ce;et=[];for(var W=oe,se;W!==null;){var ye=W;if(se=ye.stateNode,ye=ye.tag,ye!==5&&ye!==26&&ye!==27||se===null||Q===null||(ye=to(W,Q),ye!=null&&et.push(Po(W,ye,se))),Xt)break;W=W.return}0<et.length&&(ce=new de(ce,qe,null,a,xe),Me.push({event:ce,listeners:et}))}}if((n&7)===0){e:{if(ce=t==="mouseover"||t==="pointerover",de=t==="mouseout"||t==="pointerout",ce&&a!==bu&&(qe=a.relatedTarget||a.fromElement)&&(aa(qe)||qe[qn]))break e;if((de||ce)&&(ce=xe.window===xe?xe:(ce=xe.ownerDocument)?ce.defaultView||ce.parentWindow:window,de?(qe=a.relatedTarget||a.toElement,de=oe,qe=qe?aa(qe):null,qe!==null&&(Xt=c(qe),et=qe.tag,qe!==Xt||et!==5&&et!==27&&et!==6)&&(qe=null)):(de=null,qe=oe),de!==qe)){if(et=Ip,ye="onMouseLeave",Q="onMouseEnter",W="mouse",(t==="pointerout"||t==="pointerover")&&(et=Bp,ye="onPointerLeave",Q="onPointerEnter",W="pointer"),Xt=de==null?ce:xs(de),se=qe==null?ce:xs(qe),ce=new et(ye,W+"leave",de,a,xe),ce.target=Xt,ce.relatedTarget=se,ye=null,aa(xe)===oe&&(et=new et(Q,W+"enter",qe,a,xe),et.target=se,et.relatedTarget=Xt,ye=et),Xt=ye,de&&qe)t:{for(et=WS,Q=de,W=qe,se=0,ye=Q;ye;ye=et(ye))se++;ye=0;for(var $e=W;$e;$e=et($e))ye++;for(;0<se-ye;)Q=et(Q),se--;for(;0<ye-se;)W=et(W),ye--;for(;se--;){if(Q===W||W!==null&&Q===W.alternate){et=Q;break t}Q=et(Q),W=et(W)}et=null}else et=null;de!==null&&w0(Me,ce,de,et,!1),qe!==null&&Xt!==null&&w0(Me,Xt,qe,et,!0)}}e:{if(ce=oe?xs(oe):window,de=ce.nodeName&&ce.nodeName.toLowerCase(),de==="select"||de==="input"&&ce.type==="file")var wt=Yp;else if(Xp(ce))if(qp)wt=nS;else{wt=eS;var je=$x}else de=ce.nodeName,!de||de.toLowerCase()!=="input"||ce.type!=="checkbox"&&ce.type!=="radio"?oe&&_i(oe.elementType)&&(wt=Yp):wt=tS;if(wt&&(wt=wt(t,oe))){Wp(Me,wt,a,xe);break e}je&&je(t,ce,oe),t==="focusout"&&oe&&ce.type==="number"&&oe.memoizedProps.value!=null&&xn(ce,"number",ce.value)}switch(je=oe?xs(oe):window,t){case"focusin":(Xp(je)||je.contentEditable==="true")&&(Ks=je,Iu=oe,co=null);break;case"focusout":co=Iu=Ks=null;break;case"mousedown":Fu=!0;break;case"contextmenu":case"mouseup":case"dragend":Fu=!1,tm(Me,a,xe);break;case"selectionchange":if(aS)break;case"keydown":case"keyup":tm(Me,a,xe)}var ft;if(Uu)e:{switch(t){case"compositionstart":var bt="onCompositionStart";break e;case"compositionend":bt="onCompositionEnd";break e;case"compositionupdate":bt="onCompositionUpdate";break e}bt=void 0}else js?Vp(t,a)&&(bt="onCompositionEnd"):t==="keydown"&&a.keyCode===229&&(bt="onCompositionStart");bt&&(zp&&a.locale!=="ko"&&(js||bt!=="onCompositionStart"?bt==="onCompositionEnd"&&js&&(ft=Op()):(Ba=xe,Ru="value"in Ba?Ba.value:Ba.textContent,js=!0)),je=rc(oe,bt),0<je.length&&(bt=new Fp(bt,t,null,a,xe),Me.push({event:bt,listeners:je}),ft?bt.data=ft:(ft=kp(a),ft!==null&&(bt.data=ft)))),(ft=Zx?jx(t,a):Kx(t,a))&&(bt=rc(oe,"onBeforeInput"),0<bt.length&&(je=new Fp("onBeforeInput","beforeinput",null,a,xe),Me.push({event:je,listeners:bt}),je.data=ft)),GS(Me,t,oe,a,xe)}R0(Me,n)})}function Po(t,n,a){return{instance:t,listener:n,currentTarget:a}}function rc(t,n){for(var a=n+"Capture",o=[];t!==null;){var u=t,p=u.stateNode;if(u=u.tag,u!==5&&u!==26&&u!==27||p===null||(u=to(t,a),u!=null&&o.unshift(Po(t,u,p)),u=to(t,n),u!=null&&o.push(Po(t,u,p))),t.tag===3)return o;t=t.return}return[]}function WS(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function w0(t,n,a,o,u){for(var p=n._reactName,S=[];a!==null&&a!==o;){var C=a,B=C.alternate,oe=C.stateNode;if(C=C.tag,B!==null&&B===o)break;C!==5&&C!==26&&C!==27||oe===null||(B=oe,u?(oe=to(a,p),oe!=null&&S.unshift(Po(a,oe,B))):u||(oe=to(a,p),oe!=null&&S.push(Po(a,oe,B)))),a=a.return}S.length!==0&&t.push({event:n,listeners:S})}var YS=/\r\n?/g,qS=/\u0000|\uFFFD/g;function D0(t){return(typeof t=="string"?t:""+t).replace(YS,`
`).replace(qS,"")}function N0(t,n){return n=D0(n),D0(t)===n}function kt(t,n,a,o,u,p){switch(a){case"children":typeof o=="string"?n==="body"||n==="textarea"&&o===""||Hn(t,o):(typeof o=="number"||typeof o=="bigint")&&n!=="body"&&Hn(t,""+o);break;case"className":Ue(t,"class",o);break;case"tabIndex":Ue(t,"tabindex",o);break;case"dir":case"role":case"viewBox":case"width":case"height":Ue(t,a,o);break;case"style":$t(t,o,p);break;case"data":if(n!=="object"){Ue(t,"data",o);break}case"src":case"href":if(o===""&&(n!=="a"||a!=="href")){t.removeAttribute(a);break}if(o==null||typeof o=="function"||typeof o=="symbol"||typeof o=="boolean"){t.removeAttribute(a);break}o=Di(""+o),t.setAttribute(a,o);break;case"action":case"formAction":if(typeof o=="function"){t.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof p=="function"&&(a==="formAction"?(n!=="input"&&kt(t,n,"name",u.name,u,null),kt(t,n,"formEncType",u.formEncType,u,null),kt(t,n,"formMethod",u.formMethod,u,null),kt(t,n,"formTarget",u.formTarget,u,null)):(kt(t,n,"encType",u.encType,u,null),kt(t,n,"method",u.method,u,null),kt(t,n,"target",u.target,u,null)));if(o==null||typeof o=="symbol"||typeof o=="boolean"){t.removeAttribute(a);break}o=Di(""+o),t.setAttribute(a,o);break;case"onClick":o!=null&&(t.onclick=vi);break;case"onScroll":o!=null&&xt("scroll",t);break;case"onScrollEnd":o!=null&&xt("scrollend",t);break;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(s(61));if(a=o.__html,a!=null){if(u.children!=null)throw Error(s(60));t.innerHTML=a}}break;case"multiple":t.multiple=o&&typeof o!="function"&&typeof o!="symbol";break;case"muted":t.muted=o&&typeof o!="function"&&typeof o!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(o==null||typeof o=="function"||typeof o=="boolean"||typeof o=="symbol"){t.removeAttribute("xlink:href");break}a=Di(""+o),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":o!=null&&typeof o!="function"&&typeof o!="symbol"?t.setAttribute(a,""+o):t.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":o&&typeof o!="function"&&typeof o!="symbol"?t.setAttribute(a,""):t.removeAttribute(a);break;case"capture":case"download":o===!0?t.setAttribute(a,""):o!==!1&&o!=null&&typeof o!="function"&&typeof o!="symbol"?t.setAttribute(a,o):t.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":o!=null&&typeof o!="function"&&typeof o!="symbol"&&!isNaN(o)&&1<=o?t.setAttribute(a,o):t.removeAttribute(a);break;case"rowSpan":case"start":o==null||typeof o=="function"||typeof o=="symbol"||isNaN(o)?t.removeAttribute(a):t.setAttribute(a,o);break;case"popover":xt("beforetoggle",t),xt("toggle",t),Ve(t,"popover",o);break;case"xlinkActuate":Be(t,"http://www.w3.org/1999/xlink","xlink:actuate",o);break;case"xlinkArcrole":Be(t,"http://www.w3.org/1999/xlink","xlink:arcrole",o);break;case"xlinkRole":Be(t,"http://www.w3.org/1999/xlink","xlink:role",o);break;case"xlinkShow":Be(t,"http://www.w3.org/1999/xlink","xlink:show",o);break;case"xlinkTitle":Be(t,"http://www.w3.org/1999/xlink","xlink:title",o);break;case"xlinkType":Be(t,"http://www.w3.org/1999/xlink","xlink:type",o);break;case"xmlBase":Be(t,"http://www.w3.org/XML/1998/namespace","xml:base",o);break;case"xmlLang":Be(t,"http://www.w3.org/XML/1998/namespace","xml:lang",o);break;case"xmlSpace":Be(t,"http://www.w3.org/XML/1998/namespace","xml:space",o);break;case"is":Ve(t,"is",o);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=Gt.get(a)||a,Ve(t,a,o))}}function cd(t,n,a,o,u,p){switch(a){case"style":$t(t,o,p);break;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(s(61));if(a=o.__html,a!=null){if(u.children!=null)throw Error(s(60));t.innerHTML=a}}break;case"children":typeof o=="string"?Hn(t,o):(typeof o=="number"||typeof o=="bigint")&&Hn(t,""+o);break;case"onScroll":o!=null&&xt("scroll",t);break;case"onScrollEnd":o!=null&&xt("scrollend",t);break;case"onClick":o!=null&&(t.onclick=vi);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!eo.hasOwnProperty(a))e:{if(a[0]==="o"&&a[1]==="n"&&(u=a.endsWith("Capture"),n=a.slice(2,u?a.length-7:void 0),p=t[Cn]||null,p=p!=null?p[a]:null,typeof p=="function"&&t.removeEventListener(n,p,u),typeof o=="function")){typeof p!="function"&&p!==null&&(a in t?t[a]=null:t.hasAttribute(a)&&t.removeAttribute(a)),t.addEventListener(n,o,u);break e}a in t?t[a]=o:o===!0?t.setAttribute(a,""):Ve(t,a,o)}}}function Un(t,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":xt("error",t),xt("load",t);var o=!1,u=!1,p;for(p in a)if(a.hasOwnProperty(p)){var S=a[p];if(S!=null)switch(p){case"src":o=!0;break;case"srcSet":u=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(s(137,n));default:kt(t,n,p,S,a,null)}}u&&kt(t,n,"srcSet",a.srcSet,a,null),o&&kt(t,n,"src",a.src,a,null);return;case"input":xt("invalid",t);var C=p=S=u=null,B=null,oe=null;for(o in a)if(a.hasOwnProperty(o)){var xe=a[o];if(xe!=null)switch(o){case"name":u=xe;break;case"type":S=xe;break;case"checked":B=xe;break;case"defaultChecked":oe=xe;break;case"value":p=xe;break;case"defaultValue":C=xe;break;case"children":case"dangerouslySetInnerHTML":if(xe!=null)throw Error(s(137,n));break;default:kt(t,n,o,xe,a,null)}}ke(t,p,C,B,oe,S,u,!1);return;case"select":xt("invalid",t),o=S=p=null;for(u in a)if(a.hasOwnProperty(u)&&(C=a[u],C!=null))switch(u){case"value":p=C;break;case"defaultValue":S=C;break;case"multiple":o=C;default:kt(t,n,u,C,a,null)}n=p,a=S,t.multiple=!!o,n!=null?ht(t,!!o,n,!1):a!=null&&ht(t,!!o,a,!0);return;case"textarea":xt("invalid",t),p=u=o=null;for(S in a)if(a.hasOwnProperty(S)&&(C=a[S],C!=null))switch(S){case"value":o=C;break;case"defaultValue":u=C;break;case"children":p=C;break;case"dangerouslySetInnerHTML":if(C!=null)throw Error(s(91));break;default:kt(t,n,S,C,a,null)}ri(t,o,u,p);return;case"option":for(B in a)a.hasOwnProperty(B)&&(o=a[B],o!=null)&&(B==="selected"?t.selected=o&&typeof o!="function"&&typeof o!="symbol":kt(t,n,B,o,a,null));return;case"dialog":xt("beforetoggle",t),xt("toggle",t),xt("cancel",t),xt("close",t);break;case"iframe":case"object":xt("load",t);break;case"video":case"audio":for(o=0;o<Oo.length;o++)xt(Oo[o],t);break;case"image":xt("error",t),xt("load",t);break;case"details":xt("toggle",t);break;case"embed":case"source":case"link":xt("error",t),xt("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(oe in a)if(a.hasOwnProperty(oe)&&(o=a[oe],o!=null))switch(oe){case"children":case"dangerouslySetInnerHTML":throw Error(s(137,n));default:kt(t,n,oe,o,a,null)}return;default:if(_i(n)){for(xe in a)a.hasOwnProperty(xe)&&(o=a[xe],o!==void 0&&cd(t,n,xe,o,a,void 0));return}}for(C in a)a.hasOwnProperty(C)&&(o=a[C],o!=null&&kt(t,n,C,o,a,null))}function ZS(t,n,a,o){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var u=null,p=null,S=null,C=null,B=null,oe=null,xe=null;for(de in a){var Me=a[de];if(a.hasOwnProperty(de)&&Me!=null)switch(de){case"checked":break;case"value":break;case"defaultValue":B=Me;default:o.hasOwnProperty(de)||kt(t,n,de,null,o,Me)}}for(var ce in o){var de=o[ce];if(Me=a[ce],o.hasOwnProperty(ce)&&(de!=null||Me!=null))switch(ce){case"type":p=de;break;case"name":u=de;break;case"checked":oe=de;break;case"defaultChecked":xe=de;break;case"value":S=de;break;case"defaultValue":C=de;break;case"children":case"dangerouslySetInnerHTML":if(de!=null)throw Error(s(137,n));break;default:de!==Me&&kt(t,n,ce,de,o,Me)}}hn(t,S,C,B,oe,xe,p,u);return;case"select":de=S=C=ce=null;for(p in a)if(B=a[p],a.hasOwnProperty(p)&&B!=null)switch(p){case"value":break;case"multiple":de=B;default:o.hasOwnProperty(p)||kt(t,n,p,null,o,B)}for(u in o)if(p=o[u],B=a[u],o.hasOwnProperty(u)&&(p!=null||B!=null))switch(u){case"value":ce=p;break;case"defaultValue":C=p;break;case"multiple":S=p;default:p!==B&&kt(t,n,u,p,o,B)}n=C,a=S,o=de,ce!=null?ht(t,!!a,ce,!1):!!o!=!!a&&(n!=null?ht(t,!!a,n,!0):ht(t,!!a,a?[]:"",!1));return;case"textarea":de=ce=null;for(C in a)if(u=a[C],a.hasOwnProperty(C)&&u!=null&&!o.hasOwnProperty(C))switch(C){case"value":break;case"children":break;default:kt(t,n,C,null,o,u)}for(S in o)if(u=o[S],p=a[S],o.hasOwnProperty(S)&&(u!=null||p!=null))switch(S){case"value":ce=u;break;case"defaultValue":de=u;break;case"children":break;case"dangerouslySetInnerHTML":if(u!=null)throw Error(s(91));break;default:u!==p&&kt(t,n,S,u,o,p)}zn(t,ce,de);return;case"option":for(var qe in a)ce=a[qe],a.hasOwnProperty(qe)&&ce!=null&&!o.hasOwnProperty(qe)&&(qe==="selected"?t.selected=!1:kt(t,n,qe,null,o,ce));for(B in o)ce=o[B],de=a[B],o.hasOwnProperty(B)&&ce!==de&&(ce!=null||de!=null)&&(B==="selected"?t.selected=ce&&typeof ce!="function"&&typeof ce!="symbol":kt(t,n,B,ce,o,de));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var et in a)ce=a[et],a.hasOwnProperty(et)&&ce!=null&&!o.hasOwnProperty(et)&&kt(t,n,et,null,o,ce);for(oe in o)if(ce=o[oe],de=a[oe],o.hasOwnProperty(oe)&&ce!==de&&(ce!=null||de!=null))switch(oe){case"children":case"dangerouslySetInnerHTML":if(ce!=null)throw Error(s(137,n));break;default:kt(t,n,oe,ce,o,de)}return;default:if(_i(n)){for(var Xt in a)ce=a[Xt],a.hasOwnProperty(Xt)&&ce!==void 0&&!o.hasOwnProperty(Xt)&&cd(t,n,Xt,void 0,o,ce);for(xe in o)ce=o[xe],de=a[xe],!o.hasOwnProperty(xe)||ce===de||ce===void 0&&de===void 0||cd(t,n,xe,ce,o,de);return}}for(var Q in a)ce=a[Q],a.hasOwnProperty(Q)&&ce!=null&&!o.hasOwnProperty(Q)&&kt(t,n,Q,null,o,ce);for(Me in o)ce=o[Me],de=a[Me],!o.hasOwnProperty(Me)||ce===de||ce==null&&de==null||kt(t,n,Me,ce,o,de)}function U0(t){switch(t){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function jS(){if(typeof performance.getEntriesByType=="function"){for(var t=0,n=0,a=performance.getEntriesByType("resource"),o=0;o<a.length;o++){var u=a[o],p=u.transferSize,S=u.initiatorType,C=u.duration;if(p&&C&&U0(S)){for(S=0,C=u.responseEnd,o+=1;o<a.length;o++){var B=a[o],oe=B.startTime;if(oe>C)break;var xe=B.transferSize,Me=B.initiatorType;xe&&U0(Me)&&(B=B.responseEnd,S+=xe*(B<C?1:(C-oe)/(B-oe)))}if(--o,n+=8*(p+S)/(u.duration/1e3),t++,10<t)break}}if(0<t)return n/t/1e6}return navigator.connection&&(t=navigator.connection.downlink,typeof t=="number")?t:5}var ud=null,fd=null;function oc(t){return t.nodeType===9?t:t.ownerDocument}function L0(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function O0(t,n){if(t===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&n==="foreignObject"?0:t}function dd(t,n){return t==="textarea"||t==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var hd=null;function KS(){var t=window.event;return t&&t.type==="popstate"?t===hd?!1:(hd=t,!0):(hd=null,!1)}var P0=typeof setTimeout=="function"?setTimeout:void 0,QS=typeof clearTimeout=="function"?clearTimeout:void 0,I0=typeof Promise=="function"?Promise:void 0,JS=typeof queueMicrotask=="function"?queueMicrotask:typeof I0<"u"?function(t){return I0.resolve(null).then(t).catch($S)}:P0;function $S(t){setTimeout(function(){throw t})}function ts(t){return t==="head"}function F0(t,n){var a=n,o=0;do{var u=a.nextSibling;if(t.removeChild(a),u&&u.nodeType===8)if(a=u.data,a==="/$"||a==="/&"){if(o===0){t.removeChild(u),br(n);return}o--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")o++;else if(a==="html")Io(t.ownerDocument.documentElement);else if(a==="head"){a=t.ownerDocument.head,Io(a);for(var p=a.firstChild;p;){var S=p.nextSibling,C=p.nodeName;p[Oa]||C==="SCRIPT"||C==="STYLE"||C==="LINK"&&p.rel.toLowerCase()==="stylesheet"||a.removeChild(p),p=S}}else a==="body"&&Io(t.ownerDocument.body);a=u}while(a);br(n)}function B0(t,n){var a=t;t=0;do{var o=a.nextSibling;if(a.nodeType===1?n?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(n?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),o&&o.nodeType===8)if(a=o.data,a==="/$"){if(t===0)break;t--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||t++;a=o}while(a)}function pd(t){var n=t.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":pd(a),Pa(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}t.removeChild(a)}}function ey(t,n,a,o){for(;t.nodeType===1;){var u=a;if(t.nodeName.toLowerCase()!==n.toLowerCase()){if(!o&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(o){if(!t[Oa])switch(n){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(p=t.getAttribute("rel"),p==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(p!==u.rel||t.getAttribute("href")!==(u.href==null||u.href===""?null:u.href)||t.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin)||t.getAttribute("title")!==(u.title==null?null:u.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(p=t.getAttribute("src"),(p!==(u.src==null?null:u.src)||t.getAttribute("type")!==(u.type==null?null:u.type)||t.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin))&&p&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(n==="input"&&t.type==="hidden"){var p=u.name==null?null:""+u.name;if(u.type==="hidden"&&t.getAttribute("name")===p)return t}else return t;if(t=Ti(t.nextSibling),t===null)break}return null}function ty(t,n,a){if(n==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!a||(t=Ti(t.nextSibling),t===null))return null;return t}function z0(t,n){for(;t.nodeType!==8;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!n||(t=Ti(t.nextSibling),t===null))return null;return t}function md(t){return t.data==="$?"||t.data==="$~"}function gd(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState!=="loading"}function ny(t,n){var a=t.ownerDocument;if(t.data==="$~")t._reactRetry=n;else if(t.data!=="$?"||a.readyState!=="loading")n();else{var o=function(){n(),a.removeEventListener("DOMContentLoaded",o)};a.addEventListener("DOMContentLoaded",o),t._reactRetry=o}}function Ti(t){for(;t!=null;t=t.nextSibling){var n=t.nodeType;if(n===1||n===3)break;if(n===8){if(n=t.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return t}var _d=null;function H0(t){t=t.nextSibling;for(var n=0;t;){if(t.nodeType===8){var a=t.data;if(a==="/$"||a==="/&"){if(n===0)return Ti(t.nextSibling);n--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||n++}t=t.nextSibling}return null}function G0(t){t=t.previousSibling;for(var n=0;t;){if(t.nodeType===8){var a=t.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(n===0)return t;n--}else a!=="/$"&&a!=="/&"||n++}t=t.previousSibling}return null}function V0(t,n,a){switch(n=oc(a),t){case"html":if(t=n.documentElement,!t)throw Error(s(452));return t;case"head":if(t=n.head,!t)throw Error(s(453));return t;case"body":if(t=n.body,!t)throw Error(s(454));return t;default:throw Error(s(451))}}function Io(t){for(var n=t.attributes;n.length;)t.removeAttributeNode(n[0]);Pa(t)}var Ai=new Map,k0=new Set;function lc(t){return typeof t.getRootNode=="function"?t.getRootNode():t.nodeType===9?t:t.ownerDocument}var ya=V.d;V.d={f:iy,r:ay,D:sy,C:ry,L:oy,m:ly,X:uy,S:cy,M:fy};function iy(){var t=ya.f(),n=$l();return t||n}function ay(t){var n=sa(t);n!==null&&n.tag===5&&n.type==="form"?rg(n):ya.r(t)}var Sr=typeof document>"u"?null:document;function X0(t,n,a){var o=Sr;if(o&&typeof n=="string"&&n){var u=dt(n);u='link[rel="'+t+'"][href="'+u+'"]',typeof a=="string"&&(u+='[crossorigin="'+a+'"]'),k0.has(u)||(k0.add(u),t={rel:t,crossOrigin:a,href:n},o.querySelector(u)===null&&(n=o.createElement("link"),Un(n,"link",t),dn(n),o.head.appendChild(n)))}}function sy(t){ya.D(t),X0("dns-prefetch",t,null)}function ry(t,n){ya.C(t,n),X0("preconnect",t,n)}function oy(t,n,a){ya.L(t,n,a);var o=Sr;if(o&&t&&n){var u='link[rel="preload"][as="'+dt(n)+'"]';n==="image"&&a&&a.imageSrcSet?(u+='[imagesrcset="'+dt(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(u+='[imagesizes="'+dt(a.imageSizes)+'"]')):u+='[href="'+dt(t)+'"]';var p=u;switch(n){case"style":p=yr(t);break;case"script":p=Mr(t)}Ai.has(p)||(t=_({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:t,as:n},a),Ai.set(p,t),o.querySelector(u)!==null||n==="style"&&o.querySelector(Fo(p))||n==="script"&&o.querySelector(Bo(p))||(n=o.createElement("link"),Un(n,"link",t),dn(n),o.head.appendChild(n)))}}function ly(t,n){ya.m(t,n);var a=Sr;if(a&&t){var o=n&&typeof n.as=="string"?n.as:"script",u='link[rel="modulepreload"][as="'+dt(o)+'"][href="'+dt(t)+'"]',p=u;switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":p=Mr(t)}if(!Ai.has(p)&&(t=_({rel:"modulepreload",href:t},n),Ai.set(p,t),a.querySelector(u)===null)){switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Bo(p)))return}o=a.createElement("link"),Un(o,"link",t),dn(o),a.head.appendChild(o)}}}function cy(t,n,a){ya.S(t,n,a);var o=Sr;if(o&&t){var u=Ia(o).hoistableStyles,p=yr(t);n=n||"default";var S=u.get(p);if(!S){var C={loading:0,preload:null};if(S=o.querySelector(Fo(p)))C.loading=5;else{t=_({rel:"stylesheet",href:t,"data-precedence":n},a),(a=Ai.get(p))&&vd(t,a);var B=S=o.createElement("link");dn(B),Un(B,"link",t),B._p=new Promise(function(oe,xe){B.onload=oe,B.onerror=xe}),B.addEventListener("load",function(){C.loading|=1}),B.addEventListener("error",function(){C.loading|=2}),C.loading|=4,cc(S,n,o)}S={type:"stylesheet",instance:S,count:1,state:C},u.set(p,S)}}}function uy(t,n){ya.X(t,n);var a=Sr;if(a&&t){var o=Ia(a).hoistableScripts,u=Mr(t),p=o.get(u);p||(p=a.querySelector(Bo(u)),p||(t=_({src:t,async:!0},n),(n=Ai.get(u))&&xd(t,n),p=a.createElement("script"),dn(p),Un(p,"link",t),a.head.appendChild(p)),p={type:"script",instance:p,count:1,state:null},o.set(u,p))}}function fy(t,n){ya.M(t,n);var a=Sr;if(a&&t){var o=Ia(a).hoistableScripts,u=Mr(t),p=o.get(u);p||(p=a.querySelector(Bo(u)),p||(t=_({src:t,async:!0,type:"module"},n),(n=Ai.get(u))&&xd(t,n),p=a.createElement("script"),dn(p),Un(p,"link",t),a.head.appendChild(p)),p={type:"script",instance:p,count:1,state:null},o.set(u,p))}}function W0(t,n,a,o){var u=(u=Xe.current)?lc(u):null;if(!u)throw Error(s(446));switch(t){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(n=yr(a.href),a=Ia(u).hoistableStyles,o=a.get(n),o||(o={type:"style",instance:null,count:0,state:null},a.set(n,o)),o):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){t=yr(a.href);var p=Ia(u).hoistableStyles,S=p.get(t);if(S||(u=u.ownerDocument||u,S={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},p.set(t,S),(p=u.querySelector(Fo(t)))&&!p._p&&(S.instance=p,S.state.loading=5),Ai.has(t)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},Ai.set(t,a),p||dy(u,t,a,S.state))),n&&o===null)throw Error(s(528,""));return S}if(n&&o!==null)throw Error(s(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(n=Mr(a),a=Ia(u).hoistableScripts,o=a.get(n),o||(o={type:"script",instance:null,count:0,state:null},a.set(n,o)),o):{type:"void",instance:null,count:0,state:null};default:throw Error(s(444,t))}}function yr(t){return'href="'+dt(t)+'"'}function Fo(t){return'link[rel="stylesheet"]['+t+"]"}function Y0(t){return _({},t,{"data-precedence":t.precedence,precedence:null})}function dy(t,n,a,o){t.querySelector('link[rel="preload"][as="style"]['+n+"]")?o.loading=1:(n=t.createElement("link"),o.preload=n,n.addEventListener("load",function(){return o.loading|=1}),n.addEventListener("error",function(){return o.loading|=2}),Un(n,"link",a),dn(n),t.head.appendChild(n))}function Mr(t){return'[src="'+dt(t)+'"]'}function Bo(t){return"script[async]"+t}function q0(t,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var o=t.querySelector('style[data-href~="'+dt(a.href)+'"]');if(o)return n.instance=o,dn(o),o;var u=_({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return o=(t.ownerDocument||t).createElement("style"),dn(o),Un(o,"style",u),cc(o,a.precedence,t),n.instance=o;case"stylesheet":u=yr(a.href);var p=t.querySelector(Fo(u));if(p)return n.state.loading|=4,n.instance=p,dn(p),p;o=Y0(a),(u=Ai.get(u))&&vd(o,u),p=(t.ownerDocument||t).createElement("link"),dn(p);var S=p;return S._p=new Promise(function(C,B){S.onload=C,S.onerror=B}),Un(p,"link",o),n.state.loading|=4,cc(p,a.precedence,t),n.instance=p;case"script":return p=Mr(a.src),(u=t.querySelector(Bo(p)))?(n.instance=u,dn(u),u):(o=a,(u=Ai.get(p))&&(o=_({},a),xd(o,u)),t=t.ownerDocument||t,u=t.createElement("script"),dn(u),Un(u,"link",o),t.head.appendChild(u),n.instance=u);case"void":return null;default:throw Error(s(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(o=n.instance,n.state.loading|=4,cc(o,a.precedence,t));return n.instance}function cc(t,n,a){for(var o=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),u=o.length?o[o.length-1]:null,p=u,S=0;S<o.length;S++){var C=o[S];if(C.dataset.precedence===n)p=C;else if(p!==u)break}p?p.parentNode.insertBefore(t,p.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(t,n.firstChild))}function vd(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.title==null&&(t.title=n.title)}function xd(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.integrity==null&&(t.integrity=n.integrity)}var uc=null;function Z0(t,n,a){if(uc===null){var o=new Map,u=uc=new Map;u.set(a,o)}else u=uc,o=u.get(a),o||(o=new Map,u.set(a,o));if(o.has(t))return o;for(o.set(t,null),a=a.getElementsByTagName(t),u=0;u<a.length;u++){var p=a[u];if(!(p[Oa]||p[fn]||t==="link"&&p.getAttribute("rel")==="stylesheet")&&p.namespaceURI!=="http://www.w3.org/2000/svg"){var S=p.getAttribute(n)||"";S=t+S;var C=o.get(S);C?C.push(p):o.set(S,[p])}}return o}function j0(t,n,a){t=t.ownerDocument||t,t.head.insertBefore(a,n==="title"?t.querySelector("head > title"):null)}function hy(t,n,a){if(a===1||n.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;return n.rel==="stylesheet"?(t=n.disabled,typeof n.precedence=="string"&&t==null):!0;case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function K0(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}function py(t,n,a,o){if(a.type==="stylesheet"&&(typeof o.media!="string"||matchMedia(o.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var u=yr(o.href),p=n.querySelector(Fo(u));if(p){n=p._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(t.count++,t=fc.bind(t),n.then(t,t)),a.state.loading|=4,a.instance=p,dn(p);return}p=n.ownerDocument||n,o=Y0(o),(u=Ai.get(u))&&vd(o,u),p=p.createElement("link"),dn(p);var S=p;S._p=new Promise(function(C,B){S.onload=C,S.onerror=B}),Un(p,"link",o),a.instance=p}t.stylesheets===null&&(t.stylesheets=new Map),t.stylesheets.set(a,n),(n=a.state.preload)&&(a.state.loading&3)===0&&(t.count++,a=fc.bind(t),n.addEventListener("load",a),n.addEventListener("error",a))}}var Sd=0;function my(t,n){return t.stylesheets&&t.count===0&&hc(t,t.stylesheets),0<t.count||0<t.imgCount?function(a){var o=setTimeout(function(){if(t.stylesheets&&hc(t,t.stylesheets),t.unsuspend){var p=t.unsuspend;t.unsuspend=null,p()}},6e4+n);0<t.imgBytes&&Sd===0&&(Sd=62500*jS());var u=setTimeout(function(){if(t.waitingForImages=!1,t.count===0&&(t.stylesheets&&hc(t,t.stylesheets),t.unsuspend)){var p=t.unsuspend;t.unsuspend=null,p()}},(t.imgBytes>Sd?50:800)+n);return t.unsuspend=a,function(){t.unsuspend=null,clearTimeout(o),clearTimeout(u)}}:null}function fc(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)hc(this,this.stylesheets);else if(this.unsuspend){var t=this.unsuspend;this.unsuspend=null,t()}}}var dc=null;function hc(t,n){t.stylesheets=null,t.unsuspend!==null&&(t.count++,dc=new Map,n.forEach(gy,t),dc=null,fc.call(t))}function gy(t,n){if(!(n.state.loading&4)){var a=dc.get(t);if(a)var o=a.get(null);else{a=new Map,dc.set(t,a);for(var u=t.querySelectorAll("link[data-precedence],style[data-precedence]"),p=0;p<u.length;p++){var S=u[p];(S.nodeName==="LINK"||S.getAttribute("media")!=="not all")&&(a.set(S.dataset.precedence,S),o=S)}o&&a.set(null,o)}u=n.instance,S=u.getAttribute("data-precedence"),p=a.get(S)||o,p===o&&a.set(null,u),a.set(S,u),this.count++,o=fc.bind(this),u.addEventListener("load",o),u.addEventListener("error",o),p?p.parentNode.insertBefore(u,p.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(u,t.firstChild)),n.state.loading|=4}}var zo={$$typeof:G,Provider:null,Consumer:null,_currentValue:ue,_currentValue2:ue,_threadCount:0};function _y(t,n,a,o,u,p,S,C,B){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Ke(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ke(0),this.hiddenUpdates=Ke(null),this.identifierPrefix=o,this.onUncaughtError=u,this.onCaughtError=p,this.onRecoverableError=S,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=B,this.incompleteTransitions=new Map}function Q0(t,n,a,o,u,p,S,C,B,oe,xe,Me){return t=new _y(t,n,a,S,B,oe,xe,Me,C),n=1,p===!0&&(n|=24),p=li(3,null,null,n),t.current=p,p.stateNode=t,n=Ju(),n.refCount++,t.pooledCache=n,n.refCount++,p.memoizedState={element:o,isDehydrated:a,cache:n},nf(p),t}function J0(t){return t?(t=$s,t):$s}function $0(t,n,a,o,u,p){u=J0(u),o.context===null?o.context=u:o.pendingContext=u,o=Xa(n),o.payload={element:a},p=p===void 0?null:p,p!==null&&(o.callback=p),a=Wa(t,o,n),a!==null&&($n(a,t,n),_o(a,t,n))}function e_(t,n){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var a=t.retryLane;t.retryLane=a!==0&&a<n?a:n}}function yd(t,n){e_(t,n),(t=t.alternate)&&e_(t,n)}function t_(t){if(t.tag===13||t.tag===31){var n=bs(t,67108864);n!==null&&$n(n,t,67108864),yd(t,67108864)}}function n_(t){if(t.tag===13||t.tag===31){var n=hi();n=Qr(n);var a=bs(t,n);a!==null&&$n(a,t,n),yd(t,n)}}var pc=!0;function vy(t,n,a,o){var u=F.T;F.T=null;var p=V.p;try{V.p=2,Md(t,n,a,o)}finally{V.p=p,F.T=u}}function xy(t,n,a,o){var u=F.T;F.T=null;var p=V.p;try{V.p=8,Md(t,n,a,o)}finally{V.p=p,F.T=u}}function Md(t,n,a,o){if(pc){var u=bd(o);if(u===null)ld(t,n,o,mc,a),a_(t,o);else if(yy(u,t,n,a,o))o.stopPropagation();else if(a_(t,o),n&4&&-1<Sy.indexOf(t)){for(;u!==null;){var p=sa(u);if(p!==null)switch(p.tag){case 3:if(p=p.stateNode,p.current.memoizedState.isDehydrated){var S=Ce(p.pendingLanes);if(S!==0){var C=p;for(C.pendingLanes|=2,C.entangledLanes|=2;S;){var B=1<<31-Ge(S);C.entanglements[1]|=B,S&=~B}Yi(p),(Lt&6)===0&&(Ql=Pt()+500,Lo(0))}}break;case 31:case 13:C=bs(p,2),C!==null&&$n(C,p,2),$l(),yd(p,2)}if(p=bd(o),p===null&&ld(t,n,o,mc,a),p===u)break;u=p}u!==null&&o.stopPropagation()}else ld(t,n,o,null,a)}}function bd(t){return t=Eu(t),Ed(t)}var mc=null;function Ed(t){if(mc=null,t=aa(t),t!==null){var n=c(t);if(n===null)t=null;else{var a=n.tag;if(a===13){if(t=f(n),t!==null)return t;t=null}else if(a===31){if(t=m(n),t!==null)return t;t=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;t=null}else n!==t&&(t=null)}}return mc=t,null}function i_(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Nt()){case O:return 2;case E:return 8;case J:case le:return 32;case pe:return 268435456;default:return 32}default:return 32}}var Td=!1,ns=null,is=null,as=null,Ho=new Map,Go=new Map,ss=[],Sy="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function a_(t,n){switch(t){case"focusin":case"focusout":ns=null;break;case"dragenter":case"dragleave":is=null;break;case"mouseover":case"mouseout":as=null;break;case"pointerover":case"pointerout":Ho.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":Go.delete(n.pointerId)}}function Vo(t,n,a,o,u,p){return t===null||t.nativeEvent!==p?(t={blockedOn:n,domEventName:a,eventSystemFlags:o,nativeEvent:p,targetContainers:[u]},n!==null&&(n=sa(n),n!==null&&t_(n)),t):(t.eventSystemFlags|=o,n=t.targetContainers,u!==null&&n.indexOf(u)===-1&&n.push(u),t)}function yy(t,n,a,o,u){switch(n){case"focusin":return ns=Vo(ns,t,n,a,o,u),!0;case"dragenter":return is=Vo(is,t,n,a,o,u),!0;case"mouseover":return as=Vo(as,t,n,a,o,u),!0;case"pointerover":var p=u.pointerId;return Ho.set(p,Vo(Ho.get(p)||null,t,n,a,o,u)),!0;case"gotpointercapture":return p=u.pointerId,Go.set(p,Vo(Go.get(p)||null,t,n,a,o,u)),!0}return!1}function s_(t){var n=aa(t.target);if(n!==null){var a=c(n);if(a!==null){if(n=a.tag,n===13){if(n=f(a),n!==null){t.blockedOn=n,Ys(t.priority,function(){n_(a)});return}}else if(n===31){if(n=m(a),n!==null){t.blockedOn=n,Ys(t.priority,function(){n_(a)});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){t.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}t.blockedOn=null}function gc(t){if(t.blockedOn!==null)return!1;for(var n=t.targetContainers;0<n.length;){var a=bd(t.nativeEvent);if(a===null){a=t.nativeEvent;var o=new a.constructor(a.type,a);bu=o,a.target.dispatchEvent(o),bu=null}else return n=sa(a),n!==null&&t_(n),t.blockedOn=a,!1;n.shift()}return!0}function r_(t,n,a){gc(t)&&a.delete(n)}function My(){Td=!1,ns!==null&&gc(ns)&&(ns=null),is!==null&&gc(is)&&(is=null),as!==null&&gc(as)&&(as=null),Ho.forEach(r_),Go.forEach(r_)}function _c(t,n){t.blockedOn===n&&(t.blockedOn=null,Td||(Td=!0,r.unstable_scheduleCallback(r.unstable_NormalPriority,My)))}var vc=null;function o_(t){vc!==t&&(vc=t,r.unstable_scheduleCallback(r.unstable_NormalPriority,function(){vc===t&&(vc=null);for(var n=0;n<t.length;n+=3){var a=t[n],o=t[n+1],u=t[n+2];if(typeof o!="function"){if(Ed(o||a)===null)continue;break}var p=sa(a);p!==null&&(t.splice(n,3),n-=3,bf(p,{pending:!0,data:u,method:a.method,action:o},o,u))}}))}function br(t){function n(B){return _c(B,t)}ns!==null&&_c(ns,t),is!==null&&_c(is,t),as!==null&&_c(as,t),Ho.forEach(n),Go.forEach(n);for(var a=0;a<ss.length;a++){var o=ss[a];o.blockedOn===t&&(o.blockedOn=null)}for(;0<ss.length&&(a=ss[0],a.blockedOn===null);)s_(a),a.blockedOn===null&&ss.shift();if(a=(t.ownerDocument||t).$$reactFormReplay,a!=null)for(o=0;o<a.length;o+=3){var u=a[o],p=a[o+1],S=u[Cn]||null;if(typeof p=="function")S||o_(a);else if(S){var C=null;if(p&&p.hasAttribute("formAction")){if(u=p,S=p[Cn]||null)C=S.formAction;else if(Ed(u)!==null)continue}else C=S.action;typeof C=="function"?a[o+1]=C:(a.splice(o,3),o-=3),o_(a)}}}function l_(){function t(p){p.canIntercept&&p.info==="react-transition"&&p.intercept({handler:function(){return new Promise(function(S){return u=S})},focusReset:"manual",scroll:"manual"})}function n(){u!==null&&(u(),u=null),o||setTimeout(a,20)}function a(){if(!o&&!navigation.transition){var p=navigation.currentEntry;p&&p.url!=null&&navigation.navigate(p.url,{state:p.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var o=!1,u=null;return navigation.addEventListener("navigate",t),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(a,100),function(){o=!0,navigation.removeEventListener("navigate",t),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),u!==null&&(u(),u=null)}}}function Ad(t){this._internalRoot=t}xc.prototype.render=Ad.prototype.render=function(t){var n=this._internalRoot;if(n===null)throw Error(s(409));var a=n.current,o=hi();$0(a,o,t,n,null,null)},xc.prototype.unmount=Ad.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var n=t.containerInfo;$0(t.current,2,null,t,null,null),$l(),n[qn]=null}};function xc(t){this._internalRoot=t}xc.prototype.unstable_scheduleHydration=function(t){if(t){var n=$r();t={blockedOn:null,target:t,priority:n};for(var a=0;a<ss.length&&n!==0&&n<ss[a].priority;a++);ss.splice(a,0,t),a===0&&s_(t)}};var c_=e.version;if(c_!=="19.2.8")throw Error(s(527,c_,"19.2.8"));V.findDOMNode=function(t){var n=t._reactInternals;if(n===void 0)throw typeof t.render=="function"?Error(s(188)):(t=Object.keys(t).join(","),Error(s(268,t)));return t=d(n),t=t!==null?g(t):null,t=t===null?null:t.stateNode,t};var by={bundleType:0,version:"19.2.8",rendererPackageName:"react-dom",currentDispatcherRef:F,reconcilerVersion:"19.2.8"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Sc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Sc.isDisabled&&Sc.supportsFiber)try{me=Sc.inject(by),ge=Sc}catch{}}return Xo.createRoot=function(t,n){if(!l(t))throw Error(s(299));var a=!1,o="",u=gg,p=_g,S=vg;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onUncaughtError!==void 0&&(u=n.onUncaughtError),n.onCaughtError!==void 0&&(p=n.onCaughtError),n.onRecoverableError!==void 0&&(S=n.onRecoverableError)),n=Q0(t,1,!1,null,null,a,o,null,u,p,S,l_),t[qn]=n.current,od(t),new Ad(n)},Xo.hydrateRoot=function(t,n,a){if(!l(t))throw Error(s(299));var o=!1,u="",p=gg,S=_g,C=vg,B=null;return a!=null&&(a.unstable_strictMode===!0&&(o=!0),a.identifierPrefix!==void 0&&(u=a.identifierPrefix),a.onUncaughtError!==void 0&&(p=a.onUncaughtError),a.onCaughtError!==void 0&&(S=a.onCaughtError),a.onRecoverableError!==void 0&&(C=a.onRecoverableError),a.formState!==void 0&&(B=a.formState)),n=Q0(t,1,!0,n,a??null,o,u,B,p,S,C,l_),n.context=J0(null),a=n.current,o=hi(),o=Qr(o),u=Xa(o),u.callback=null,Wa(a,u,o),a=o,n.current.lanes=a,We(n,a),Yi(n),t[qn]=n.current,od(t),new xc(n)},Xo.version="19.2.8",Xo}var x_;function Oy(){if(x_)return wd.exports;x_=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),wd.exports=Ly(),wd.exports}var Py=Oy();const S_=r=>{let e;const i=new Set,s=(d,g)=>{const _=typeof d=="function"?d(e):d;if(!Object.is(_,e)){const v=e;e=g??(typeof _!="object"||_===null)?_:Object.assign({},e,_),i.forEach(y=>y(e,v))}},l=()=>e,m={setState:s,getState:l,getInitialState:()=>h,subscribe:d=>(i.add(d),()=>i.delete(d))},h=e=r(s,l,m);return m},Iy=(r=>r?S_(r):S_),Fy=r=>r;function By(r,e=Fy){const i=yc.useSyncExternalStore(r.subscribe,yc.useCallback(()=>e(r.getState()),[r,e]),yc.useCallback(()=>e(r.getInitialState()),[r,e]));return yc.useDebugValue(i),i}const y_=r=>{const e=Iy(r),i=s=>By(e,s);return Object.assign(i,e),i},Ov=(r=>r?y_(r):y_);class zy{worker;nextId=1;pending=new Map;initPromise=null;constructor(){this.worker=new Worker(new URL("/assets/worker-Bq_51t8T.js",import.meta.url),{type:"module"}),this.worker.onmessage=e=>{this.handleResponse(e.data)},this.worker.onerror=e=>{const i=new Error(`Kernel worker error: ${e.message??"unknown"}`);for(const[,s]of this.pending)s.reject(i);this.pending.clear()}}handleResponse(e){const i=this.pending.get(e.id);if(i)if(this.pending.delete(e.id),e.ok)i.resolve(e.result);else{const s=new Error(e.error.message);e.error.code!==void 0&&(s.code=e.error.code),i.reject(s)}}send(e){const i=this.nextId++,s={id:i,command:e};return new Promise((l,c)=>{this.pending.set(i,{resolve:l,reject:c}),this.worker.postMessage(s)})}init(){return this.initPromise||(this.initPromise=this.send({op:"init"})),this.initPromise}async makeBox(e,i,s,l){await this.init();const c={op:"makeBox",dx:e,dy:i,dz:s,quality:l};return this.send(c)}async regenerate(e,i){await this.init();const s={op:"regenerate",tree:e,quality:i};return this.send(s)}async exportShape(e,i){await this.init();const s={op:"export",format:i,tree:e};return this.send(s)}dispose(){this.worker.terminate(),this.pending.clear()}}function Pv(r){return r.type==="box"||r.type==="cylinder"||r.type==="extrude"||r.type==="linked"}function _h(r){return r.type==="fillet"||r.type==="chamfer"}function Iv(r){return r.type==="mirror"||r.type==="linearPattern"||r.type==="circularPattern"}let M_=0;function Wn(){M_+=1;const r=Math.floor(Math.random()*65535).toString(16).padStart(4,"0");return`f${M_}_${r}`}function Hy(r,e,i){const s={id:Wn(),suppressed:!1,operation:i,position:{x:0,y:0,z:0}};switch(r){case"box":return{...s,type:"box",name:`Box ${e}`,params:{dx:40,dy:30,dz:20}};case"cylinder":return{...s,type:"cylinder",name:`Cylinder ${e}`,params:{radius:15,height:40}};default:{const l=r;throw new Error(`Unknown feature type: ${String(l)}`)}}}function Gy(r,e){return{id:Wn(),type:"sketch",name:`Sketch ${e}`,suppressed:!1,planeId:r.planeId,sketch:r}}function Vy(r,e,i){return{id:Wn(),type:"extrude",name:`Extrude ${e}`,suppressed:!1,sketchId:r,operation:i,params:{distance:20,flip:!1}}}function ky(r,e){return{id:Wn(),type:"fillet",name:`Fillet ${e}`,suppressed:!1,edgeRefs:[...r],params:{radius:3}}}function Xy(r,e){return{id:Wn(),type:"chamfer",name:`Chamfer ${e}`,suppressed:!1,edgeRefs:[...r],params:{distance:3}}}function Wy(r){return{id:Wn(),type:"mirror",name:`Mirror ${r}`,suppressed:!1,params:{plane:"YZ",keepOriginal:!0}}}function Yy(r){return{id:Wn(),type:"linearPattern",name:`Linear Pattern ${r}`,suppressed:!1,params:{axis:"x",count:3,spacing:50}}}function qy(r){return{id:Wn(),type:"circularPattern",name:`Circular Pattern ${r}`,suppressed:!1,params:{axis:"z",count:4,angle:360}}}function Zy(r,e,i,s,l,c){return{id:Wn(),type:"linked",name:`Reference ${l}`,suppressed:!1,sourceDocId:r,sourceTabId:e,sourceLabel:i,cachedTree:s,operation:c}}function vh(){return{nodes:[],headId:null}}function jy(r){const e=new Map(r.nodes.map(c=>[c.id,c])),i=[];let s=r.headId?e.get(r.headId):void 0;const l=new Set;for(;s&&!l.has(s.id);)l.add(s.id),i.push(s),s=s.parentId?e.get(s.parentId):void 0;return i.reverse()}function Ky(r){return`V${r.nodes.length+1}`}const Fv=2;function Bv(r){return{id:Wn(),name:r,tree:{features:[]},history:vh()}}function b_(r="Untitled"){const e=Bv("Part Studio 1");return{id:Wn(),name:r,tabs:[e],activeTabId:e.id,schemaVersion:Fv}}function os(r){return r.tabs.find(e=>e.id===r.activeTabId)??r.tabs[0]}function Qy(r){const e=r;if(e&&Array.isArray(e.tabs)&&typeof e.activeTabId=="string"){const l=e.tabs.map(c=>({...c,history:c.history??vh()}));return{...e,tabs:l}}const i=e?.tree??{features:[]},s={id:Wn(),name:"Part Studio 1",tree:i,history:vh()};return{id:e?.id??Wn(),name:e?.name??"Untitled",tabs:[s],activeTabId:s.id,schemaVersion:Fv}}const Jy="mycad",$y=1,ou="documents";let Mc=null;function eM(){return Mc||(Mc=new Promise((r,e)=>{const i=indexedDB.open(Jy,$y);i.onupgradeneeded=()=>{const s=i.result;s.objectStoreNames.contains(ou)||s.createObjectStore(ou,{keyPath:"id"})},i.onsuccess=()=>r(i.result),i.onerror=()=>e(i.error??new Error("IndexedDB open failed"))}),Mc)}async function up(r,e){const i=await eM();return new Promise((s,l)=>{const f=i.transaction(ou,r).objectStore(ou),m=e(f);m.onsuccess=()=>s(m.result),m.onerror=()=>l(m.error??new Error("IndexedDB request failed"))})}async function tM(r,e){const i={id:r.id,doc:r,name:r.name,updatedAt:e};await up("readwrite",s=>s.put(i))}async function Kc(r){const e=await up("readonly",i=>i.get(r));return e?Qy(e.doc):null}async function fp(){return(await up("readonly",e=>e.getAll())).map(e=>({id:e.id,name:e.name,updatedAt:e.updatedAt})).sort((e,i)=>i.updatedAt-e.updatedAt)}let Ld=null;const nM=80;let Ma=null;const Od=800,Gr=new Map,iM=50,aM=500;function Er(r){let e=Gr.get(r);return e||(e={undo:[],redo:[],lastSnapshotAt:0},Gr.set(r,e)),e}function Tr(r){return structuredClone(r)}const Ze=Ov((r,e)=>{const i=()=>{const h=Er(e().doc.activeTabId);r({canUndo:h.undo.length>0,canRedo:h.redo.length>0})},s=h=>{const d=e().doc,g=d.tabs.map(_=>_.id===d.activeTabId?{..._,tree:h}:_);return{...d,tabs:g}},l=h=>{const d=e().doc,g=d.tabs.map(_=>_.id===d.activeTabId?{..._,history:h}:_);return{...d,tabs:g}},c=h=>{const d=performance.now(),g=Er(e().doc.activeTabId);if(h&&d-g.lastSnapshotAt<aM&&g.undo.length>0){g.lastSnapshotAt=d;return}g.undo.push(Tr(e().tree)),g.undo.length>iM&&g.undo.shift(),g.redo.length=0,g.lastSnapshotAt=d,i()},f=(h,d=!1)=>{if(e().viewingVersionId!==null)return;c(d);const g={features:h};r({tree:g,doc:s(g)}),Ld&&clearTimeout(Ld),Ld=setTimeout(()=>{e().regenerate()},nM),Ma&&clearTimeout(Ma),Ma=setTimeout(()=>{e().saveDoc()},Od)},m=b_();return{client:new zy,ready:!1,busy:!1,error:null,doc:m,tree:os(m).tree,selectedId:null,statuses:{},shape:null,selectedEdgeRefs:[],lastSavedAt:null,canUndo:!1,canRedo:!1,viewingVersionId:null,initKernel:async()=>{r({busy:!0,error:null});try{await e().client.init(),r({ready:!0})}catch(h){r({error:h instanceof Error?h.message:String(h)})}finally{r({busy:!1})}},setActiveTab:h=>{const d=e().doc;if(h===d.activeTabId)return;const g=d.tabs.find(v=>v.id===h);if(!g)return;const _=Er(h);r({doc:{...d,activeTabId:h},tree:g.tree,selectedId:null,selectedEdgeRefs:[],statuses:{},canUndo:_.undo.length>0,canRedo:_.redo.length>0,viewingVersionId:null}),e().regenerate(),e().saveDoc()},addTab:()=>{const h=e().doc,d=Bv(`Part Studio ${h.tabs.length+1}`);r({doc:{...h,tabs:[...h.tabs,d]}}),e().setActiveTab(d.id)},renameTab:(h,d)=>{const g=e().doc,_=g.tabs.map(v=>v.id===h?{...v,name:d}:v);r({doc:{...g,tabs:_}}),e().saveDoc()},deleteTab:h=>{const d=e().doc;if(d.tabs.length<=1)return;const g=d.tabs.findIndex(y=>y.id===h);if(g<0)return;const _=d.tabs.filter(y=>y.id!==h);Gr.delete(h);const v=d.activeTabId===h?_[Math.max(0,g-1)].id:d.activeTabId;if(r({doc:{...d,tabs:_,activeTabId:v}}),d.activeTabId===h){const y=_.find(w=>w.id===v),M=Er(v);r({tree:y.tree,selectedId:null,selectedEdgeRefs:[],statuses:{},canUndo:M.undo.length>0,canRedo:M.redo.length>0}),e().regenerate()}e().saveDoc()},addFeature:h=>{const{tree:d}=e(),_=d.features.some(M=>M.type!=="sketch")?"add":"new",v=d.features.filter(M=>M.type===h).length+1,y=Hy(h,v,_);f([...d.features,y]),r({selectedId:y.id})},addSketchFeature:h=>{const{tree:d}=e(),g=d.features.filter(v=>v.type==="sketch").length+1,_=Gy(h,g);return f([...d.features,_]),r({selectedId:_.id}),_.id},updateSketch:(h,d)=>{const g=e().tree.features.map(_=>_.id===h&&_.type==="sketch"?{..._,planeId:d.planeId,sketch:d}:_);f(g),r({selectedId:h})},addExtrude:h=>{const{tree:d}=e(),_=d.features.some(M=>M.type!=="sketch")?"add":"new",v=d.features.filter(M=>M.type==="extrude").length+1,y=Vy(h,v,_);f([...d.features,y]),r({selectedId:y.id})},setSelectedEdges:h=>r({selectedEdgeRefs:h}),addFillet:()=>{const{tree:h,selectedEdgeRefs:d}=e();if(d.length===0)return;const g=h.features.filter(v=>v.type==="fillet").length+1,_=ky(d,g);f([...h.features,_]),r({selectedId:_.id,selectedEdgeRefs:[]})},addChamfer:()=>{const{tree:h,selectedEdgeRefs:d}=e();if(d.length===0)return;const g=h.features.filter(v=>v.type==="chamfer").length+1,_=Xy(d,g);f([...h.features,_]),r({selectedId:_.id,selectedEdgeRefs:[]})},addMirror:()=>{const{tree:h}=e(),d=h.features.filter(_=>_.type==="mirror").length+1,g=Wy(d);f([...h.features,g]),r({selectedId:g.id})},addLinearPattern:()=>{const{tree:h}=e(),d=h.features.filter(_=>_.type==="linearPattern").length+1,g=Yy(d);f([...h.features,g]),r({selectedId:g.id})},addCircularPattern:()=>{const{tree:h}=e(),d=h.features.filter(_=>_.type==="circularPattern").length+1,g=qy(d);f([...h.features,g]),r({selectedId:g.id})},updateFeature:(h,d)=>{const g=e().tree.features.map(_=>_.id===h?{..._,...d}:_);f(g,!0)},updateParams:(h,d)=>{const g=e().tree.features.map(_=>_.id!==h||_.type==="sketch"||_.type==="linked"?_:{..._,params:{..._.params,...d}});f(g,!0)},setOperation:(h,d)=>{const g=e().tree.features.map(_=>_.id!==h||_.type==="sketch"?_:{..._,operation:d});f(g)},toggleSuppress:h=>{const d=e().tree.features.map(g=>g.id===h?{...g,suppressed:!g.suppressed}:g);f(d)},deleteFeature:h=>{const d=e().tree.features.filter(g=>g.id!==h);f(d),e().selectedId===h&&r({selectedId:null})},moveFeature:(h,d)=>{const g=[...e().tree.features],_=g.findIndex(y=>y.id===h),v=_+d;_<0||v<0||v>=g.length||([g[_],g[v]]=[g[v],g[_]],f(g))},selectFeature:h=>r({selectedId:h}),regenerate:async()=>{const{client:h,tree:d}=e();r({busy:!0,error:null});try{const g=await h.regenerate(d),_={};for(const y of g.statuses)_[y.featureId]=y;const v=g.mesh&&g.edges&&g.bbox?{shapeId:g.shapeId??-1,mesh:g.mesh,edges:g.edges,bbox:g.bbox}:null;r({statuses:_,shape:v})}catch(g){r({error:g instanceof Error?g.message:String(g)})}finally{r({busy:!1})}},exportModel:async h=>{const{client:d,tree:g,doc:_}=e();r({busy:!0,error:null});try{const v=await d.exportShape(g,h),y=os(_).name,M=h==="step"?"application/step":"model/stl",w=new Blob([v.data],{type:M}),b=URL.createObjectURL(w),x=document.createElement("a");x.href=b,x.download=`${sM(`${_.name}-${y}`)}.${h}`,x.click(),URL.revokeObjectURL(b)}catch(v){r({error:v instanceof Error?v.message:String(v)})}finally{r({busy:!1})}},renameDoc:h=>{r({doc:{...e().doc,name:h}}),e().saveDoc()},saveDoc:async()=>{const{doc:h}=e();try{const d=Date.now();await tM(h,d),r({lastSavedAt:d})}catch(d){r({error:d instanceof Error?d.message:String(d)})}},loadDoc:async h=>{try{const d=await Kc(h);if(!d){r({error:`Document ${h} not found`});return}Gr.clear();const g=os(d);r({doc:d,tree:g.tree,selectedId:null,selectedEdgeRefs:[],statuses:{},lastSavedAt:null,canUndo:!1,canRedo:!1}),await e().regenerate()}catch(d){r({error:d instanceof Error?d.message:String(d)})}},newDoc:()=>{Gr.clear();const h=b_();r({doc:h,tree:os(h).tree,selectedId:null,selectedEdgeRefs:[],statuses:{},shape:null,lastSavedAt:null,canUndo:!1,canRedo:!1})},restoreLast:async()=>{try{const h=await fp();h.length>0&&await e().loadDoc(h[0].id)}catch(h){r({error:h instanceof Error?h.message:String(h)})}},undo:()=>{if(e().viewingVersionId!==null)return;const h=Er(e().doc.activeTabId);if(h.undo.length===0)return;h.redo.push(Tr(e().tree));const d=h.undo.pop();r({tree:d,doc:s(d),canUndo:h.undo.length>0,canRedo:h.redo.length>0}),e().regenerate(),Ma&&clearTimeout(Ma),Ma=setTimeout(()=>{e().saveDoc()},Od)},redo:()=>{if(e().viewingVersionId!==null)return;const h=Er(e().doc.activeTabId);if(h.redo.length===0)return;h.undo.push(Tr(e().tree));const d=h.redo.pop();r({tree:d,doc:s(d),canUndo:h.undo.length>0,canRedo:h.redo.length>0}),e().regenerate(),Ma&&clearTimeout(Ma),Ma=setTimeout(()=>{e().saveDoc()},Od)},createVersion:h=>{const d=e().doc,g=os(d),_={id:Wn(),name:h?.trim()||Ky(g.history),parentId:g.history.headId,snapshot:Tr(g.tree),createdAt:Date.now()},v={nodes:[...g.history.nodes,_],headId:_.id};r({doc:l(v)}),e().saveDoc()},openVersion:h=>{const g=os(e().doc).history.nodes.find(_=>_.id===h);g&&(r({viewingVersionId:h,tree:g.snapshot,selectedId:null}),e().regenerate())},exitVersionView:()=>{if(e().viewingVersionId===null)return;const h=os(e().doc);r({viewingVersionId:null,tree:h.tree,selectedId:null}),e().regenerate()},restoreVersion:h=>{const d=e().doc,g=os(d),_=g.history.nodes.find(b=>b.id===h);if(!_)return;const v={id:Wn(),name:`${_.name} (restored)`,parentId:_.id,snapshot:Tr(_.snapshot),createdAt:Date.now()},y={nodes:[...g.history.nodes,v],headId:v.id};Gr.delete(d.activeTabId);const M=Tr(_.snapshot),w=d.tabs.map(b=>b.id===d.activeTabId?{...b,tree:M,history:y}:b);r({doc:{...d,tabs:w},tree:M,viewingVersionId:null,selectedId:null,selectedEdgeRefs:[],canUndo:!1,canRedo:!1}),e().regenerate(),e().saveDoc()},insertReference:async(h,d)=>{try{const g=await Kc(h),_=g?.tabs.find(x=>x.id===d);if(!g||!_){r({error:"Referenced document/tab not found"});return}const{tree:v}=e(),M=v.features.some(x=>x.type!=="sketch")?"add":"new",w=v.features.filter(x=>x.type==="linked").length+1,b=Zy(h,d,`${g.name} / ${_.name}`,structuredClone(_.tree),w,M);f([...v.features,b]),r({selectedId:b.id})}catch(g){r({error:g instanceof Error?g.message:String(g)})}},updateReference:async h=>{const d=e().tree.features.find(g=>g.id===h);if(!(!d||d.type!=="linked"))try{const g=await Kc(d.sourceDocId),_=g?.tabs.find(y=>y.id===d.sourceTabId);if(!g||!_){r({error:"Referenced source no longer exists"});return}const v=e().tree.features.map(y=>y.id===h&&y.type==="linked"?{...y,cachedTree:structuredClone(_.tree),sourceLabel:`${g.name} / ${_.name}`}:y);f(v)}catch(g){r({error:g instanceof Error?g.message:String(g)})}}}});function sM(r){const e=r.replace(/[^\w.\- ]+/g,"_").trim();return e.length>0?e:"model"}function rM(r,e){return{id:r,planeId:e,points:[],entities:[],constraints:[]}}let E_=0;function Ar(r){E_+=1;const e=Math.floor(Math.random()*65535).toString(16).padStart(4,"0");return`${r}${E_}_${e}`}const Qc=r=>`${r}.u`,Jc=r=>`${r}.v`,$c=r=>`${r}.r`;function oM(r,e={}){const i=e.maxIterations??60,s=e.tolerance??1e-7,l=new Set(e.pinned??[]),c=new Map(r.points.map(N=>[N.id,N])),f=new Map(r.entities.map(N=>[N.id,N])),m={index:new Map,keys:[]},h=N=>{m.index.has(N)||(m.index.set(N,m.keys.length),m.keys.push(N))};for(const N of r.points)N.fixed||l.has(N.id)||(h(Qc(N.id)),h(Jc(N.id)));for(const N of r.entities)N.type==="circle"&&h($c(N.id));const d=m.keys.length,g=new Map;for(const N of r.points)g.set(Qc(N.id),N.u),g.set(Jc(N.id),N.v);for(const N of r.entities)N.type==="circle"&&g.set($c(N.id),N.radius);const _=new Float64Array(d);for(let N=0;N<d;N++)_[N]=g.get(m.keys[N]);const v=()=>{for(let N=0;N<d;N++)g.set(m.keys[N],_[N])},y=lM(r,c,f),M=y.length,w=()=>{v();const N=new Float64Array(M),z=j=>g.get(Qc(j)),q=j=>g.get(Jc(j)),$=j=>g.get($c(j));for(let j=0;j<M;j++)N[j]=y[j](z,q,$);return N},b=N=>{let z=0;for(let q=0;q<N.length;q++)z=Math.max(z,Math.abs(N[q]));return z},x=2*fM(r,l)-M;if(d===0||M===0)return A_(r,g),{converged:!0,iterations:0,residual:b(w()),dof:x};const I=_.slice(),G=e.regularization??1e-8;let R=.001,D=w(),U=T_(D,D),P=0;for(;P<i&&!(b(D)<s);P++){const N=cM(_,d,M,w),z=new Float64Array(d*d),q=new Float64Array(d);for(let j=0;j<M;j++)for(let X=0;X<d;X++){const te=N[j*d+X];if(te!==0){q[X]+=te*D[j];for(let F=0;F<d;F++)z[X*d+F]+=te*N[j*d+F]}}for(let j=0;j<d;j++)z[j*d+j]+=G,q[j]+=G*(_[j]-I[j]);let $=!1;for(let j=0;j<8;j++){const X=z.slice();for(let K=0;K<d;K++)X[K*d+K]+=R;const te=uM(X,q,d);if(!te){R*=10;continue}const F=new Float64Array(d);for(let K=0;K<d;K++)F[K]=_[K]-te[K];for(let K=0;K<d;K++)_[K]=F[K];const V=w(),ue=T_(V,V);if(ue<U){D=V,U=ue,R=Math.max(R*.5,1e-9),$=!0;break}else{for(let K=0;K<d;K++)_[K]=F[K]+te[K];R*=4}}if(!$)break}v(),A_(r,g);const T=b(D);return{converged:T<s*100,iterations:P,residual:T,dof:x}}function lM(r,e,i){const s=[],l=c=>i.get(c);for(const c of r.constraints)switch(c.type){case"coincident":{const{p1:f,p2:m}=c;s.push(h=>h(f)-h(m)),s.push((h,d)=>d(f)-d(m));break}case"horizontal":{const f=l(c.entity);if(!f)break;s.push((m,h)=>h(f.p1)-h(f.p2));break}case"vertical":{const f=l(c.entity);if(!f)break;s.push(m=>m(f.p1)-m(f.p2));break}case"parallel":{const f=l(c.a),m=l(c.b);if(!f||!m)break;s.push((h,d)=>{const g=h(f.p2)-h(f.p1),_=d(f.p2)-d(f.p1),v=h(m.p2)-h(m.p1),y=d(m.p2)-d(m.p1);return g*y-_*v});break}case"perpendicular":{const f=l(c.a),m=l(c.b);if(!f||!m)break;s.push((h,d)=>{const g=h(f.p2)-h(f.p1),_=d(f.p2)-d(f.p1),v=h(m.p2)-h(m.p1),y=d(m.p2)-d(m.p1);return g*v+_*y});break}case"equalLength":{const f=l(c.a),m=l(c.b);if(!f||!m)break;s.push((h,d)=>{const g=(h(f.p2)-h(f.p1))**2+(d(f.p2)-d(f.p1))**2,_=(h(m.p2)-h(m.p1))**2+(d(m.p2)-d(m.p1))**2;return g-_});break}case"distance":{const{p1:f,p2:m,value:h}=c;s.push((d,g)=>{const _=d(m)-d(f),v=g(m)-g(f);return Math.sqrt(_*_+v*v)-h});break}case"angle":{const f=l(c.a),m=l(c.b);if(!f||!m)break;const h=c.value*Math.PI/180;s.push((d,g)=>{const _=d(f.p2)-d(f.p1),v=g(f.p2)-g(f.p1),y=d(m.p2)-d(m.p1),M=g(m.p2)-g(m.p1),w=Math.atan2(v,_);let x=Math.atan2(M,y)-w-h;for(;x>Math.PI;)x-=2*Math.PI;for(;x<-Math.PI;)x+=2*Math.PI;return x});break}case"radius":{const f=i.get(c.entity);if(!f)break;if(f.type==="circle"){const m=f;s.push((h,d,g)=>g(m.id)-c.value)}else if(f.type==="arc"){const m=f;s.push((h,d)=>{const g=h(m.start)-h(m.center),_=d(m.start)-d(m.center);return Math.sqrt(g*g+_*_)-c.value})}break}}for(const c of r.entities)if(c.type==="arc"){const f=c;s.push((m,h)=>{const d=(m(f.start)-m(f.center))**2+(h(f.start)-h(f.center))**2,g=(m(f.end)-m(f.center))**2+(h(f.end)-h(f.center))**2;return d-g})}return s}function cM(r,e,i,s){const l=new Float64Array(i*e),c=1e-6;for(let f=0;f<e;f++){const m=r[f];r[f]=m+c;const h=s();r[f]=m-c;const d=s();r[f]=m;const g=1/(2*c);for(let _=0;_<i;_++)l[_*e+f]=(h[_]-d[_])*g}return l}function T_(r,e){let i=0;for(let s=0;s<r.length;s++)i+=r[s]*e[s];return i}function uM(r,e,i){const s=new Float64Array(i*(i+1));for(let c=0;c<i;c++){for(let f=0;f<i;f++)s[c*(i+1)+f]=r[c*i+f];s[c*(i+1)+i]=e[c]}for(let c=0;c<i;c++){let f=c,m=Math.abs(s[c*(i+1)+c]);for(let d=c+1;d<i;d++){const g=Math.abs(s[d*(i+1)+c]);g>m&&(m=g,f=d)}if(m<1e-12)return null;if(f!==c)for(let d=0;d<=i;d++){const g=s[c*(i+1)+d];s[c*(i+1)+d]=s[f*(i+1)+d],s[f*(i+1)+d]=g}const h=s[c*(i+1)+c];for(let d=0;d<i;d++){if(d===c)continue;const g=s[d*(i+1)+c]/h;if(g!==0)for(let _=c;_<=i;_++)s[d*(i+1)+_]-=g*s[c*(i+1)+_]}}const l=new Float64Array(i);for(let c=0;c<i;c++)l[c]=s[c*(i+1)+i]/s[c*(i+1)+c];return l}function fM(r,e){return r.points.filter(i=>!i.fixed&&!e.has(i.id)).length}function A_(r,e){for(const i of r.points){const s=e.get(Qc(i.id)),l=e.get(Jc(i.id));s!==void 0&&(i.u=s),l!==void 0&&(i.v=l)}for(const i of r.entities)if(i.type==="circle"){const s=e.get($c(i.id));s!==void 0&&(i.radius=Math.abs(s))}}const dM=2,Mn=Ov((r,e)=>{const i=(c,f)=>{const m=e().sketch;if(!m)return;const h={...m,points:m.points.map(g=>({...g})),entities:m.entities.map(g=>({...g})),constraints:m.constraints.map(g=>({...g}))};c(h);const d=oM(h,f?{pinned:f}:void 0);r({sketch:h,lastSolve:{converged:d.converged,residual:d.residual}})},s=(c,f,m,h=!1)=>{const d=Ar("pt");return c.points.push({id:d,u:f,v:m,fixed:h}),d},l=(c,f,m,h)=>{if(h)return h;const d=c.points.find(g=>Math.hypot(g.u-f,g.v-m)<dM);return d?d.id:s(c,f,m)};return{sketch:null,editingFeatureId:null,tool:"select",selectedPoints:[],selectedEntities:[],pending:null,lastSolve:null,enterSketch:c=>{r({sketch:rM(Ar("sk"),c),editingFeatureId:null,tool:"select",selectedPoints:[],selectedEntities:[],pending:null,lastSolve:null})},editExisting:(c,f)=>{const m={...f,points:f.points.map(h=>({...h})),entities:f.entities.map(h=>({...h})),constraints:f.constraints.map(h=>({...h}))};r({sketch:m,editingFeatureId:c,tool:"select",selectedPoints:[],selectedEntities:[],pending:null,lastSolve:null})},finish:()=>{const{sketch:c,editingFeatureId:f}=e();return c?(r({sketch:null,editingFeatureId:null,tool:"select",selectedPoints:[],selectedEntities:[],pending:null}),{sketch:c,editingFeatureId:f}):null},exitSketch:()=>{r({sketch:null,editingFeatureId:null,tool:"select",selectedPoints:[],selectedEntities:[],pending:null})},setTool:c=>r({tool:c,pending:null}),clickAt:(c,f,m)=>{const{tool:h,pending:d}=e();if(h==="select"){m||e().clearSelection();return}if(h==="line"){i(g=>{if(!d||d.tool!=="line"){const _=l(g,c,f,m);r({pending:{tool:"line",pointIds:[_]}})}else{const _=d.pointIds[0],v=l(g,c,f,m);g.entities.push({id:Ar("ln"),type:"line",p1:_,p2:v}),r({pending:{tool:"line",pointIds:[v]}})}});return}if(h==="circle"){i(g=>{if(!d||d.tool!=="circle"){const _=l(g,c,f,m);r({pending:{tool:"circle",pointIds:[_]}})}else{const _=g.points.find(y=>y.id===d.pointIds[0]),v=Math.hypot(c-_.u,f-_.v)||1;g.entities.push({id:Ar("ci"),type:"circle",center:_.id,radius:v}),r({pending:null})}});return}if(h==="arc"){i(g=>{if(!d||d.tool!=="arc"){const _=l(g,c,f,m);r({pending:{tool:"arc",pointIds:[_]}})}else if(d.pointIds.length===1){const _=l(g,c,f,m);r({pending:{tool:"arc",pointIds:[d.pointIds[0],_]}})}else{const[_,v]=d.pointIds,y=l(g,c,f,m);g.entities.push({id:Ar("ar"),type:"arc",center:_,start:v,end:y}),r({pending:null})}});return}},dragPoint:(c,f,m)=>{i(h=>{const d=h.points.find(g=>g.id===c);d&&!d.fixed&&(d.u=f,d.v=m)},[c])},selectPoint:(c,f)=>{r(m=>{const h=m.selectedPoints.includes(c);return{selectedPoints:f?h?m.selectedPoints.filter(g=>g!==c):[...m.selectedPoints,c]:[c],selectedEntities:f?m.selectedEntities:[]}})},selectEntity:(c,f)=>{r(m=>{const h=m.selectedEntities.includes(c);return{selectedEntities:f?h?m.selectedEntities.filter(g=>g!==c):[...m.selectedEntities,c]:[c],selectedPoints:f?m.selectedPoints:[]}})},clearSelection:()=>r({selectedPoints:[],selectedEntities:[]}),addConstraint:(c,f)=>{const{sketch:m,selectedPoints:h,selectedEntities:d}=e();if(!m)return"No active sketch";const g=Ar("cn");let _=null,v=null;switch(c){case"coincident":h.length!==2?v="Select exactly 2 points":_={id:g,type:c,p1:h[0],p2:h[1]};break;case"horizontal":case"vertical":d.length!==1?v="Select exactly 1 line":_={id:g,type:c,entity:d[0]};break;case"parallel":case"perpendicular":case"equalLength":d.length!==2?v="Select exactly 2 lines":_={id:g,type:c,a:d[0],b:d[1]};break;case"distance":h.length!==2?v="Select exactly 2 points":f===void 0?v="Distance value required":_={id:g,type:c,p1:h[0],p2:h[1],value:f};break;case"angle":d.length!==2?v="Select exactly 2 lines":f===void 0?v="Angle value required":_={id:g,type:c,a:d[0],b:d[1],value:f};break;case"radius":d.length!==1?v="Select exactly 1 circle/arc":f===void 0?v="Radius value required":_={id:g,type:c,entity:d[0],value:f};break;default:v=`Unknown constraint ${String(c)}`}if(v||!_)return v??"Could not create constraint";const y=_;return i(M=>{M.constraints.push(y)}),null},deleteSelected:()=>{const{selectedPoints:c,selectedEntities:f}=e();i(m=>{m.entities=m.entities.filter(_=>!f.includes(_.id));const h=new Set(c);m.entities=m.entities.filter(_=>_.type==="line"?!h.has(_.p1)&&!h.has(_.p2):_.type==="circle"?!h.has(_.center):!h.has(_.center)&&!h.has(_.start)&&!h.has(_.end)),m.points=m.points.filter(_=>!h.has(_.id));const d=new Set(m.entities.map(_=>_.id)),g=new Set(m.points.map(_=>_.id));m.constraints=m.constraints.filter(_=>hM(_,d,g))}),r({selectedPoints:[],selectedEntities:[]})},resolve:()=>i(()=>{})}});function hM(r,e,i){switch(r.type){case"coincident":case"distance":return i.has(r.p1)&&i.has(r.p2);case"horizontal":case"vertical":return e.has(r.entity);case"parallel":case"perpendicular":case"equalLength":case"angle":return e.has(r.a)&&e.has(r.b);case"radius":return e.has(r.entity);default:return!1}}const dp="186",Xr={ROTATE:0,DOLLY:1,PAN:2},Vr={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},pM=0,R_=1,mM=2,eu=1,gM=2,$o=3,ks=0,ii=1,Ki=2,Da=0,tl=1,C_=2,w_=3,D_=4,_M=5,Hr=100,vM=101,xM=102,SM=103,yM=104,MM=200,bM=201,EM=202,TM=203,zv=204,Hv=205,AM=206,RM=207,CM=208,wM=209,DM=210,NM=211,UM=212,LM=213,OM=214,xh=0,Sh=1,yh=2,nl=3,Mh=4,bh=5,Eh=6,Th=7,Gv=0,PM=1,IM=2,$i=0,Vv=1,kv=2,Xv=3,Wv=4,Yv=5,qv=6,Zv=7,jv=300,Xs=301,qr=302,Pd=303,Id=304,gu=306,Ah=1e3,wa=1001,Rh=1002,Ln=1003,FM=1004,bc=1005,Bn=1006,Fd=1007,Gs=1008,gi=1009,Kv=1010,Qv=1011,il=1012,hp=1013,ea=1014,Qi=1015,ta=1016,pp=1017,mp=1018,al=1020,Jv=35902,$v=35899,ex=1021,tx=1022,Bi=1023,La=1026,Vs=1027,nx=1028,gp=1029,Ws=1030,_p=1031,vp=1033,tu=33776,nu=33777,iu=33778,au=33779,Ch=35840,wh=35841,Dh=35842,Nh=35843,Uh=36196,Lh=37492,Oh=37496,Ph=37488,Ih=37489,lu=37490,Fh=37491,Bh=37808,zh=37809,Hh=37810,Gh=37811,Vh=37812,kh=37813,Xh=37814,Wh=37815,Yh=37816,qh=37817,Zh=37818,jh=37819,Kh=37820,Qh=37821,Jh=36492,$h=36494,ep=36495,tp=36283,np=36284,cu=36285,ip=36286,BM=3200,ap=0,zM=1,hs="",Ci="srgb",uu="srgb-linear",fu="linear",Bt="srgb",Bd=7680,HM=519,GM=512,VM=513,kM=514,xp=515,XM=516,WM=517,Sp=518,YM=519,qM=35044,N_="300 es",Ji=2e3,sl=2001;function ZM(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function du(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function jM(){const r=du("canvas");return r.style.display="block",r}const U_={};function L_(...r){const e="THREE."+r.shift();console.log(e,...r)}function ix(r){const e=r[0];if(typeof e=="string"&&e.startsWith("TSL:")){const i=r[1];i&&i.isStackTrace?r[0]+=" "+i.getLocation():r[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return r}function nt(...r){r=ix(r);const e="THREE."+r.shift();{const i=r[0];i&&i.isStackTrace?console.warn(i.getError(e)):console.warn(e,...r)}}function Ct(...r){r=ix(r);const e="THREE."+r.shift();{const i=r[0];i&&i.isStackTrace?console.error(i.getError(e)):console.error(e,...r)}}function Wr(...r){const e=r.join(" ");e in U_||(U_[e]=!0,nt(...r))}function KM(r,e,i){return new Promise(function(s,l){function c(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:l();break;case r.TIMEOUT_EXPIRED:setTimeout(c,i);break;default:s()}}setTimeout(c,i)})}const QM={[xh]:Sh,[yh]:Eh,[Mh]:Th,[nl]:bh,[Sh]:xh,[Eh]:yh,[Th]:Mh,[bh]:nl};class gs{addEventListener(e,i){this._listeners===void 0&&(this._listeners={});const s=this._listeners;s[e]===void 0&&(s[e]=[]),s[e].indexOf(i)===-1&&s[e].push(i)}hasEventListener(e,i){const s=this._listeners;return s===void 0?!1:s[e]!==void 0&&s[e].indexOf(i)!==-1}removeEventListener(e,i){const s=this._listeners;if(s===void 0)return;const l=s[e];if(l!==void 0){const c=l.indexOf(i);c!==-1&&l.splice(c,1)}}dispatchEvent(e){const i=this._listeners;if(i===void 0)return;const s=i[e.type];if(s!==void 0){e.target=this;const l=s.slice(0);for(let c=0,f=l.length;c<f;c++)l[c].call(this,e);e.target=null}}}const In=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],su=Math.PI/180,sp=180/Math.PI;function ol(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0,s=Math.random()*4294967295|0;return(In[r&255]+In[r>>8&255]+In[r>>16&255]+In[r>>24&255]+"-"+In[e&255]+In[e>>8&255]+"-"+In[e>>16&15|64]+In[e>>24&255]+"-"+In[i&63|128]+In[i>>8&255]+"-"+In[i>>16&255]+In[i>>24&255]+In[s&255]+In[s>>8&255]+In[s>>16&255]+In[s>>24&255]).toLowerCase()}function St(r,e,i){return Math.max(e,Math.min(i,r))}function JM(r,e){return(r%e+e)%e}function zd(r,e,i){return(1-i)*r+i*e}function Wo(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:case Uint8ClampedArray:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ei(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const $M={DEG2RAD:su},Rp=class Rp{constructor(e=0,i=0){this.x=e,this.y=i}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,i){return this.x=e,this.y=i,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const i=this.x,s=this.y,l=e.elements;return this.x=l[0]*i+l[3]*s+l[6],this.y=l[1]*i+l[4]*s+l[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,i){return this.x=St(this.x,e.x,i.x),this.y=St(this.y,e.y,i.y),this}clampScalar(e,i){return this.x=St(this.x,e,i),this.y=St(this.y,e,i),this}clampLength(e,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(St(s,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const s=this.dot(e)/i;return Math.acos(St(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,s=this.y-e.y;return i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this}lerpVectors(e,i,s){return this.x=e.x+(i.x-e.x)*s,this.y=e.y+(i.y-e.y)*s,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this}rotateAround(e,i){const s=Math.cos(i),l=Math.sin(i),c=this.x-e.x,f=this.y-e.y;return this.x=c*s-f*l+e.x,this.y=c*l+f*s+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Rp.prototype.isVector2=!0;let at=Rp;class ps{constructor(e=0,i=0,s=0,l=1){this.isQuaternion=!0,this._x=e,this._y=i,this._z=s,this._w=l}static slerpFlat(e,i,s,l,c,f,m){let h=s[l+0],d=s[l+1],g=s[l+2],_=s[l+3],v=c[f+0],y=c[f+1],M=c[f+2],w=c[f+3];if(_!==w||h!==v||d!==y||g!==M){let b=h*v+d*y+g*M+_*w;b<0&&(v=-v,y=-y,M=-M,w=-w,b=-b);let x=1-m;if(b<.9995){const I=Math.acos(b),G=Math.sin(I);x=Math.sin(x*I)/G,m=Math.sin(m*I)/G,h=h*x+v*m,d=d*x+y*m,g=g*x+M*m,_=_*x+w*m}else{h=h*x+v*m,d=d*x+y*m,g=g*x+M*m,_=_*x+w*m;const I=1/Math.sqrt(h*h+d*d+g*g+_*_);h*=I,d*=I,g*=I,_*=I}}e[i]=h,e[i+1]=d,e[i+2]=g,e[i+3]=_}static multiplyQuaternionsFlat(e,i,s,l,c,f){const m=s[l],h=s[l+1],d=s[l+2],g=s[l+3],_=c[f],v=c[f+1],y=c[f+2],M=c[f+3];return e[i]=m*M+g*_+h*y-d*v,e[i+1]=h*M+g*v+d*_-m*y,e[i+2]=d*M+g*y+m*v-h*_,e[i+3]=g*M-m*_-h*v-d*y,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,i,s,l){return this._x=e,this._y=i,this._z=s,this._w=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,i=!0){const s=e._x,l=e._y,c=e._z,f=e._order,m=Math.cos,h=Math.sin,d=m(s/2),g=m(l/2),_=m(c/2),v=h(s/2),y=h(l/2),M=h(c/2);switch(f){case"XYZ":this._x=v*g*_+d*y*M,this._y=d*y*_-v*g*M,this._z=d*g*M+v*y*_,this._w=d*g*_-v*y*M;break;case"YXZ":this._x=v*g*_+d*y*M,this._y=d*y*_-v*g*M,this._z=d*g*M-v*y*_,this._w=d*g*_+v*y*M;break;case"ZXY":this._x=v*g*_-d*y*M,this._y=d*y*_+v*g*M,this._z=d*g*M+v*y*_,this._w=d*g*_-v*y*M;break;case"ZYX":this._x=v*g*_-d*y*M,this._y=d*y*_+v*g*M,this._z=d*g*M-v*y*_,this._w=d*g*_+v*y*M;break;case"YZX":this._x=v*g*_+d*y*M,this._y=d*y*_+v*g*M,this._z=d*g*M-v*y*_,this._w=d*g*_-v*y*M;break;case"XZY":this._x=v*g*_-d*y*M,this._y=d*y*_-v*g*M,this._z=d*g*M+v*y*_,this._w=d*g*_+v*y*M;break;default:nt("Quaternion: .setFromEuler() encountered an unknown order: "+f)}return i===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,i){const s=i/2,l=Math.sin(s);return this._x=e.x*l,this._y=e.y*l,this._z=e.z*l,this._w=Math.cos(s),this._onChangeCallback(),this}setFromRotationMatrix(e){const i=e.elements,s=i[0],l=i[4],c=i[8],f=i[1],m=i[5],h=i[9],d=i[2],g=i[6],_=i[10],v=s+m+_;if(v>0){const y=.5/Math.sqrt(v+1);this._w=.25/y,this._x=(g-h)*y,this._y=(c-d)*y,this._z=(f-l)*y}else if(s>m&&s>_){const y=2*Math.sqrt(1+s-m-_);this._w=(g-h)/y,this._x=.25*y,this._y=(l+f)/y,this._z=(c+d)/y}else if(m>_){const y=2*Math.sqrt(1+m-s-_);this._w=(c-d)/y,this._x=(l+f)/y,this._y=.25*y,this._z=(h+g)/y}else{const y=2*Math.sqrt(1+_-s-m);this._w=(f-l)/y,this._x=(c+d)/y,this._y=(h+g)/y,this._z=.25*y}return this._onChangeCallback(),this}setFromUnitVectors(e,i){let s=e.dot(i)+1;return s<1e-8?(s=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=s):(this._x=0,this._y=-e.z,this._z=e.y,this._w=s)):(this._x=e.y*i.z-e.z*i.y,this._y=e.z*i.x-e.x*i.z,this._z=e.x*i.y-e.y*i.x,this._w=s),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(St(this.dot(e),-1,1)))}rotateTowards(e,i){const s=this.angleTo(e);if(s===0)return this;const l=Math.min(1,i/s);return this.slerp(e,l),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,i){const s=e._x,l=e._y,c=e._z,f=e._w,m=i._x,h=i._y,d=i._z,g=i._w;return this._x=s*g+f*m+l*d-c*h,this._y=l*g+f*h+c*m-s*d,this._z=c*g+f*d+s*h-l*m,this._w=f*g-s*m-l*h-c*d,this._onChangeCallback(),this}slerp(e,i){let s=e._x,l=e._y,c=e._z,f=e._w,m=this.dot(e);m<0&&(s=-s,l=-l,c=-c,f=-f,m=-m);let h=1-i;if(m<.9995){const d=Math.acos(m),g=Math.sin(d);h=Math.sin(h*d)/g,i=Math.sin(i*d)/g,this._x=this._x*h+s*i,this._y=this._y*h+l*i,this._z=this._z*h+c*i,this._w=this._w*h+f*i,this._onChangeCallback()}else this._x=this._x*h+s*i,this._y=this._y*h+l*i,this._z=this._z*h+c*i,this._w=this._w*h+f*i,this.normalize();return this}slerpQuaternions(e,i,s){return this.copy(e).slerp(i,s)}random(){const e=2*Math.PI*Math.random(),i=2*Math.PI*Math.random(),s=Math.random(),l=Math.sqrt(1-s),c=Math.sqrt(s);return this.set(l*Math.sin(e),l*Math.cos(e),c*Math.sin(i),c*Math.cos(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,i=0){return this._x=e[i],this._y=e[i+1],this._z=e[i+2],this._w=e[i+3],this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._w,e}fromBufferAttribute(e,i){return this._x=e.getX(i),this._y=e.getY(i),this._z=e.getZ(i),this._w=e.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Cp=class Cp{constructor(e=0,i=0,s=0){this.x=e,this.y=i,this.z=s}set(e,i,s){return s===void 0&&(s=this.z),this.x=e,this.y=i,this.z=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,i){return this.x=e.x*i.x,this.y=e.y*i.y,this.z=e.z*i.z,this}applyEuler(e){return this.applyQuaternion(O_.setFromEuler(e))}applyAxisAngle(e,i){return this.applyQuaternion(O_.setFromAxisAngle(e,i))}applyMatrix3(e){const i=this.x,s=this.y,l=this.z,c=e.elements;return this.x=c[0]*i+c[3]*s+c[6]*l,this.y=c[1]*i+c[4]*s+c[7]*l,this.z=c[2]*i+c[5]*s+c[8]*l,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const i=this.x,s=this.y,l=this.z,c=e.elements,f=1/(c[3]*i+c[7]*s+c[11]*l+c[15]);return this.x=(c[0]*i+c[4]*s+c[8]*l+c[12])*f,this.y=(c[1]*i+c[5]*s+c[9]*l+c[13])*f,this.z=(c[2]*i+c[6]*s+c[10]*l+c[14])*f,this}applyQuaternion(e){const i=this.x,s=this.y,l=this.z,c=e.x,f=e.y,m=e.z,h=e.w,d=2*(f*l-m*s),g=2*(m*i-c*l),_=2*(c*s-f*i);return this.x=i+h*d+f*_-m*g,this.y=s+h*g+m*d-c*_,this.z=l+h*_+c*g-f*d,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const i=this.x,s=this.y,l=this.z,c=e.elements;return this.x=c[0]*i+c[4]*s+c[8]*l,this.y=c[1]*i+c[5]*s+c[9]*l,this.z=c[2]*i+c[6]*s+c[10]*l,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,i){return this.x=St(this.x,e.x,i.x),this.y=St(this.y,e.y,i.y),this.z=St(this.z,e.z,i.z),this}clampScalar(e,i){return this.x=St(this.x,e,i),this.y=St(this.y,e,i),this.z=St(this.z,e,i),this}clampLength(e,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(St(s,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this}lerpVectors(e,i,s){return this.x=e.x+(i.x-e.x)*s,this.y=e.y+(i.y-e.y)*s,this.z=e.z+(i.z-e.z)*s,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,i){const s=e.x,l=e.y,c=e.z,f=i.x,m=i.y,h=i.z;return this.x=l*h-c*m,this.y=c*f-s*h,this.z=s*m-l*f,this}projectOnVector(e){const i=e.lengthSq();if(i===0)return this.set(0,0,0);const s=e.dot(this)/i;return this.copy(e).multiplyScalar(s)}projectOnPlane(e){return Hd.copy(this).projectOnVector(e),this.sub(Hd)}reflect(e){return this.sub(Hd.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const s=this.dot(e)/i;return Math.acos(St(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,s=this.y-e.y,l=this.z-e.z;return i*i+s*s+l*l}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,i,s){const l=Math.sin(i)*e;return this.x=l*Math.sin(s),this.y=Math.cos(i)*e,this.z=l*Math.cos(s),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,i,s){return this.x=e*Math.sin(i),this.y=s,this.z=e*Math.cos(i),this}setFromMatrixPosition(e){const i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(e){const i=this.setFromMatrixColumn(e,0).length(),s=this.setFromMatrixColumn(e,1).length(),l=this.setFromMatrixColumn(e,2).length();return this.x=i,this.y=s,this.z=l,this}setFromMatrixColumn(e,i){return this.fromArray(e.elements,i*4)}setFromMatrix3Column(e,i){return this.fromArray(e.elements,i*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,i=Math.random()*2-1,s=Math.sqrt(1-i*i);return this.x=s*Math.cos(e),this.y=i,this.z=s*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Cp.prototype.isVector3=!0;let ee=Cp;const Hd=new ee,O_=new ps,wp=class wp{constructor(e,i,s,l,c,f,m,h,d){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,i,s,l,c,f,m,h,d)}set(e,i,s,l,c,f,m,h,d){const g=this.elements;return g[0]=e,g[1]=l,g[2]=m,g[3]=i,g[4]=c,g[5]=h,g[6]=s,g[7]=f,g[8]=d,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const i=this.elements,s=e.elements;return i[0]=s[0],i[1]=s[1],i[2]=s[2],i[3]=s[3],i[4]=s[4],i[5]=s[5],i[6]=s[6],i[7]=s[7],i[8]=s[8],this}extractBasis(e,i,s){return e.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),s.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const i=e.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const s=e.elements,l=i.elements,c=this.elements,f=s[0],m=s[3],h=s[6],d=s[1],g=s[4],_=s[7],v=s[2],y=s[5],M=s[8],w=l[0],b=l[3],x=l[6],I=l[1],G=l[4],R=l[7],D=l[2],U=l[5],P=l[8];return c[0]=f*w+m*I+h*D,c[3]=f*b+m*G+h*U,c[6]=f*x+m*R+h*P,c[1]=d*w+g*I+_*D,c[4]=d*b+g*G+_*U,c[7]=d*x+g*R+_*P,c[2]=v*w+y*I+M*D,c[5]=v*b+y*G+M*U,c[8]=v*x+y*R+M*P,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[3]*=e,i[6]*=e,i[1]*=e,i[4]*=e,i[7]*=e,i[2]*=e,i[5]*=e,i[8]*=e,this}determinant(){const e=this.elements,i=e[0],s=e[1],l=e[2],c=e[3],f=e[4],m=e[5],h=e[6],d=e[7],g=e[8];return i*f*g-i*m*d-s*c*g+s*m*h+l*c*d-l*f*h}invert(){const e=this.elements,i=e[0],s=e[1],l=e[2],c=e[3],f=e[4],m=e[5],h=e[6],d=e[7],g=e[8],_=g*f-m*d,v=m*h-g*c,y=d*c-f*h,M=i*_+s*v+l*y;if(M===0)return this.set(0,0,0,0,0,0,0,0,0);const w=1/M;return e[0]=_*w,e[1]=(l*d-g*s)*w,e[2]=(m*s-l*f)*w,e[3]=v*w,e[4]=(g*i-l*h)*w,e[5]=(l*c-m*i)*w,e[6]=y*w,e[7]=(s*h-d*i)*w,e[8]=(f*i-s*c)*w,this}transpose(){let e;const i=this.elements;return e=i[1],i[1]=i[3],i[3]=e,e=i[2],i[2]=i[6],i[6]=e,e=i[5],i[5]=i[7],i[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const i=this.elements;return e[0]=i[0],e[1]=i[3],e[2]=i[6],e[3]=i[1],e[4]=i[4],e[5]=i[7],e[6]=i[2],e[7]=i[5],e[8]=i[8],this}setUvTransform(e,i,s,l,c,f,m){const h=Math.cos(c),d=Math.sin(c);return this.set(s*h,s*d,-s*(h*f+d*m)+f+e,-l*d,l*h,-l*(-d*f+h*m)+m+i,0,0,1),this}scale(e,i){return Wr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Gd.makeScale(e,i)),this}rotate(e){return Wr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Gd.makeRotation(-e)),this}translate(e,i){return Wr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Gd.makeTranslation(e,i)),this}makeTranslation(e,i){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,i,0,0,1),this}makeRotation(e){const i=Math.cos(e),s=Math.sin(e);return this.set(i,-s,0,s,i,0,0,0,1),this}makeScale(e,i){return this.set(e,0,0,0,i,0,0,0,1),this}equals(e){const i=this.elements,s=e.elements;for(let l=0;l<9;l++)if(i[l]!==s[l])return!1;return!0}fromArray(e,i=0){for(let s=0;s<9;s++)this.elements[s]=e[s+i];return this}toArray(e=[],i=0){const s=this.elements;return e[i]=s[0],e[i+1]=s[1],e[i+2]=s[2],e[i+3]=s[3],e[i+4]=s[4],e[i+5]=s[5],e[i+6]=s[6],e[i+7]=s[7],e[i+8]=s[8],e}clone(){return new this.constructor().fromArray(this.elements)}};wp.prototype.isMatrix3=!0;let ot=wp;const Gd=new ot,P_=new ot().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),I_=new ot().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function eb(){const r={enabled:!0,workingColorSpace:uu,spaces:{},convert:function(l,c,f){return this.enabled===!1||c===f||!c||!f||(this.spaces[c].transfer===Bt&&(l.r=Na(l.r),l.g=Na(l.g),l.b=Na(l.b)),this.spaces[c].primaries!==this.spaces[f].primaries&&(l.applyMatrix3(this.spaces[c].toXYZ),l.applyMatrix3(this.spaces[f].fromXYZ)),this.spaces[f].transfer===Bt&&(l.r=Yr(l.r),l.g=Yr(l.g),l.b=Yr(l.b))),l},workingToColorSpace:function(l,c){return this.convert(l,this.workingColorSpace,c)},colorSpaceToWorking:function(l,c){return this.convert(l,c,this.workingColorSpace)},getPrimaries:function(l){return this.spaces[l].primaries},getTransfer:function(l){return l===hs?fu:this.spaces[l].transfer},getToneMappingMode:function(l){return this.spaces[l].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(l,c=this.workingColorSpace){return l.fromArray(this.spaces[c].luminanceCoefficients)},define:function(l){Object.assign(this.spaces,l)},_getMatrix:function(l,c,f){return l.copy(this.spaces[c].toXYZ).multiply(this.spaces[f].fromXYZ)},_getDrawingBufferColorSpace:function(l){return this.spaces[l].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(l=this.workingColorSpace){return this.spaces[l].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(l,c){return Wr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(l,c)},toWorkingColorSpace:function(l,c){return Wr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(l,c)}},e=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],s=[.3127,.329];return r.define({[uu]:{primaries:e,whitePoint:s,transfer:fu,toXYZ:P_,fromXYZ:I_,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:Ci},outputColorSpaceConfig:{drawingBufferColorSpace:Ci}},[Ci]:{primaries:e,whitePoint:s,transfer:Bt,toXYZ:P_,fromXYZ:I_,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:Ci}}}),r}const Tt=eb();function Na(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Yr(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Rr;class tb{static getDataURL(e,i="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let s;if(e instanceof HTMLCanvasElement)s=e;else{Rr===void 0&&(Rr=du("canvas")),Rr.width=e.width,Rr.height=e.height;const l=Rr.getContext("2d");e instanceof ImageData?l.putImageData(e,0,0):l.drawImage(e,0,0,e.width,e.height),s=Rr}return s.toDataURL(i)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const i=du("canvas");i.width=e.width,i.height=e.height;const s=i.getContext("2d");s.drawImage(e,0,0,e.width,e.height);const l=s.getImageData(0,0,e.width,e.height),c=l.data;for(let f=0;f<c.length;f++)c[f]=Na(c[f]/255)*255;return s.putImageData(l,0,0),i}else if(e.data){const i=e.data.slice(0);for(let s=0;s<i.length;s++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[s]=Math.floor(Na(i[s]/255)*255):i[s]=Na(i[s]);return{data:i,width:e.width,height:e.height}}else return nt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let nb=0;class yp{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:nb++}),this.uuid=ol(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const i=this.data;return typeof HTMLVideoElement<"u"&&i instanceof HTMLVideoElement?e.set(i.videoWidth,i.videoHeight,0):typeof VideoFrame<"u"&&i instanceof VideoFrame?e.set(i.displayWidth,i.displayHeight,0):i!==null?e.set(i.width,i.height,i.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const s={uuid:this.uuid,url:""},l=this.data;if(l!==null){let c;if(Array.isArray(l)){c=[];for(let f=0,m=l.length;f<m;f++)l[f].isDataTexture?c.push(Vd(l[f].image)):c.push(Vd(l[f]))}else c=Vd(l);s.url=c}return i||(e.images[this.uuid]=s),s}}function Vd(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?tb.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(nt("Texture: Unable to serialize Texture."),{})}let ib=0;const kd=new ee;class kn extends gs{constructor(e=kn.DEFAULT_IMAGE,i=kn.DEFAULT_MAPPING,s=wa,l=wa,c=Bn,f=Gs,m=Bi,h=gi,d=kn.DEFAULT_ANISOTROPY,g=hs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ib++}),this.uuid=ol(),this.name="",this.source=new yp(e),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=s,this.wrapT=l,this.magFilter=c,this.minFilter=f,this.anisotropy=d,this.format=m,this.internalFormat=null,this.type=h,this.offset=new at(0,0),this.repeat=new at(1,1),this.center=new at(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ot,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=g,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(kd).x}get height(){return this.source.getSize(kd).y}get depth(){return this.source.getSize(kd).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const i in e){const s=e[i];if(s===void 0){nt(`Texture.setValues(): parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){nt(`Texture.setValues(): property '${i}' does not exist.`);continue}l&&s&&l.isVector2&&s.isVector2||l&&s&&l.isVector3&&s.isVector3||l&&s&&l.isMatrix3&&s.isMatrix3?l.copy(s):this[i]=s}}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const s={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(s.userData=this.userData),i||(e.textures[this.uuid]=s),s}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==jv)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ah:e.x=e.x-Math.floor(e.x);break;case wa:e.x=e.x<0?0:1;break;case Rh:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ah:e.y=e.y-Math.floor(e.y);break;case wa:e.y=e.y<0?0:1;break;case Rh:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}kn.DEFAULT_IMAGE=null;kn.DEFAULT_MAPPING=jv;kn.DEFAULT_ANISOTROPY=1;const Dp=class Dp{constructor(e=0,i=0,s=0,l=1){this.x=e,this.y=i,this.z=s,this.w=l}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,i,s,l){return this.x=e,this.y=i,this.z=s,this.w=l,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this.w=e.w+i.w,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this.w+=e.w*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this.w=e.w-i.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const i=this.x,s=this.y,l=this.z,c=this.w,f=e.elements;return this.x=f[0]*i+f[4]*s+f[8]*l+f[12]*c,this.y=f[1]*i+f[5]*s+f[9]*l+f[13]*c,this.z=f[2]*i+f[6]*s+f[10]*l+f[14]*c,this.w=f[3]*i+f[7]*s+f[11]*l+f[15]*c,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const i=Math.sqrt(1-e.w*e.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/i,this.y=e.y/i,this.z=e.z/i),this}setAxisAngleFromRotationMatrix(e){let i,s,l,c;const h=e.elements,d=h[0],g=h[4],_=h[8],v=h[1],y=h[5],M=h[9],w=h[2],b=h[6],x=h[10];if(Math.abs(g-v)<.01&&Math.abs(_-w)<.01&&Math.abs(M-b)<.01){if(Math.abs(g+v)<.1&&Math.abs(_+w)<.1&&Math.abs(M+b)<.1&&Math.abs(d+y+x-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;const G=(d+1)/2,R=(y+1)/2,D=(x+1)/2,U=(g+v)/4,P=(_+w)/4,T=(M+b)/4;return G>R&&G>D?G<.01?(s=0,l=.707106781,c=.707106781):(s=Math.sqrt(G),l=U/s,c=P/s):R>D?R<.01?(s=.707106781,l=0,c=.707106781):(l=Math.sqrt(R),s=U/l,c=T/l):D<.01?(s=.707106781,l=.707106781,c=0):(c=Math.sqrt(D),s=P/c,l=T/c),this.set(s,l,c,i),this}let I=Math.sqrt((b-M)*(b-M)+(_-w)*(_-w)+(v-g)*(v-g));return Math.abs(I)<.001&&(I=1),this.x=(b-M)/I,this.y=(_-w)/I,this.z=(v-g)/I,this.w=Math.acos((d+y+x-1)/2),this}setFromMatrixPosition(e){const i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,i){return this.x=St(this.x,e.x,i.x),this.y=St(this.y,e.y,i.y),this.z=St(this.z,e.z,i.z),this.w=St(this.w,e.w,i.w),this}clampScalar(e,i){return this.x=St(this.x,e,i),this.y=St(this.y,e,i),this.z=St(this.z,e,i),this.w=St(this.w,e,i),this}clampLength(e,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(St(s,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this.w+=(e.w-this.w)*i,this}lerpVectors(e,i,s){return this.x=e.x+(i.x-e.x)*s,this.y=e.y+(i.y-e.y)*s,this.z=e.z+(i.z-e.z)*s,this.w=e.w+(i.w-e.w)*s,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this.w=e[i+3],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e[i+3]=this.w,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this.w=e.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Dp.prototype.isVector4=!0;let nn=Dp;class ab extends gs{constructor(e=1,i=1,s={}){super(),s=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Bn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},s),this.isRenderTarget=!0,this.width=e,this.height=i,this.depth=s.depth,this.scissor=new nn(0,0,e,i),this.scissorTest=!1,this.viewport=new nn(0,0,e,i),this.textures=[];const l={width:e,height:i,depth:s.depth},c=new kn(l),f=s.count;for(let m=0;m<f;m++)this.textures[m]=c.clone(),this.textures[m].isRenderTargetTexture=!0,this.textures[m].renderTarget=this;this._setTextureOptions(s),this.depthBuffer=s.depthBuffer,this.stencilBuffer=s.stencilBuffer,this.resolveColorBuffer=s.resolveColorBuffer,this.resolveDepthBuffer=s.resolveDepthBuffer,this.resolveStencilBuffer=s.resolveStencilBuffer,this.storeMultisampledColorBuffer=s.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=s.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=s.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=s.depthTexture,this.samples=s.samples,this.multiview=s.multiview,this.useArrayDepthTexture=s.useArrayDepthTexture}_setTextureOptions(e={}){const i={minFilter:Bn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(i.mapping=e.mapping),e.wrapS!==void 0&&(i.wrapS=e.wrapS),e.wrapT!==void 0&&(i.wrapT=e.wrapT),e.wrapR!==void 0&&(i.wrapR=e.wrapR),e.magFilter!==void 0&&(i.magFilter=e.magFilter),e.minFilter!==void 0&&(i.minFilter=e.minFilter),e.format!==void 0&&(i.format=e.format),e.type!==void 0&&(i.type=e.type),e.anisotropy!==void 0&&(i.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(i.colorSpace=e.colorSpace),e.flipY!==void 0&&(i.flipY=e.flipY),e.generateMipmaps!==void 0&&(i.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(i.internalFormat=e.internalFormat);for(let s=0;s<this.textures.length;s++)this.textures[s].setValues(i)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,i,s=1){if(this.width!==e||this.height!==i||this.depth!==s){this.width=e,this.height=i,this.depth=s;for(let l=0,c=this.textures.length;l<c;l++)this.textures[l].image.width=e,this.textures[l].image.height=i,this.textures[l].image.depth=s,this.textures[l].isData3DTexture!==!0&&(this.textures[l].isArrayTexture=this.textures[l].image.depth>1);this.dispose()}this.viewport.set(0,0,e,i),this.scissor.set(0,0,e,i)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,s=e.textures.length;i<s;i++){this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;const l=Object.assign({},e.textures[i].image);this.textures[i].source=new yp(l)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const i=e.depthTexture.clone();i.renderTarget=null,this.depthTexture=i}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Hi extends ab{constructor(e=1,i=1,s={}){super(e,i,s),this.isWebGLRenderTarget=!0}}class ax extends kn{constructor(e=null,i=1,s=1,l=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:i,height:s,depth:l},this.magFilter=Ln,this.minFilter=Ln,this.wrapR=wa,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class sb extends kn{constructor(e=null,i=1,s=1,l=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:i,height:s,depth:l},this.magFilter=Ln,this.minFilter=Ln,this.wrapR=wa,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const mu=class mu{constructor(e,i,s,l,c,f,m,h,d,g,_,v,y,M,w,b){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,i,s,l,c,f,m,h,d,g,_,v,y,M,w,b)}set(e,i,s,l,c,f,m,h,d,g,_,v,y,M,w,b){const x=this.elements;return x[0]=e,x[4]=i,x[8]=s,x[12]=l,x[1]=c,x[5]=f,x[9]=m,x[13]=h,x[2]=d,x[6]=g,x[10]=_,x[14]=v,x[3]=y,x[7]=M,x[11]=w,x[15]=b,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new mu().fromArray(this.elements)}copy(e){const i=this.elements,s=e.elements;return i[0]=s[0],i[1]=s[1],i[2]=s[2],i[3]=s[3],i[4]=s[4],i[5]=s[5],i[6]=s[6],i[7]=s[7],i[8]=s[8],i[9]=s[9],i[10]=s[10],i[11]=s[11],i[12]=s[12],i[13]=s[13],i[14]=s[14],i[15]=s[15],this}copyPosition(e){const i=this.elements,s=e.elements;return i[12]=s[12],i[13]=s[13],i[14]=s[14],this}setFromMatrix3(e){const i=e.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(e,i,s){return this.determinantAffine()===0?(e.set(1,0,0),i.set(0,1,0),s.set(0,0,1),this):(e.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),s.setFromMatrixColumn(this,2),this)}makeBasis(e,i,s){return this.set(e.x,i.x,s.x,0,e.y,i.y,s.y,0,e.z,i.z,s.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const i=this.elements,s=e.elements,l=1/Cr.setFromMatrixColumn(e,0).length(),c=1/Cr.setFromMatrixColumn(e,1).length(),f=1/Cr.setFromMatrixColumn(e,2).length();return i[0]=s[0]*l,i[1]=s[1]*l,i[2]=s[2]*l,i[3]=0,i[4]=s[4]*c,i[5]=s[5]*c,i[6]=s[6]*c,i[7]=0,i[8]=s[8]*f,i[9]=s[9]*f,i[10]=s[10]*f,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(e){const i=this.elements,s=e.x,l=e.y,c=e.z,f=Math.cos(s),m=Math.sin(s),h=Math.cos(l),d=Math.sin(l),g=Math.cos(c),_=Math.sin(c);if(e.order==="XYZ"){const v=f*g,y=f*_,M=m*g,w=m*_;i[0]=h*g,i[4]=-h*_,i[8]=d,i[1]=y+M*d,i[5]=v-w*d,i[9]=-m*h,i[2]=w-v*d,i[6]=M+y*d,i[10]=f*h}else if(e.order==="YXZ"){const v=h*g,y=h*_,M=d*g,w=d*_;i[0]=v+w*m,i[4]=M*m-y,i[8]=f*d,i[1]=f*_,i[5]=f*g,i[9]=-m,i[2]=y*m-M,i[6]=w+v*m,i[10]=f*h}else if(e.order==="ZXY"){const v=h*g,y=h*_,M=d*g,w=d*_;i[0]=v-w*m,i[4]=-f*_,i[8]=M+y*m,i[1]=y+M*m,i[5]=f*g,i[9]=w-v*m,i[2]=-f*d,i[6]=m,i[10]=f*h}else if(e.order==="ZYX"){const v=f*g,y=f*_,M=m*g,w=m*_;i[0]=h*g,i[4]=M*d-y,i[8]=v*d+w,i[1]=h*_,i[5]=w*d+v,i[9]=y*d-M,i[2]=-d,i[6]=m*h,i[10]=f*h}else if(e.order==="YZX"){const v=f*h,y=f*d,M=m*h,w=m*d;i[0]=h*g,i[4]=w-v*_,i[8]=M*_+y,i[1]=_,i[5]=f*g,i[9]=-m*g,i[2]=-d*g,i[6]=y*_+M,i[10]=v-w*_}else if(e.order==="XZY"){const v=f*h,y=f*d,M=m*h,w=m*d;i[0]=h*g,i[4]=-_,i[8]=d*g,i[1]=v*_+w,i[5]=f*g,i[9]=y*_-M,i[2]=M*_-y,i[6]=m*g,i[10]=w*_+v}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(e){return this.compose(rb,e,ob)}lookAt(e,i,s){const l=this.elements;return pi.subVectors(e,i),pi.lengthSq()===0&&(pi.z=1),pi.normalize(),ls.crossVectors(s,pi),ls.lengthSq()===0&&(Math.abs(s.z)===1?pi.x+=1e-4:pi.z+=1e-4,pi.normalize(),ls.crossVectors(s,pi)),ls.normalize(),Ec.crossVectors(pi,ls),l[0]=ls.x,l[4]=Ec.x,l[8]=pi.x,l[1]=ls.y,l[5]=Ec.y,l[9]=pi.y,l[2]=ls.z,l[6]=Ec.z,l[10]=pi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const s=e.elements,l=i.elements,c=this.elements,f=s[0],m=s[4],h=s[8],d=s[12],g=s[1],_=s[5],v=s[9],y=s[13],M=s[2],w=s[6],b=s[10],x=s[14],I=s[3],G=s[7],R=s[11],D=s[15],U=l[0],P=l[4],T=l[8],N=l[12],z=l[1],q=l[5],$=l[9],j=l[13],X=l[2],te=l[6],F=l[10],V=l[14],ue=l[3],K=l[7],he=l[11],L=l[15];return c[0]=f*U+m*z+h*X+d*ue,c[4]=f*P+m*q+h*te+d*K,c[8]=f*T+m*$+h*F+d*he,c[12]=f*N+m*j+h*V+d*L,c[1]=g*U+_*z+v*X+y*ue,c[5]=g*P+_*q+v*te+y*K,c[9]=g*T+_*$+v*F+y*he,c[13]=g*N+_*j+v*V+y*L,c[2]=M*U+w*z+b*X+x*ue,c[6]=M*P+w*q+b*te+x*K,c[10]=M*T+w*$+b*F+x*he,c[14]=M*N+w*j+b*V+x*L,c[3]=I*U+G*z+R*X+D*ue,c[7]=I*P+G*q+R*te+D*K,c[11]=I*T+G*$+R*F+D*he,c[15]=I*N+G*j+R*V+D*L,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[4]*=e,i[8]*=e,i[12]*=e,i[1]*=e,i[5]*=e,i[9]*=e,i[13]*=e,i[2]*=e,i[6]*=e,i[10]*=e,i[14]*=e,i[3]*=e,i[7]*=e,i[11]*=e,i[15]*=e,this}determinant(){const e=this.elements,i=e[0],s=e[4],l=e[8],c=e[12],f=e[1],m=e[5],h=e[9],d=e[13],g=e[2],_=e[6],v=e[10],y=e[14],M=e[3],w=e[7],b=e[11],x=e[15],I=h*y-d*v,G=m*y-d*_,R=m*v-h*_,D=f*y-d*g,U=f*v-h*g,P=f*_-m*g;return i*(w*I-b*G+x*R)-s*(M*I-b*D+x*U)+l*(M*G-w*D+x*P)-c*(M*R-w*U+b*P)}determinantAffine(){const e=this.elements,i=e[0],s=e[4],l=e[8],c=e[1],f=e[5],m=e[9],h=e[2],d=e[6],g=e[10];return i*(f*g-m*d)-s*(c*g-m*h)+l*(c*d-f*h)}transpose(){const e=this.elements;let i;return i=e[1],e[1]=e[4],e[4]=i,i=e[2],e[2]=e[8],e[8]=i,i=e[6],e[6]=e[9],e[9]=i,i=e[3],e[3]=e[12],e[12]=i,i=e[7],e[7]=e[13],e[13]=i,i=e[11],e[11]=e[14],e[14]=i,this}setPosition(e,i,s){const l=this.elements;return e.isVector3?(l[12]=e.x,l[13]=e.y,l[14]=e.z):(l[12]=e,l[13]=i,l[14]=s),this}invert(){const e=this.elements,i=e[0],s=e[1],l=e[2],c=e[3],f=e[4],m=e[5],h=e[6],d=e[7],g=e[8],_=e[9],v=e[10],y=e[11],M=e[12],w=e[13],b=e[14],x=e[15],I=i*m-s*f,G=i*h-l*f,R=i*d-c*f,D=s*h-l*m,U=s*d-c*m,P=l*d-c*h,T=g*w-_*M,N=g*b-v*M,z=g*x-y*M,q=_*b-v*w,$=_*x-y*w,j=v*x-y*b,X=I*j-G*$+R*q+D*z-U*N+P*T;if(X===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const te=1/X;return e[0]=(m*j-h*$+d*q)*te,e[1]=(l*$-s*j-c*q)*te,e[2]=(w*P-b*U+x*D)*te,e[3]=(v*U-_*P-y*D)*te,e[4]=(h*z-f*j-d*N)*te,e[5]=(i*j-l*z+c*N)*te,e[6]=(b*R-M*P-x*G)*te,e[7]=(g*P-v*R+y*G)*te,e[8]=(f*$-m*z+d*T)*te,e[9]=(s*z-i*$-c*T)*te,e[10]=(M*U-w*R+x*I)*te,e[11]=(_*R-g*U-y*I)*te,e[12]=(m*N-f*q-h*T)*te,e[13]=(i*q-s*N+l*T)*te,e[14]=(w*G-M*D-b*I)*te,e[15]=(g*D-_*G+v*I)*te,this}scale(e){const i=this.elements,s=e.x,l=e.y,c=e.z;return i[0]*=s,i[4]*=l,i[8]*=c,i[1]*=s,i[5]*=l,i[9]*=c,i[2]*=s,i[6]*=l,i[10]*=c,i[3]*=s,i[7]*=l,i[11]*=c,this}getMaxScaleOnAxis(){const e=this.elements,i=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],s=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],l=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(i,s,l))}makeTranslation(e,i,s){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,i,0,0,1,s,0,0,0,1),this}makeRotationX(e){const i=Math.cos(e),s=Math.sin(e);return this.set(1,0,0,0,0,i,-s,0,0,s,i,0,0,0,0,1),this}makeRotationY(e){const i=Math.cos(e),s=Math.sin(e);return this.set(i,0,s,0,0,1,0,0,-s,0,i,0,0,0,0,1),this}makeRotationZ(e){const i=Math.cos(e),s=Math.sin(e);return this.set(i,-s,0,0,s,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,i){const s=Math.cos(i),l=Math.sin(i),c=1-s,f=e.x,m=e.y,h=e.z,d=c*f,g=c*m;return this.set(d*f+s,d*m-l*h,d*h+l*m,0,d*m+l*h,g*m+s,g*h-l*f,0,d*h-l*m,g*h+l*f,c*h*h+s,0,0,0,0,1),this}makeScale(e,i,s){return this.set(e,0,0,0,0,i,0,0,0,0,s,0,0,0,0,1),this}makeShear(e,i,s,l,c,f){return this.set(1,s,c,0,e,1,f,0,i,l,1,0,0,0,0,1),this}compose(e,i,s){const l=this.elements,c=i._x,f=i._y,m=i._z,h=i._w,d=c+c,g=f+f,_=m+m,v=c*d,y=c*g,M=c*_,w=f*g,b=f*_,x=m*_,I=h*d,G=h*g,R=h*_,D=s.x,U=s.y,P=s.z;return l[0]=(1-(w+x))*D,l[1]=(y+R)*D,l[2]=(M-G)*D,l[3]=0,l[4]=(y-R)*U,l[5]=(1-(v+x))*U,l[6]=(b+I)*U,l[7]=0,l[8]=(M+G)*P,l[9]=(b-I)*P,l[10]=(1-(v+w))*P,l[11]=0,l[12]=e.x,l[13]=e.y,l[14]=e.z,l[15]=1,this}decompose(e,i,s){const l=this.elements;e.x=l[12],e.y=l[13],e.z=l[14];const c=this.determinantAffine();if(c===0)return s.set(1,1,1),i.identity(),this;let f=Cr.set(l[0],l[1],l[2]).length();const m=Cr.set(l[4],l[5],l[6]).length(),h=Cr.set(l[8],l[9],l[10]).length();c<0&&(f=-f),Oi.copy(this);const d=1/f,g=1/m,_=1/h;return Oi.elements[0]*=d,Oi.elements[1]*=d,Oi.elements[2]*=d,Oi.elements[4]*=g,Oi.elements[5]*=g,Oi.elements[6]*=g,Oi.elements[8]*=_,Oi.elements[9]*=_,Oi.elements[10]*=_,i.setFromRotationMatrix(Oi),s.x=f,s.y=m,s.z=h,this}makePerspective(e,i,s,l,c,f,m=Ji,h=!1){const d=this.elements,g=2*c/(i-e),_=2*c/(s-l),v=(i+e)/(i-e),y=(s+l)/(s-l);let M,w;if(h)M=c/(f-c),w=f*c/(f-c);else if(m===Ji)M=-(f+c)/(f-c),w=-2*f*c/(f-c);else if(m===sl)M=-f/(f-c),w=-f*c/(f-c);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+m);return d[0]=g,d[4]=0,d[8]=v,d[12]=0,d[1]=0,d[5]=_,d[9]=y,d[13]=0,d[2]=0,d[6]=0,d[10]=M,d[14]=w,d[3]=0,d[7]=0,d[11]=-1,d[15]=0,this}makeOrthographic(e,i,s,l,c,f,m=Ji,h=!1){const d=this.elements,g=2/(i-e),_=2/(s-l),v=-(i+e)/(i-e),y=-(s+l)/(s-l);let M,w;if(h)M=1/(f-c),w=f/(f-c);else if(m===Ji)M=-2/(f-c),w=-(f+c)/(f-c);else if(m===sl)M=-1/(f-c),w=-c/(f-c);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+m);return d[0]=g,d[4]=0,d[8]=0,d[12]=v,d[1]=0,d[5]=_,d[9]=0,d[13]=y,d[2]=0,d[6]=0,d[10]=M,d[14]=w,d[3]=0,d[7]=0,d[11]=0,d[15]=1,this}equals(e){const i=this.elements,s=e.elements;for(let l=0;l<16;l++)if(i[l]!==s[l])return!1;return!0}fromArray(e,i=0){for(let s=0;s<16;s++)this.elements[s]=e[s+i];return this}toArray(e=[],i=0){const s=this.elements;return e[i]=s[0],e[i+1]=s[1],e[i+2]=s[2],e[i+3]=s[3],e[i+4]=s[4],e[i+5]=s[5],e[i+6]=s[6],e[i+7]=s[7],e[i+8]=s[8],e[i+9]=s[9],e[i+10]=s[10],e[i+11]=s[11],e[i+12]=s[12],e[i+13]=s[13],e[i+14]=s[14],e[i+15]=s[15],e}};mu.prototype.isMatrix4=!0;let tn=mu;const Cr=new ee,Oi=new tn,rb=new ee(0,0,0),ob=new ee(1,1,1),ls=new ee,Ec=new ee,pi=new ee,F_=new tn,B_=new ps;class ms{constructor(e=0,i=0,s=0,l=ms.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=i,this._z=s,this._order=l}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,i,s,l=this._order){return this._x=e,this._y=i,this._z=s,this._order=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,i=this._order,s=!0){const l=e.elements,c=l[0],f=l[4],m=l[8],h=l[1],d=l[5],g=l[9],_=l[2],v=l[6],y=l[10];switch(i){case"XYZ":this._y=Math.asin(St(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(-g,y),this._z=Math.atan2(-f,c)):(this._x=Math.atan2(v,d),this._z=0);break;case"YXZ":this._x=Math.asin(-St(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(m,y),this._z=Math.atan2(h,d)):(this._y=Math.atan2(-_,c),this._z=0);break;case"ZXY":this._x=Math.asin(St(v,-1,1)),Math.abs(v)<.9999999?(this._y=Math.atan2(-_,y),this._z=Math.atan2(-f,d)):(this._y=0,this._z=Math.atan2(h,c));break;case"ZYX":this._y=Math.asin(-St(_,-1,1)),Math.abs(_)<.9999999?(this._x=Math.atan2(v,y),this._z=Math.atan2(h,c)):(this._x=0,this._z=Math.atan2(-f,d));break;case"YZX":this._z=Math.asin(St(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-g,d),this._y=Math.atan2(-_,c)):(this._x=0,this._y=Math.atan2(m,y));break;case"XZY":this._z=Math.asin(-St(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(v,d),this._y=Math.atan2(m,c)):(this._x=Math.atan2(-g,y),this._y=0);break;default:nt("Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,s===!0&&this._onChangeCallback(),this}setFromQuaternion(e,i,s){return F_.makeRotationFromQuaternion(e),this.setFromRotationMatrix(F_,i,s)}setFromVector3(e,i=this._order){return this.set(e.x,e.y,e.z,i)}reorder(e){return B_.setFromEuler(this),this.setFromQuaternion(B_,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ms.DEFAULT_ORDER="XYZ";class Mp{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let lb=0;const z_=new ee,wr=new ps,ba=new tn,Tc=new ee,Yo=new ee,cb=new ee,ub=new ps,H_=new ee(1,0,0),G_=new ee(0,1,0),V_=new ee(0,0,1),k_={type:"added"},fb={type:"removed"},Dr={type:"childadded",child:null},Xd={type:"childremoved",child:null};class On extends gs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:lb++}),this.uuid=ol(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=On.DEFAULT_UP.clone();const e=new ee,i=new ms,s=new ps,l=new ee(1,1,1);function c(){s.setFromEuler(i,!1)}function f(){i.setFromQuaternion(s,void 0,!1)}i._onChange(c),s._onChange(f),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:s},scale:{configurable:!0,enumerable:!0,value:l},modelViewMatrix:{value:new tn},normalMatrix:{value:new ot}}),this.matrix=new tn,this.matrixWorld=new tn,this.matrixAutoUpdate=On.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=On.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Mp,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,i){this.quaternion.setFromAxisAngle(e,i)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,i){return wr.setFromAxisAngle(e,i),this.quaternion.multiply(wr),this}rotateOnWorldAxis(e,i){return wr.setFromAxisAngle(e,i),this.quaternion.premultiply(wr),this}rotateX(e){return this.rotateOnAxis(H_,e)}rotateY(e){return this.rotateOnAxis(G_,e)}rotateZ(e){return this.rotateOnAxis(V_,e)}translateOnAxis(e,i){return z_.copy(e).applyQuaternion(this.quaternion),this.position.add(z_.multiplyScalar(i)),this}translateX(e){return this.translateOnAxis(H_,e)}translateY(e){return this.translateOnAxis(G_,e)}translateZ(e){return this.translateOnAxis(V_,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ba.copy(this.matrixWorld).invert())}lookAt(e,i,s){e.isVector3?Tc.copy(e):Tc.set(e,i,s);const l=this.parent;this.updateWorldMatrix(!0,!1),Yo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ba.lookAt(Yo,Tc,this.up):ba.lookAt(Tc,Yo,this.up),this.quaternion.setFromRotationMatrix(ba),l&&(ba.extractRotation(l.matrixWorld),wr.setFromRotationMatrix(ba),this.quaternion.premultiply(wr.invert()))}add(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return e===this?(Ct("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(k_),Dr.child=e,this.dispatchEvent(Dr),Dr.child=null):Ct("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let s=0;s<arguments.length;s++)this.remove(arguments[s]);return this}const i=this.children.indexOf(e);return i!==-1&&(e.parent=null,this.children.splice(i,1),e.dispatchEvent(fb),Xd.child=e,this.dispatchEvent(Xd),Xd.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ba.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ba.multiply(e.parent.matrixWorld)),e.applyMatrix4(ba),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(k_),Dr.child=e,this.dispatchEvent(Dr),Dr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,i){if(this[e]===i)return this;for(let s=0,l=this.children.length;s<l;s++){const f=this.children[s].getObjectByProperty(e,i);if(f!==void 0)return f}}getObjectsByProperty(e,i,s=[]){this[e]===i&&s.push(this);const l=this.children;for(let c=0,f=l.length;c<f;c++)l[c].getObjectsByProperty(e,i,s);return s}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yo,e,cb),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yo,ub,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const i=this.matrixWorld.elements;return e.set(i[8],i[9],i[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].traverseVisible(e)}traverseAncestors(e){const i=this.parent;i!==null&&(e(i),i.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const i=e.x,s=e.y,l=e.z,c=this.matrix.elements;c[12]+=i-c[0]*i-c[4]*s-c[8]*l,c[13]+=s-c[1]*i-c[5]*s-c[9]*l,c[14]+=l-c[2]*i-c[6]*s-c[10]*l}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].updateMatrixWorld(e)}updateWorldMatrix(e,i,s=!1){const l=this.parent;if(e===!0&&l!==null&&l.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||s)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,s=!0),i===!0){const c=this.children;for(let f=0,m=c.length;f<m;f++)c[f].updateWorldMatrix(!1,!0,s)}}toJSON(e){const i=e===void 0||typeof e=="string",s={};i&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},s.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const l={};l.uuid=this.uuid,l.type=this.type,l.name=this.name,l.castShadow=this.castShadow,l.receiveShadow=this.receiveShadow,l.visible=this.visible,l.frustumCulled=this.frustumCulled,l.renderOrder=this.renderOrder,l.static=this.static,l.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(l.userData=this.userData),l.layers=this.layers.mask,l.matrix=this.matrix.toArray(),l.up=this.up.toArray(),this.pivot!==null&&(l.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(l.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(l.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(l.type="InstancedMesh",l.count=this.count,l.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(l.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(l.type="BatchedMesh",l.perObjectFrustumCulled=this.perObjectFrustumCulled,l.sortObjects=this.sortObjects,l.drawRanges=this._drawRanges,l.reservedRanges=this._reservedRanges,l.geometryInfo=this._geometryInfo.map(m=>({...m,boundingBox:m.boundingBox?m.boundingBox.toJSON():void 0,boundingSphere:m.boundingSphere?m.boundingSphere.toJSON():void 0})),l.instanceInfo=this._instanceInfo.map(m=>({...m})),l.availableInstanceIds=this._availableInstanceIds.slice(),l.availableGeometryIds=this._availableGeometryIds.slice(),l.nextIndexStart=this._nextIndexStart,l.nextVertexStart=this._nextVertexStart,l.geometryCount=this._geometryCount,l.maxInstanceCount=this._maxInstanceCount,l.maxVertexCount=this._maxVertexCount,l.maxIndexCount=this._maxIndexCount,l.geometryInitialized=this._geometryInitialized,l.matricesTexture=this._matricesTexture.toJSON(e),l.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(l.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(l.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(l.boundingBox=this.boundingBox.toJSON()));function c(m,h){return m[h.uuid]===void 0&&(m[h.uuid]=h.toJSON(e)),h.uuid}if(this.isScene)this.background&&(this.background.isColor?l.background=this.background.toJSON():this.background.isTexture&&(l.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(l.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){l.geometry=c(e.geometries,this.geometry);const m=this.geometry.parameters;if(m!==void 0&&m.shapes!==void 0){const h=m.shapes;if(Array.isArray(h))for(let d=0,g=h.length;d<g;d++){const _=h[d];c(e.shapes,_)}else c(e.shapes,h)}}if(this.isSkinnedMesh&&(l.bindMode=this.bindMode,l.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(c(e.skeletons,this.skeleton),l.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const m=[];for(let h=0,d=this.material.length;h<d;h++)m.push(c(e.materials,this.material[h]));l.material=m}else l.material=c(e.materials,this.material);if(this.children.length>0){l.children=[];for(let m=0;m<this.children.length;m++)l.children.push(this.children[m].toJSON(e).object)}if(this.animations.length>0){l.animations=[];for(let m=0;m<this.animations.length;m++){const h=this.animations[m];l.animations.push(c(e.animations,h))}}if(i){const m=f(e.geometries),h=f(e.materials),d=f(e.textures),g=f(e.images),_=f(e.shapes),v=f(e.skeletons),y=f(e.animations),M=f(e.nodes);m.length>0&&(s.geometries=m),h.length>0&&(s.materials=h),d.length>0&&(s.textures=d),g.length>0&&(s.images=g),_.length>0&&(s.shapes=_),v.length>0&&(s.skeletons=v),y.length>0&&(s.animations=y),M.length>0&&(s.nodes=M)}return s.object=l,s;function f(m){const h=[];for(const d in m){const g=m[d];delete g.metadata,h.push(g)}return h}}clone(e){return new this.constructor().copy(this,e)}copy(e,i=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),i===!0)for(let s=0;s<e.children.length;s++){const l=e.children[s];this.add(l.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}On.DEFAULT_UP=new ee(0,1,0);On.DEFAULT_MATRIX_AUTO_UPDATE=!0;On.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Ac extends On{constructor(){super(),this.isGroup=!0,this.type="Group"}}const db={type:"move"};class Wd{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ac,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ac,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new ee,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new ee),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ac,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new ee,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new ee,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const i=this._hand;if(i)for(const s of e.hand.values())this._getHandJoint(i,s)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,i,s){let l=null,c=null,f=null;const m=this._targetRay,h=this._grip,d=this._hand;if(e&&i.session.visibilityState!=="visible-blurred"){if(d&&e.hand){f=!0;for(const w of e.hand.values()){const b=i.getJointPose(w,s),x=this._getHandJoint(d,w);b!==null&&(x.matrix.fromArray(b.transform.matrix),x.matrix.decompose(x.position,x.rotation,x.scale),x.matrixWorldNeedsUpdate=!0,x.jointRadius=b.radius),x.visible=b!==null}const g=d.joints["index-finger-tip"],_=d.joints["thumb-tip"],v=g.position.distanceTo(_.position),y=.02,M=.005;d.inputState.pinching&&v>y+M?(d.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!d.inputState.pinching&&v<=y-M&&(d.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else h!==null&&e.gripSpace&&(c=i.getPose(e.gripSpace,s),c!==null&&(h.matrix.fromArray(c.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,c.linearVelocity?(h.hasLinearVelocity=!0,h.linearVelocity.copy(c.linearVelocity)):h.hasLinearVelocity=!1,c.angularVelocity?(h.hasAngularVelocity=!0,h.angularVelocity.copy(c.angularVelocity)):h.hasAngularVelocity=!1,h.eventsEnabled&&h.dispatchEvent({type:"gripUpdated",data:e,target:this})));m!==null&&(l=i.getPose(e.targetRaySpace,s),l===null&&c!==null&&(l=c),l!==null&&(m.matrix.fromArray(l.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,l.linearVelocity?(m.hasLinearVelocity=!0,m.linearVelocity.copy(l.linearVelocity)):m.hasLinearVelocity=!1,l.angularVelocity?(m.hasAngularVelocity=!0,m.angularVelocity.copy(l.angularVelocity)):m.hasAngularVelocity=!1,this.dispatchEvent(db)))}return m!==null&&(m.visible=l!==null),h!==null&&(h.visible=c!==null),d!==null&&(d.visible=f!==null),this}_getHandJoint(e,i){if(e.joints[i.jointName]===void 0){const s=new Ac;s.matrixAutoUpdate=!1,s.visible=!1,e.joints[i.jointName]=s,e.add(s)}return e.joints[i.jointName]}}const sx={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},cs={h:0,s:0,l:0},Rc={h:0,s:0,l:0};function Yd(r,e,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?r+(e-r)*6*i:i<1/2?e:i<2/3?r+(e-r)*6*(2/3-i):r}class _t{constructor(e,i,s){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,i,s)}set(e,i,s){if(i===void 0&&s===void 0){const l=e;l&&l.isColor?this.copy(l):typeof l=="number"?this.setHex(l):typeof l=="string"&&this.setStyle(l)}else this.setRGB(e,i,s);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,i=Ci){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Tt.colorSpaceToWorking(this,i),this}setRGB(e,i,s,l=Tt.workingColorSpace){return this.r=e,this.g=i,this.b=s,Tt.colorSpaceToWorking(this,l),this}setHSL(e,i,s,l=Tt.workingColorSpace){if(e=JM(e,1),i=St(i,0,1),s=St(s,0,1),i===0)this.r=this.g=this.b=s;else{const c=s<=.5?s*(1+i):s+i-s*i,f=2*s-c;this.r=Yd(f,c,e+1/3),this.g=Yd(f,c,e),this.b=Yd(f,c,e-1/3)}return Tt.colorSpaceToWorking(this,l),this}setStyle(e,i=Ci){function s(c){c!==void 0&&parseFloat(c)<1&&nt("Color: Alpha component of "+e+" will be ignored.")}let l;if(l=/^(\w+)\(([^\)]*)\)/.exec(e)){let c;const f=l[1],m=l[2];switch(f){case"rgb":case"rgba":if(c=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(m))return s(c[4]),this.setRGB(Math.min(255,parseInt(c[1],10))/255,Math.min(255,parseInt(c[2],10))/255,Math.min(255,parseInt(c[3],10))/255,i);if(c=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(m))return s(c[4]),this.setRGB(Math.min(100,parseInt(c[1],10))/100,Math.min(100,parseInt(c[2],10))/100,Math.min(100,parseInt(c[3],10))/100,i);break;case"hsl":case"hsla":if(c=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(m))return s(c[4]),this.setHSL(parseFloat(c[1])/360,parseFloat(c[2])/100,parseFloat(c[3])/100,i);break;default:nt("Color: Unknown color model "+e)}}else if(l=/^\#([A-Fa-f\d]+)$/.exec(e)){const c=l[1],f=c.length;if(f===3)return this.setRGB(parseInt(c.charAt(0),16)/15,parseInt(c.charAt(1),16)/15,parseInt(c.charAt(2),16)/15,i);if(f===6)return this.setHex(parseInt(c,16),i);nt("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,i);return this}setColorName(e,i=Ci){const s=sx[e.toLowerCase()];return s!==void 0?this.setHex(s,i):nt("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Na(e.r),this.g=Na(e.g),this.b=Na(e.b),this}copyLinearToSRGB(e){return this.r=Yr(e.r),this.g=Yr(e.g),this.b=Yr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ci){return Tt.workingToColorSpace(Fn.copy(this),e),Math.round(St(Fn.r*255,0,255))*65536+Math.round(St(Fn.g*255,0,255))*256+Math.round(St(Fn.b*255,0,255))}getHexString(e=Ci){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,i=Tt.workingColorSpace){Tt.workingToColorSpace(Fn.copy(this),i);const s=Fn.r,l=Fn.g,c=Fn.b,f=Math.max(s,l,c),m=Math.min(s,l,c);let h,d;const g=(m+f)/2;if(m===f)h=0,d=0;else{const _=f-m;switch(d=g<=.5?_/(f+m):_/(2-f-m),f){case s:h=(l-c)/_+(l<c?6:0);break;case l:h=(c-s)/_+2;break;case c:h=(s-l)/_+4;break}h/=6}return e.h=h,e.s=d,e.l=g,e}getRGB(e,i=Tt.workingColorSpace){return Tt.workingToColorSpace(Fn.copy(this),i),e.r=Fn.r,e.g=Fn.g,e.b=Fn.b,e}getStyle(e=Ci){Tt.workingToColorSpace(Fn.copy(this),e);const i=Fn.r,s=Fn.g,l=Fn.b;return e!==Ci?`color(${e} ${i.toFixed(3)} ${s.toFixed(3)} ${l.toFixed(3)})`:`rgb(${Math.round(i*255)},${Math.round(s*255)},${Math.round(l*255)})`}offsetHSL(e,i,s){return this.getHSL(cs),this.setHSL(cs.h+e,cs.s+i,cs.l+s)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,i){return this.r=e.r+i.r,this.g=e.g+i.g,this.b=e.b+i.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,i){return this.r+=(e.r-this.r)*i,this.g+=(e.g-this.g)*i,this.b+=(e.b-this.b)*i,this}lerpColors(e,i,s){return this.r=e.r+(i.r-e.r)*s,this.g=e.g+(i.g-e.g)*s,this.b=e.b+(i.b-e.b)*s,this}lerpHSL(e,i){this.getHSL(cs),e.getHSL(Rc);const s=zd(cs.h,Rc.h,i),l=zd(cs.s,Rc.s,i),c=zd(cs.l,Rc.l,i);return this.setHSL(s,l,c),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const i=this.r,s=this.g,l=this.b,c=e.elements;return this.r=c[0]*i+c[3]*s+c[6]*l,this.g=c[1]*i+c[4]*s+c[7]*l,this.b=c[2]*i+c[5]*s+c[8]*l,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,i=0){return this.r=e[i],this.g=e[i+1],this.b=e[i+2],this}toArray(e=[],i=0){return e[i]=this.r,e[i+1]=this.g,e[i+2]=this.b,e}fromBufferAttribute(e,i){return this.r=e.getX(i),this.g=e.getY(i),this.b=e.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Fn=new _t;_t.NAMES=sx;class hb extends On{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ms,this.environmentIntensity=1,this.environmentRotation=new ms,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,i){return super.copy(e,i),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const i=super.toJSON(e);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),i.object.backgroundBlurriness=this.backgroundBlurriness,i.object.backgroundIntensity=this.backgroundIntensity,i.object.backgroundRotation=this.backgroundRotation.toArray(),i.object.environmentIntensity=this.environmentIntensity,i.object.environmentRotation=this.environmentRotation.toArray(),i}}const Pi=new ee,Ea=new ee,qd=new ee,Ta=new ee,Nr=new ee,Ur=new ee,X_=new ee,Zd=new ee,jd=new ee,Kd=new ee,Qd=new nn,Jd=new nn,$d=new nn;class Fi{constructor(e=new ee,i=new ee,s=new ee){this.a=e,this.b=i,this.c=s}static getNormal(e,i,s,l){l.subVectors(s,i),Pi.subVectors(e,i),l.cross(Pi);const c=l.lengthSq();return c>0?l.multiplyScalar(1/Math.sqrt(c)):l.set(0,0,0)}static getBarycoord(e,i,s,l,c){Pi.subVectors(l,i),Ea.subVectors(s,i),qd.subVectors(e,i);const f=Pi.dot(Pi),m=Pi.dot(Ea),h=Pi.dot(qd),d=Ea.dot(Ea),g=Ea.dot(qd),_=f*d-m*m;if(_===0)return c.set(0,0,0),null;const v=1/_,y=(d*h-m*g)*v,M=(f*g-m*h)*v;return c.set(1-y-M,M,y)}static containsPoint(e,i,s,l){return this.getBarycoord(e,i,s,l,Ta)===null?!1:Ta.x>=0&&Ta.y>=0&&Ta.x+Ta.y<=1}static getInterpolation(e,i,s,l,c,f,m,h){return this.getBarycoord(e,i,s,l,Ta)===null?(h.x=0,h.y=0,"z"in h&&(h.z=0),"w"in h&&(h.w=0),null):(h.setScalar(0),h.addScaledVector(c,Ta.x),h.addScaledVector(f,Ta.y),h.addScaledVector(m,Ta.z),h)}static getInterpolatedAttribute(e,i,s,l,c,f){return Qd.setScalar(0),Jd.setScalar(0),$d.setScalar(0),Qd.fromBufferAttribute(e,i),Jd.fromBufferAttribute(e,s),$d.fromBufferAttribute(e,l),f.setScalar(0),f.addScaledVector(Qd,c.x),f.addScaledVector(Jd,c.y),f.addScaledVector($d,c.z),f}static isFrontFacing(e,i,s,l){return Pi.subVectors(s,i),Ea.subVectors(e,i),Pi.cross(Ea).dot(l)<0}set(e,i,s){return this.a.copy(e),this.b.copy(i),this.c.copy(s),this}setFromPointsAndIndices(e,i,s,l){return this.a.copy(e[i]),this.b.copy(e[s]),this.c.copy(e[l]),this}setFromAttributeAndIndices(e,i,s,l){return this.a.fromBufferAttribute(e,i),this.b.fromBufferAttribute(e,s),this.c.fromBufferAttribute(e,l),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Pi.subVectors(this.c,this.b),Ea.subVectors(this.a,this.b),Pi.cross(Ea).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Fi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,i){return Fi.getBarycoord(e,this.a,this.b,this.c,i)}getInterpolation(e,i,s,l,c){return Fi.getInterpolation(e,this.a,this.b,this.c,i,s,l,c)}containsPoint(e){return Fi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Fi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,i){const s=this.a,l=this.b,c=this.c;let f,m;Nr.subVectors(l,s),Ur.subVectors(c,s),Zd.subVectors(e,s);const h=Nr.dot(Zd),d=Ur.dot(Zd);if(h<=0&&d<=0)return i.copy(s);jd.subVectors(e,l);const g=Nr.dot(jd),_=Ur.dot(jd);if(g>=0&&_<=g)return i.copy(l);const v=h*_-g*d;if(v<=0&&h>=0&&g<=0)return f=h/(h-g),i.copy(s).addScaledVector(Nr,f);Kd.subVectors(e,c);const y=Nr.dot(Kd),M=Ur.dot(Kd);if(M>=0&&y<=M)return i.copy(c);const w=y*d-h*M;if(w<=0&&d>=0&&M<=0)return m=d/(d-M),i.copy(s).addScaledVector(Ur,m);const b=g*M-y*_;if(b<=0&&_-g>=0&&y-M>=0)return X_.subVectors(c,l),m=(_-g)/(_-g+(y-M)),i.copy(l).addScaledVector(X_,m);const x=1/(b+w+v);return f=w*x,m=v*x,i.copy(s).addScaledVector(Nr,f).addScaledVector(Ur,m)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class ll{constructor(e=new ee(1/0,1/0,1/0),i=new ee(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=i}set(e,i){return this.min.copy(e),this.max.copy(i),this}setFromArray(e){this.makeEmpty();for(let i=0,s=e.length;i<s;i+=3)this.expandByPoint(Ii.fromArray(e,i));return this}setFromBufferAttribute(e){this.makeEmpty();for(let i=0,s=e.count;i<s;i++)this.expandByPoint(Ii.fromBufferAttribute(e,i));return this}setFromPoints(e){this.makeEmpty();for(let i=0,s=e.length;i<s;i++)this.expandByPoint(e[i]);return this}setFromCenterAndSize(e,i){const s=Ii.copy(i).multiplyScalar(.5);return this.min.copy(e).sub(s),this.max.copy(e).add(s),this}setFromObject(e,i=!1){return this.makeEmpty(),this.expandByObject(e,i)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,i=!1){e.updateWorldMatrix(!1,!1);const s=e.geometry;if(s!==void 0){const c=s.getAttribute("position");if(i===!0&&c!==void 0&&e.isInstancedMesh!==!0)for(let f=0,m=c.count;f<m;f++)e.isMesh===!0?e.getVertexPosition(f,Ii):Ii.fromBufferAttribute(c,f),Ii.applyMatrix4(e.matrixWorld),this.expandByPoint(Ii);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Cc.copy(e.boundingBox)):(s.boundingBox===null&&s.computeBoundingBox(),Cc.copy(s.boundingBox)),Cc.applyMatrix4(e.matrixWorld),this.union(Cc)}const l=e.children;for(let c=0,f=l.length;c<f;c++)this.expandByObject(l[c],i);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,i){return i.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ii),Ii.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let i,s;return e.normal.x>0?(i=e.normal.x*this.min.x,s=e.normal.x*this.max.x):(i=e.normal.x*this.max.x,s=e.normal.x*this.min.x),e.normal.y>0?(i+=e.normal.y*this.min.y,s+=e.normal.y*this.max.y):(i+=e.normal.y*this.max.y,s+=e.normal.y*this.min.y),e.normal.z>0?(i+=e.normal.z*this.min.z,s+=e.normal.z*this.max.z):(i+=e.normal.z*this.max.z,s+=e.normal.z*this.min.z),i<=-e.constant&&s>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(qo),wc.subVectors(this.max,qo),Lr.subVectors(e.a,qo),Or.subVectors(e.b,qo),Pr.subVectors(e.c,qo),us.subVectors(Or,Lr),fs.subVectors(Pr,Or),Is.subVectors(Lr,Pr);let i=[0,-us.z,us.y,0,-fs.z,fs.y,0,-Is.z,Is.y,us.z,0,-us.x,fs.z,0,-fs.x,Is.z,0,-Is.x,-us.y,us.x,0,-fs.y,fs.x,0,-Is.y,Is.x,0];return!eh(i,Lr,Or,Pr,wc)||(i=[1,0,0,0,1,0,0,0,1],!eh(i,Lr,Or,Pr,wc))?!1:(Dc.crossVectors(us,fs),i=[Dc.x,Dc.y,Dc.z],eh(i,Lr,Or,Pr,wc))}clampPoint(e,i){return i.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ii).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ii).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Aa[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Aa[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Aa[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Aa[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Aa[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Aa[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Aa[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Aa[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Aa),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Aa=[new ee,new ee,new ee,new ee,new ee,new ee,new ee,new ee],Ii=new ee,Cc=new ll,Lr=new ee,Or=new ee,Pr=new ee,us=new ee,fs=new ee,Is=new ee,qo=new ee,wc=new ee,Dc=new ee,Fs=new ee;function eh(r,e,i,s,l){for(let c=0,f=r.length-3;c<=f;c+=3){Fs.fromArray(r,c);const m=l.x*Math.abs(Fs.x)+l.y*Math.abs(Fs.y)+l.z*Math.abs(Fs.z),h=e.dot(Fs),d=i.dot(Fs),g=s.dot(Fs);if(Math.max(-Math.max(h,d,g),Math.min(h,d,g))>m)return!1}return!0}const vn=new ee,Nc=new at;let pb=0;class ni extends gs{constructor(e,i,s=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:pb++}),this.name="",this.array=e,this.itemSize=i,this.count=e!==void 0?e.length/i:0,this.normalized=s,this.usage=qM,this.updateRanges=[],this.gpuType=Qi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,i,s){e*=this.itemSize,s*=i.itemSize;for(let l=0,c=this.itemSize;l<c;l++)this.array[e+l]=i.array[s+l];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let i=0,s=this.count;i<s;i++)Nc.fromBufferAttribute(this,i),Nc.applyMatrix3(e),this.setXY(i,Nc.x,Nc.y);else if(this.itemSize===3)for(let i=0,s=this.count;i<s;i++)vn.fromBufferAttribute(this,i),vn.applyMatrix3(e),this.setXYZ(i,vn.x,vn.y,vn.z);return this}applyMatrix4(e){for(let i=0,s=this.count;i<s;i++)vn.fromBufferAttribute(this,i),vn.applyMatrix4(e),this.setXYZ(i,vn.x,vn.y,vn.z);return this}applyNormalMatrix(e){for(let i=0,s=this.count;i<s;i++)vn.fromBufferAttribute(this,i),vn.applyNormalMatrix(e),this.setXYZ(i,vn.x,vn.y,vn.z);return this}transformDirection(e){for(let i=0,s=this.count;i<s;i++)vn.fromBufferAttribute(this,i),vn.transformDirection(e),this.setXYZ(i,vn.x,vn.y,vn.z);return this}set(e,i=0){return this.array.set(e,i),this}getComponent(e,i){let s=this.array[e*this.itemSize+i];return this.normalized&&(s=Wo(s,this.array)),s}setComponent(e,i,s){return this.normalized&&(s=ei(s,this.array)),this.array[e*this.itemSize+i]=s,this}getX(e){let i=this.array[e*this.itemSize];return this.normalized&&(i=Wo(i,this.array)),i}setX(e,i){return this.normalized&&(i=ei(i,this.array)),this.array[e*this.itemSize]=i,this}getY(e){let i=this.array[e*this.itemSize+1];return this.normalized&&(i=Wo(i,this.array)),i}setY(e,i){return this.normalized&&(i=ei(i,this.array)),this.array[e*this.itemSize+1]=i,this}getZ(e){let i=this.array[e*this.itemSize+2];return this.normalized&&(i=Wo(i,this.array)),i}setZ(e,i){return this.normalized&&(i=ei(i,this.array)),this.array[e*this.itemSize+2]=i,this}getW(e){let i=this.array[e*this.itemSize+3];return this.normalized&&(i=Wo(i,this.array)),i}setW(e,i){return this.normalized&&(i=ei(i,this.array)),this.array[e*this.itemSize+3]=i,this}setXY(e,i,s){return e*=this.itemSize,this.normalized&&(i=ei(i,this.array),s=ei(s,this.array)),this.array[e+0]=i,this.array[e+1]=s,this}setXYZ(e,i,s,l){return e*=this.itemSize,this.normalized&&(i=ei(i,this.array),s=ei(s,this.array),l=ei(l,this.array)),this.array[e+0]=i,this.array[e+1]=s,this.array[e+2]=l,this}setXYZW(e,i,s,l,c){return e*=this.itemSize,this.normalized&&(i=ei(i,this.array),s=ei(s,this.array),l=ei(l,this.array),c=ei(c,this.array)),this.array[e+0]=i,this.array[e+1]=s,this.array[e+2]=l,this.array[e+3]=c,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class rx extends ni{constructor(e,i,s){super(new Uint16Array(e),i,s)}}class ox extends ni{constructor(e,i,s){super(new Uint32Array(e),i,s)}}class Xn extends ni{constructor(e,i,s){super(new Float32Array(e),i,s)}}const mb=new ll,Zo=new ee,th=new ee;class _u{constructor(e=new ee,i=-1){this.isSphere=!0,this.center=e,this.radius=i}set(e,i){return this.center.copy(e),this.radius=i,this}setFromPoints(e,i){const s=this.center;i!==void 0?s.copy(i):mb.setFromPoints(e).getCenter(s);let l=0;for(let c=0,f=e.length;c<f;c++)l=Math.max(l,s.distanceToSquared(e[c]));return this.radius=Math.sqrt(l),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const i=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=i*i}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,i){const s=this.center.distanceToSquared(e);return i.copy(e),s>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Zo.subVectors(e,this.center);const i=Zo.lengthSq();if(i>this.radius*this.radius){const s=Math.sqrt(i),l=(s-this.radius)*.5;this.center.addScaledVector(Zo,l/s),this.radius+=l}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(th.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Zo.copy(e.center).add(th)),this.expandByPoint(Zo.copy(e.center).sub(th))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let gb=0;const Ri=new tn,nh=new On,Ir=new ee,mi=new ll,jo=new ll,Rn=new ee;class ai extends gs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:gb++}),this.uuid=ol(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ZM(e)?ox:rx)(e,1):this.index=e,this}setIndirect(e,i=0){return this.indirect=e,this.indirectOffset=i,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,i){return this.attributes[e]=i,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,i,s=0){this.groups.push({start:e,count:i,materialIndex:s})}clearGroups(){this.groups=[]}setDrawRange(e,i){this.drawRange.start=e,this.drawRange.count=i}applyMatrix4(e){const i=this.attributes.position;i!==void 0&&(i.applyMatrix4(e),i.needsUpdate=!0);const s=this.attributes.normal;if(s!==void 0){const c=new ot().getNormalMatrix(e);s.applyNormalMatrix(c),s.needsUpdate=!0}const l=this.attributes.tangent;return l!==void 0&&(l.transformDirection(e),l.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Ri.makeRotationFromQuaternion(e),this.applyMatrix4(Ri),this}rotateX(e){return Ri.makeRotationX(e),this.applyMatrix4(Ri),this}rotateY(e){return Ri.makeRotationY(e),this.applyMatrix4(Ri),this}rotateZ(e){return Ri.makeRotationZ(e),this.applyMatrix4(Ri),this}translate(e,i,s){return Ri.makeTranslation(e,i,s),this.applyMatrix4(Ri),this}scale(e,i,s){return Ri.makeScale(e,i,s),this.applyMatrix4(Ri),this}lookAt(e){return nh.lookAt(e),nh.updateMatrix(),this.applyMatrix4(nh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ir).negate(),this.translate(Ir.x,Ir.y,Ir.z),this}setFromPoints(e){const i=this.getAttribute("position");if(i===void 0){const s=[];for(let l=0,c=e.length;l<c;l++){const f=e[l];s.push(f.x,f.y,f.z||0)}this.setAttribute("position",new Xn(s,3))}else{const s=Math.min(e.length,i.count);for(let l=0;l<s;l++){const c=e[l];i.setXYZ(l,c.x,c.y,c.z||0)}e.length>i.count&&nt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ll);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ct("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new ee(-1/0,-1/0,-1/0),new ee(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),i)for(let s=0,l=i.length;s<l;s++){const c=i[s];mi.setFromBufferAttribute(c),this.morphTargetsRelative?(Rn.addVectors(this.boundingBox.min,mi.min),this.boundingBox.expandByPoint(Rn),Rn.addVectors(this.boundingBox.max,mi.max),this.boundingBox.expandByPoint(Rn)):(this.boundingBox.expandByPoint(mi.min),this.boundingBox.expandByPoint(mi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ct('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new _u);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ct("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new ee,1/0);return}if(e){const s=this.boundingSphere.center;if(mi.setFromBufferAttribute(e),i)for(let c=0,f=i.length;c<f;c++){const m=i[c];jo.setFromBufferAttribute(m),this.morphTargetsRelative?(Rn.addVectors(mi.min,jo.min),mi.expandByPoint(Rn),Rn.addVectors(mi.max,jo.max),mi.expandByPoint(Rn)):(mi.expandByPoint(jo.min),mi.expandByPoint(jo.max))}mi.getCenter(s);let l=0;for(let c=0,f=e.count;c<f;c++)Rn.fromBufferAttribute(e,c),l=Math.max(l,s.distanceToSquared(Rn));if(i)for(let c=0,f=i.length;c<f;c++){const m=i[c],h=this.morphTargetsRelative;for(let d=0,g=m.count;d<g;d++)Rn.fromBufferAttribute(m,d),h&&(Ir.fromBufferAttribute(e,d),Rn.add(Ir)),l=Math.max(l,s.distanceToSquared(Rn))}this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&Ct('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,i=this.attributes;if(e===null||i.position===void 0||i.normal===void 0||i.uv===void 0){Ct("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const s=i.position,l=i.normal,c=i.uv;let f=this.getAttribute("tangent");(f===void 0||f.count!==s.count)&&(f=new ni(new Float32Array(4*s.count),4),this.setAttribute("tangent",f));const m=[],h=[];for(let T=0;T<s.count;T++)m[T]=new ee,h[T]=new ee;const d=new ee,g=new ee,_=new ee,v=new at,y=new at,M=new at,w=new ee,b=new ee;function x(T,N,z){d.fromBufferAttribute(s,T),g.fromBufferAttribute(s,N),_.fromBufferAttribute(s,z),v.fromBufferAttribute(c,T),y.fromBufferAttribute(c,N),M.fromBufferAttribute(c,z),g.sub(d),_.sub(d),y.sub(v),M.sub(v);const q=1/(y.x*M.y-M.x*y.y);isFinite(q)&&(w.copy(g).multiplyScalar(M.y).addScaledVector(_,-y.y).multiplyScalar(q),b.copy(_).multiplyScalar(y.x).addScaledVector(g,-M.x).multiplyScalar(q),m[T].add(w),m[N].add(w),m[z].add(w),h[T].add(b),h[N].add(b),h[z].add(b))}let I=this.groups;I.length===0&&(I=[{start:0,count:e.count}]);for(let T=0,N=I.length;T<N;++T){const z=I[T],q=z.start,$=z.count;for(let j=q,X=q+$;j<X;j+=3)x(e.getX(j+0),e.getX(j+1),e.getX(j+2))}const G=new ee,R=new ee,D=new ee,U=new ee;function P(T){D.fromBufferAttribute(l,T),U.copy(D);const N=m[T];G.copy(N),G.sub(D.multiplyScalar(D.dot(N))).normalize(),R.crossVectors(U,N);const q=R.dot(h[T])<0?-1:1;f.setXYZW(T,G.x,G.y,G.z,q)}for(let T=0,N=I.length;T<N;++T){const z=I[T],q=z.start,$=z.count;for(let j=q,X=q+$;j<X;j+=3)P(e.getX(j+0)),P(e.getX(j+1)),P(e.getX(j+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,i=this.getAttribute("position");if(i!==void 0){let s=this.getAttribute("normal");if(s===void 0||s.count!==i.count)s=new ni(new Float32Array(i.count*3),3),this.setAttribute("normal",s);else for(let v=0,y=s.count;v<y;v++)s.setXYZ(v,0,0,0);const l=new ee,c=new ee,f=new ee,m=new ee,h=new ee,d=new ee,g=new ee,_=new ee;if(e)for(let v=0,y=e.count;v<y;v+=3){const M=e.getX(v+0),w=e.getX(v+1),b=e.getX(v+2);l.fromBufferAttribute(i,M),c.fromBufferAttribute(i,w),f.fromBufferAttribute(i,b),g.subVectors(f,c),_.subVectors(l,c),g.cross(_),m.fromBufferAttribute(s,M),h.fromBufferAttribute(s,w),d.fromBufferAttribute(s,b),m.add(g),h.add(g),d.add(g),s.setXYZ(M,m.x,m.y,m.z),s.setXYZ(w,h.x,h.y,h.z),s.setXYZ(b,d.x,d.y,d.z)}else for(let v=0,y=i.count;v<y;v+=3)l.fromBufferAttribute(i,v+0),c.fromBufferAttribute(i,v+1),f.fromBufferAttribute(i,v+2),g.subVectors(f,c),_.subVectors(l,c),g.cross(_),s.setXYZ(v+0,g.x,g.y,g.z),s.setXYZ(v+1,g.x,g.y,g.z),s.setXYZ(v+2,g.x,g.y,g.z);this.normalizeNormals(),s.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let i=0,s=e.count;i<s;i++)Rn.fromBufferAttribute(e,i),Rn.normalize(),e.setXYZ(i,Rn.x,Rn.y,Rn.z)}toNonIndexed(){function e(m,h){const d=m.array,g=m.itemSize,_=m.normalized,v=new d.constructor(h.length*g);let y=0,M=0;for(let w=0,b=h.length;w<b;w++){m.isInterleavedBufferAttribute?y=h[w]*m.data.stride+m.offset:y=h[w]*g;for(let x=0;x<g;x++)v[M++]=d[y++]}return new ni(v,g,_)}if(this.index===null)return nt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const i=new ai,s=this.index.array,l=this.attributes;for(const m in l){const h=l[m],d=e(h,s);i.setAttribute(m,d)}const c=this.morphAttributes;for(const m in c){const h=[],d=c[m];for(let g=0,_=d.length;g<_;g++){const v=d[g],y=e(v,s);h.push(y)}i.morphAttributes[m]=h}i.morphTargetsRelative=this.morphTargetsRelative;const f=this.groups;for(let m=0,h=f.length;m<h;m++){const d=f[m];i.addGroup(d.start,d.count,d.materialIndex)}return i}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const h=this.parameters;for(const d in h)h[d]!==void 0&&(e[d]=h[d]);return e}e.data={attributes:{}};const i=this.index;i!==null&&(e.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});const s=this.attributes;for(const h in s){const d=s[h];e.data.attributes[h]=d.toJSON(e.data)}const l={};let c=!1;for(const h in this.morphAttributes){const d=this.morphAttributes[h],g=[];for(let _=0,v=d.length;_<v;_++){const y=d[_];g.push(y.toJSON(e.data))}g.length>0&&(l[h]=g,c=!0)}c&&(e.data.morphAttributes=l,e.data.morphTargetsRelative=this.morphTargetsRelative);const f=this.groups;f.length>0&&(e.data.groups=JSON.parse(JSON.stringify(f)));const m=this.boundingSphere;return m!==null&&(e.data.boundingSphere=m.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const i={};this.name=e.name;const s=e.index;s!==null&&this.setIndex(s.clone());const l=e.attributes;for(const d in l){const g=l[d];this.setAttribute(d,g.clone(i))}const c=e.morphAttributes;for(const d in c){const g=[],_=c[d];for(let v=0,y=_.length;v<y;v++)g.push(_[v].clone(i));this.morphAttributes[d]=g}this.morphTargetsRelative=e.morphTargetsRelative;const f=e.groups;for(let d=0,g=f.length;d<g;d++){const _=f[d];this.addGroup(_.start,_.count,_.materialIndex)}const m=e.boundingBox;m!==null&&(this.boundingBox=m.clone());const h=e.boundingSphere;return h!==null&&(this.boundingSphere=h.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ih=new ee,_b=new ee,vb=new ot;class Ca{constructor(e=new ee(1,0,0),i=0){this.isPlane=!0,this.normal=e,this.constant=i}set(e,i){return this.normal.copy(e),this.constant=i,this}setComponents(e,i,s,l){return this.normal.set(e,i,s),this.constant=l,this}setFromNormalAndCoplanarPoint(e,i){return this.normal.copy(e),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(e,i,s){const l=ih.subVectors(s,i).cross(_b.subVectors(e,i)).normalize();return this.setFromNormalAndCoplanarPoint(l,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,i){return i.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,i,s=!0){const l=e.delta(ih),c=this.normal.dot(l);if(c===0)return this.distanceToPoint(e.start)===0?i.copy(e.start):null;const f=-(e.start.dot(this.normal)+this.constant)/c;return s===!0&&(f<0||f>1)?null:i.copy(e.start).addScaledVector(l,f)}intersectsLine(e){const i=this.distanceToPoint(e.start),s=this.distanceToPoint(e.end);return i<0&&s>0||s<0&&i>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,i){const s=i||vb.getNormalMatrix(e),l=this.coplanarPoint(ih).applyMatrix4(e),c=this.normal.applyMatrix3(s).normalize();return this.constant=-l.dot(c),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let xb=0;class jr extends gs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:xb++}),this.uuid=ol(),this.name="",this.type="Material",this.blending=tl,this.side=ks,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=zv,this.blendDst=Hv,this.blendEquation=Hr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new _t(0,0,0),this.blendAlpha=0,this.depthFunc=nl,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=HM,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Bd,this.stencilZFail=Bd,this.stencilZPass=Bd,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const i in e){const s=e[i];if(s===void 0){nt(`Material: parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){nt(`Material: '${i}' is not a property of THREE.${this.type}.`);continue}l&&l.isColor?l.set(s):l&&l.isVector2&&s&&s.isVector2||l&&l.isEuler&&s&&s.isEuler||l&&l.isVector3&&s&&s.isVector3?l.copy(s):this[i]=s}}toJSON(e){const i=e===void 0||typeof e=="string";i&&(e={textures:{},images:{}});const s={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};s.uuid=this.uuid,s.type=this.type,s.blending=this.blending,s.side=this.side,s.shadowSide=this.shadowSide,s.vertexColors=this.vertexColors,s.opacity=this.opacity,s.transparent=this.transparent,s.blendSrc=this.blendSrc,s.blendDst=this.blendDst,s.blendEquation=this.blendEquation,s.blendSrcAlpha=this.blendSrcAlpha,s.blendDstAlpha=this.blendDstAlpha,s.blendEquationAlpha=this.blendEquationAlpha,s.blendColor=this.blendColor.getHex(),s.blendAlpha=this.blendAlpha,s.depthFunc=this.depthFunc,s.depthTest=this.depthTest,s.depthWrite=this.depthWrite,s.colorWrite=this.colorWrite,s.clipIntersection=this.clipIntersection,s.clipShadows=this.clipShadows,s.stencilWriteMask=this.stencilWriteMask,s.stencilFunc=this.stencilFunc,s.stencilRef=this.stencilRef,s.stencilFuncMask=this.stencilFuncMask,s.stencilFail=this.stencilFail,s.stencilZFail=this.stencilZFail,s.stencilZPass=this.stencilZPass,s.stencilWrite=this.stencilWrite,s.polygonOffset=this.polygonOffset,s.polygonOffsetFactor=this.polygonOffsetFactor,s.polygonOffsetUnits=this.polygonOffsetUnits,s.dithering=this.dithering,s.alphaTest=this.alphaTest,s.alphaHash=this.alphaHash,s.alphaToCoverage=this.alphaToCoverage,s.premultipliedAlpha=this.premultipliedAlpha,s.forceSinglePass=this.forceSinglePass,s.allowOverride=this.allowOverride,s.visible=this.visible,s.toneMapped=this.toneMapped,s.name=this.name,this.color&&this.color.isColor&&(s.color=this.color.getHex()),this.roughness!==void 0&&(s.roughness=this.roughness),this.metalness!==void 0&&(s.metalness=this.metalness),this.sheen!==void 0&&(s.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(s.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(s.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(s.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(s.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(s.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(s.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(s.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(s.shininess=this.shininess),this.clearcoat!==void 0&&(s.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(s.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(s.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(s.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(s.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,s.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(s.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(s.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(s.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(s.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(s.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(s.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(s.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(s.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(s.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(s.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(s.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(s.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(s.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(s.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(s.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(s.lightMap=this.lightMap.toJSON(e).uuid,s.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(s.aoMap=this.aoMap.toJSON(e).uuid,s.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(s.bumpMap=this.bumpMap.toJSON(e).uuid,s.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(s.normalMap=this.normalMap.toJSON(e).uuid,s.normalMapType=this.normalMapType,s.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(s.displacementMap=this.displacementMap.toJSON(e).uuid,s.displacementScale=this.displacementScale,s.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(s.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(s.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(s.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(s.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(s.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(s.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(s.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(s.combine=this.combine)),this.envMapRotation!==void 0&&(s.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(s.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(s.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(s.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(s.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(s.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(s.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(s.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(s.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(s.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(s.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(s.size=this.size),this.sizeAttenuation!==void 0&&(s.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(s.clippingPlanes=this.clippingPlanes.map(c=>c.toJSON())),this.rotation!==void 0&&(s.rotation=this.rotation),this.depthPacking!==void 0&&(s.depthPacking=this.depthPacking),this.linewidth!==void 0&&(s.linewidth=this.linewidth),this.linecap!==void 0&&(s.linecap=this.linecap),this.linejoin!==void 0&&(s.linejoin=this.linejoin),this.dashSize!==void 0&&(s.dashSize=this.dashSize),this.gapSize!==void 0&&(s.gapSize=this.gapSize),this.scale!==void 0&&(s.scale=this.scale),this.wireframe!==void 0&&(s.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(s.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(s.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(s.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(s.flatShading=this.flatShading),this.fog!==void 0&&(s.fog=this.fog),Object.keys(this.userData).length>0&&(s.userData=this.userData);function l(c){const f=[];for(const m in c){const h=c[m];delete h.metadata,f.push(h)}return f}if(i){const c=l(e.textures),f=l(e.images);c.length>0&&(s.textures=c),f.length>0&&(s.images=f)}return s}fromJSON(e,i){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new _t().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(s=>new Ca().fromJSON(s))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=i[e.map]||null),e.matcap!==void 0&&(this.matcap=i[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=i[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=i[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=i[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let s=e.normalScale;Array.isArray(s)===!1&&(s=[s,s]),this.normalScale=new at().fromArray(s)}return e.displacementMap!==void 0&&(this.displacementMap=i[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=i[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=i[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=i[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=i[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=i[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=i[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=i[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=i[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=i[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=i[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=i[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=i[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=i[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new at().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=i[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=i[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=i[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=i[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=i[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=i[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=i[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const i=e.clippingPlanes;let s=null;if(i!==null){const l=i.length;s=new Array(l);for(let c=0;c!==l;++c)s[c]=i[c].clone()}return this.clippingPlanes=s,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Ra=new ee,ah=new ee,Uc=new ee,Lc=new ee;class vu{constructor(e=new ee,i=new ee(0,0,-1)){this.origin=e,this.direction=i}set(e,i){return this.origin.copy(e),this.direction.copy(i),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,i){return i.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ra)),this}closestPointToPoint(e,i){i.subVectors(e,this.origin);const s=i.dot(this.direction);return s<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,s)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const i=Ra.subVectors(e,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(e):(Ra.copy(this.origin).addScaledVector(this.direction,i),Ra.distanceToSquared(e))}distanceSqToSegment(e,i,s,l){ah.copy(e).add(i).multiplyScalar(.5),Uc.copy(i).sub(e).normalize(),Lc.copy(this.origin).sub(ah);const c=e.distanceTo(i)*.5,f=-this.direction.dot(Uc),m=Lc.dot(this.direction),h=-Lc.dot(Uc),d=Lc.lengthSq(),g=Math.abs(1-f*f);let _,v,y,M;if(g>0)if(_=f*h-m,v=f*m-h,M=c*g,_>=0)if(v>=-M)if(v<=M){const w=1/g;_*=w,v*=w,y=_*(_+f*v+2*m)+v*(f*_+v+2*h)+d}else v=c,_=Math.max(0,-(f*v+m)),y=-_*_+v*(v+2*h)+d;else v=-c,_=Math.max(0,-(f*v+m)),y=-_*_+v*(v+2*h)+d;else v<=-M?(_=Math.max(0,-(-f*c+m)),v=_>0?-c:Math.min(Math.max(-c,-h),c),y=-_*_+v*(v+2*h)+d):v<=M?(_=0,v=Math.min(Math.max(-c,-h),c),y=v*(v+2*h)+d):(_=Math.max(0,-(f*c+m)),v=_>0?c:Math.min(Math.max(-c,-h),c),y=-_*_+v*(v+2*h)+d);else v=f>0?-c:c,_=Math.max(0,-(f*v+m)),y=-_*_+v*(v+2*h)+d;return s&&s.copy(this.origin).addScaledVector(this.direction,_),l&&l.copy(ah).addScaledVector(Uc,v),y}intersectSphere(e,i){if(e.radius<0)return null;Ra.subVectors(e.center,this.origin);const s=Ra.dot(this.direction),l=Ra.dot(Ra)-s*s,c=e.radius*e.radius;if(l>c)return null;const f=Math.sqrt(c-l),m=s-f,h=s+f;return h<0?null:m<0?this.at(h,i):this.at(m,i)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const i=e.normal.dot(this.direction);if(i===0)return e.distanceToPoint(this.origin)===0?0:null;const s=-(this.origin.dot(e.normal)+e.constant)/i;return s>=0?s:null}intersectPlane(e,i){const s=this.distanceToPlane(e);return s===null?null:this.at(s,i)}intersectsPlane(e){const i=e.distanceToPoint(this.origin);return i===0||e.normal.dot(this.direction)*i<0}intersectBox(e,i){let s,l,c,f,m,h;const d=1/this.direction.x,g=1/this.direction.y,_=1/this.direction.z,v=this.origin;return d>=0?(s=(e.min.x-v.x)*d,l=(e.max.x-v.x)*d):(s=(e.max.x-v.x)*d,l=(e.min.x-v.x)*d),g>=0?(c=(e.min.y-v.y)*g,f=(e.max.y-v.y)*g):(c=(e.max.y-v.y)*g,f=(e.min.y-v.y)*g),s>f||c>l||((c>s||isNaN(s))&&(s=c),(f<l||isNaN(l))&&(l=f),_>=0?(m=(e.min.z-v.z)*_,h=(e.max.z-v.z)*_):(m=(e.max.z-v.z)*_,h=(e.min.z-v.z)*_),s>h||m>l)||((m>s||s!==s)&&(s=m),(h<l||l!==l)&&(l=h),l<0)?null:this.at(s>=0?s:l,i)}intersectsBox(e){return this.intersectBox(e,Ra)!==null}intersectTriangle(e,i,s,l,c){const f=this.origin,m=this.direction,h=m.x,d=m.y,g=m.z,_=e.x-f.x,v=e.y-f.y,y=e.z-f.z,M=i.x-f.x,w=i.y-f.y,b=i.z-f.z,x=s.x-f.x,I=s.y-f.y,G=s.z-f.z,R=Math.abs(h),D=Math.abs(d),U=Math.abs(g);let P,T,N,z,q,$,j,X,te,F,V,ue;if(R>=D&&R>=U?(N=h,$=_,te=M,ue=x,h>=0?(P=d,T=g,z=v,q=y,j=w,X=b,F=I,V=G):(P=g,T=d,z=y,q=v,j=b,X=w,F=G,V=I)):D>=U?(N=d,$=v,te=w,ue=I,d>=0?(P=g,T=h,z=y,q=_,j=b,X=M,F=G,V=x):(P=h,T=g,z=_,q=y,j=M,X=b,F=x,V=G)):(N=g,$=y,te=b,ue=G,g>=0?(P=h,T=d,z=_,q=v,j=M,X=w,F=x,V=I):(P=d,T=h,z=v,q=_,j=w,X=M,F=I,V=x)),N===0)return null;const K=P/N,he=T/N,L=1/N,ne=z-K*$,_e=q-he*$,Ee=j-K*te,Le=X-he*te,Xe=F-K*ue,re=V-he*ue,ve=Xe*Le-re*Ee,Ae=ne*re-_e*Xe,tt=Ee*_e-Le*ne;if(l){if(ve<0||Ae<0||tt<0)return null}else if((ve<0||Ae<0||tt<0)&&(ve>0||Ae>0||tt>0))return null;const He=ve+Ae+tt;if(He===0)return null;const ct=L*(ve*$+Ae*te+tt*ue);return(He>0?ct<0:ct>0)?null:this.at(ct/He,c)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class lx extends jr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new _t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ms,this.combine=Gv,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const W_=new tn,Bs=new vu,Oc=new _u,Y_=new ee,Pc=new ee,Ic=new ee,Fc=new ee,sh=new ee,Bc=new ee,q_=new ee,zc=new ee;class na extends On{constructor(e=new ai,i=new lx){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const i=this.geometry.morphAttributes,s=Object.keys(i);if(s.length>0){const l=i[s[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,f=l.length;c<f;c++){const m=l[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[m]=c}}}}getVertexPosition(e,i){const s=this.geometry,l=s.attributes.position,c=s.morphAttributes.position,f=s.morphTargetsRelative;i.fromBufferAttribute(l,e);const m=this.morphTargetInfluences;if(c&&m){Bc.set(0,0,0);for(let h=0,d=c.length;h<d;h++){const g=m[h],_=c[h];g!==0&&(sh.fromBufferAttribute(_,e),f?Bc.addScaledVector(sh,g):Bc.addScaledVector(sh.sub(i),g))}i.add(Bc)}return i}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,i){const s=this.geometry,l=this.material,c=this.matrixWorld;l!==void 0&&(s.boundingSphere===null&&s.computeBoundingSphere(),Oc.copy(s.boundingSphere),Oc.applyMatrix4(c),Bs.copy(e.ray).recast(e.near),!(Oc.containsPoint(Bs.origin)===!1&&(Bs.intersectSphere(Oc,Y_)===null||Bs.origin.distanceToSquared(Y_)>(e.far-e.near)**2))&&(W_.copy(c).invert(),Bs.copy(e.ray).applyMatrix4(W_),!(s.boundingBox!==null&&Bs.intersectsBox(s.boundingBox)===!1)&&this._computeIntersections(e,i,Bs)))}_computeIntersections(e,i,s){let l;const c=this.geometry,f=this.material,m=c.index,h=c.attributes.position,d=c.attributes.uv,g=c.attributes.uv1,_=c.attributes.normal,v=c.groups,y=c.drawRange;if(m!==null)if(Array.isArray(f))for(let M=0,w=v.length;M<w;M++){const b=v[M],x=f[b.materialIndex],I=Math.max(b.start,y.start),G=Math.min(m.count,Math.min(b.start+b.count,y.start+y.count));for(let R=I,D=G;R<D;R+=3){const U=m.getX(R),P=m.getX(R+1),T=m.getX(R+2);l=Hc(this,x,e,s,d,g,_,U,P,T),l&&(l.faceIndex=Math.floor(R/3),l.face.materialIndex=b.materialIndex,i.push(l))}}else{const M=Math.max(0,y.start),w=Math.min(m.count,y.start+y.count);for(let b=M,x=w;b<x;b+=3){const I=m.getX(b),G=m.getX(b+1),R=m.getX(b+2);l=Hc(this,f,e,s,d,g,_,I,G,R),l&&(l.faceIndex=Math.floor(b/3),i.push(l))}}else if(h!==void 0)if(Array.isArray(f))for(let M=0,w=v.length;M<w;M++){const b=v[M],x=f[b.materialIndex],I=Math.max(b.start,y.start),G=Math.min(h.count,Math.min(b.start+b.count,y.start+y.count));for(let R=I,D=G;R<D;R+=3){const U=R,P=R+1,T=R+2;l=Hc(this,x,e,s,d,g,_,U,P,T),l&&(l.faceIndex=Math.floor(R/3),l.face.materialIndex=b.materialIndex,i.push(l))}}else{const M=Math.max(0,y.start),w=Math.min(h.count,y.start+y.count);for(let b=M,x=w;b<x;b+=3){const I=b,G=b+1,R=b+2;l=Hc(this,f,e,s,d,g,_,I,G,R),l&&(l.faceIndex=Math.floor(b/3),i.push(l))}}}}function Sb(r,e,i,s,l,c,f,m){let h;if(e.side===ii?h=s.intersectTriangle(f,c,l,!0,m):h=s.intersectTriangle(l,c,f,e.side===ks,m),h===null)return null;zc.copy(m),zc.applyMatrix4(r.matrixWorld);const d=i.ray.origin.distanceTo(zc);return d<i.near||d>i.far?null:{distance:d,point:zc.clone(),object:r}}function Hc(r,e,i,s,l,c,f,m,h,d){r.getVertexPosition(m,Pc),r.getVertexPosition(h,Ic),r.getVertexPosition(d,Fc);const g=Sb(r,e,i,s,Pc,Ic,Fc,q_);if(g){const _=new ee;Fi.getBarycoord(q_,Pc,Ic,Fc,_),l&&(g.uv=Fi.getInterpolatedAttribute(l,m,h,d,_,new at)),c&&(g.uv1=Fi.getInterpolatedAttribute(c,m,h,d,_,new at)),f&&(g.normal=Fi.getInterpolatedAttribute(f,m,h,d,_,new ee),g.normal.dot(s.direction)>0&&g.normal.multiplyScalar(-1));const v={a:m,b:h,c:d,normal:new ee,materialIndex:0};Fi.getNormal(Pc,Ic,Fc,v.normal),g.face=v,g.barycoord=_}return g}class yb extends kn{constructor(e=null,i=1,s=1,l,c,f,m,h,d=Ln,g=Ln,_,v){super(null,f,m,h,d,g,l,c,_,v),this.isDataTexture=!0,this.image={data:e,width:i,height:s},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const zs=new _u,Mb=new at(.5,.5),Gc=new ee;class bp{constructor(e=new Ca,i=new Ca,s=new Ca,l=new Ca,c=new Ca,f=new Ca){this.planes=[e,i,s,l,c,f]}set(e,i,s,l,c,f){const m=this.planes;return m[0].copy(e),m[1].copy(i),m[2].copy(s),m[3].copy(l),m[4].copy(c),m[5].copy(f),this}copy(e){const i=this.planes;for(let s=0;s<6;s++)i[s].copy(e.planes[s]);return this}setFromProjectionMatrix(e,i=Ji,s=!1){const l=this.planes,c=e.elements,f=c[0],m=c[1],h=c[2],d=c[3],g=c[4],_=c[5],v=c[6],y=c[7],M=c[8],w=c[9],b=c[10],x=c[11],I=c[12],G=c[13],R=c[14],D=c[15];if(l[0].setComponents(d-f,y-g,x-M,D-I).normalize(),l[1].setComponents(d+f,y+g,x+M,D+I).normalize(),l[2].setComponents(d+m,y+_,x+w,D+G).normalize(),l[3].setComponents(d-m,y-_,x-w,D-G).normalize(),s)l[4].setComponents(h,v,b,R).normalize(),l[5].setComponents(d-h,y-v,x-b,D-R).normalize();else if(l[4].setComponents(d-h,y-v,x-b,D-R).normalize(),i===Ji)l[5].setComponents(d+h,y+v,x+b,D+R).normalize();else if(i===sl)l[5].setComponents(h,v,b,R).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),zs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const i=e.geometry;i.boundingSphere===null&&i.computeBoundingSphere(),zs.copy(i.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(zs)}intersectsSprite(e){zs.center.set(0,0,0);const i=Mb.distanceTo(e.center);return zs.radius=.7071067811865476+i,zs.applyMatrix4(e.matrixWorld),this.intersectsSphere(zs)}intersectsSphere(e){const i=this.planes,s=e.center,l=-e.radius;for(let c=0;c<6;c++)if(i[c].distanceToPoint(s)<l)return!1;return!0}intersectsBox(e){const i=this.planes;for(let s=0;s<6;s++){const l=i[s];if(Gc.x=l.normal.x>0?e.max.x:e.min.x,Gc.y=l.normal.y>0?e.max.y:e.min.y,Gc.z=l.normal.z>0?e.max.z:e.min.z,l.distanceToPoint(Gc)<0)return!1}return!0}containsPoint(e){const i=this.planes;for(let s=0;s<6;s++)if(i[s].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class xu extends jr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new _t(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const hu=new ee,pu=new ee,Z_=new tn,Ko=new vu,Vc=new _u,rh=new ee,j_=new ee;class bb extends On{constructor(e=new ai,i=new xu){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const i=e.attributes.position,s=[0];for(let l=1,c=i.count;l<c;l++)hu.fromBufferAttribute(i,l-1),pu.fromBufferAttribute(i,l),s[l]=s[l-1],s[l]+=hu.distanceTo(pu);e.setAttribute("lineDistance",new Xn(s,1))}else nt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,i){const s=this.geometry,l=this.matrixWorld,c=e.params.Line.threshold,f=s.drawRange;if(s.boundingSphere===null&&s.computeBoundingSphere(),Vc.copy(s.boundingSphere),Vc.applyMatrix4(l),Vc.radius+=c,e.ray.intersectsSphere(Vc)===!1)return;Z_.copy(l).invert(),Ko.copy(e.ray).applyMatrix4(Z_);const m=c/((this.scale.x+this.scale.y+this.scale.z)/3),h=m*m,d=this.isLineSegments?2:1,g=s.index,v=s.attributes.position;if(g!==null){const y=Math.max(0,f.start),M=Math.min(g.count,f.start+f.count);for(let w=y,b=M-1;w<b;w+=d){const x=g.getX(w),I=g.getX(w+1),G=kc(this,e,Ko,h,x,I,w);G&&i.push(G)}if(this.isLineLoop){const w=g.getX(M-1),b=g.getX(y),x=kc(this,e,Ko,h,w,b,M-1);x&&i.push(x)}}else{const y=Math.max(0,f.start),M=Math.min(v.count,f.start+f.count);for(let w=y,b=M-1;w<b;w+=d){const x=kc(this,e,Ko,h,w,w+1,w);x&&i.push(x)}if(this.isLineLoop){const w=kc(this,e,Ko,h,M-1,y,M-1);w&&i.push(w)}}}updateMorphTargets(){const i=this.geometry.morphAttributes,s=Object.keys(i);if(s.length>0){const l=i[s[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,f=l.length;c<f;c++){const m=l[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[m]=c}}}}}function kc(r,e,i,s,l,c,f){const m=r.geometry.attributes.position;if(hu.fromBufferAttribute(m,l),pu.fromBufferAttribute(m,c),i.distanceSqToSegment(hu,pu,rh,j_)>s)return;rh.applyMatrix4(r.matrixWorld);const d=e.ray.origin.distanceTo(rh);if(!(d<e.near||d>e.far))return{distance:d,point:j_.clone().applyMatrix4(r.matrixWorld),index:f,face:null,faceIndex:null,barycoord:null,object:r}}const K_=new ee,Q_=new ee;class Ep extends bb{constructor(e,i){super(e,i),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const i=e.attributes.position,s=[];for(let l=0,c=i.count;l<c;l+=2)K_.fromBufferAttribute(i,l),Q_.fromBufferAttribute(i,l+1),s[l]=l===0?0:s[l-1],s[l+1]=s[l]+K_.distanceTo(Q_);e.setAttribute("lineDistance",new Xn(s,1))}else nt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class cx extends kn{constructor(e=[],i=Xs,s,l,c,f,m,h,d,g){super(e,i,s,l,c,f,m,h,d,g),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class rl extends kn{constructor(e,i,s=ea,l,c,f,m=Ln,h=Ln,d,g=La,_=1){if(g!==La&&g!==Vs)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const v={width:e,height:i,depth:_};super(v,l,c,f,m,h,g,s,d),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new yp(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const i=super.toJSON(e);return i.compareFunction=this.compareFunction,i}}class Eb extends rl{constructor(e,i=ea,s=Xs,l,c,f=Ln,m=Ln,h,d=La){const g={width:e,height:e,depth:1},_=[g,g,g,g,g,g];super(e,e,i,s,l,c,f,m,h,d),this.image=_,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class ux extends kn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class cl extends ai{constructor(e=1,i=1,s=1,l=1,c=1,f=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:i,depth:s,widthSegments:l,heightSegments:c,depthSegments:f};const m=this;l=Math.floor(l),c=Math.floor(c),f=Math.floor(f);const h=[],d=[],g=[],_=[];let v=0,y=0;M("z","y","x",-1,-1,s,i,e,f,c,0),M("z","y","x",1,-1,s,i,-e,f,c,1),M("x","z","y",1,1,e,s,i,l,f,2),M("x","z","y",1,-1,e,s,-i,l,f,3),M("x","y","z",1,-1,e,i,s,l,c,4),M("x","y","z",-1,-1,e,i,-s,l,c,5),this.setIndex(h),this.setAttribute("position",new Xn(d,3)),this.setAttribute("normal",new Xn(g,3)),this.setAttribute("uv",new Xn(_,2));function M(w,b,x,I,G,R,D,U,P,T,N){const z=R/P,q=D/T,$=R/2,j=D/2,X=U/2,te=P+1,F=T+1;let V=0,ue=0;const K=new ee;for(let he=0;he<F;he++){const L=he*q-j;for(let ne=0;ne<te;ne++){const _e=ne*z-$;K[w]=_e*I,K[b]=L*G,K[x]=X,d.push(K.x,K.y,K.z),K[w]=0,K[b]=0,K[x]=U>0?1:-1,g.push(K.x,K.y,K.z),_.push(ne/P),_.push(1-he/T),V+=1}}for(let he=0;he<T;he++)for(let L=0;L<P;L++){const ne=v+L+te*he,_e=v+L+te*(he+1),Ee=v+(L+1)+te*(he+1),Le=v+(L+1)+te*he;h.push(ne,_e,Le),h.push(_e,Ee,Le),ue+=6}m.addGroup(y,ue,N),y+=ue,v+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cl(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Su extends ai{constructor(e=1,i=1,s=1,l=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:i,widthSegments:s,heightSegments:l};const c=e/2,f=i/2,m=Math.floor(s),h=Math.floor(l),d=m+1,g=h+1,_=e/m,v=i/h,y=[],M=[],w=[],b=[];for(let x=0;x<g;x++){const I=x*v-f;for(let G=0;G<d;G++){const R=G*_-c;M.push(R,-I,0),w.push(0,0,1),b.push(G/m),b.push(1-x/h)}}for(let x=0;x<h;x++)for(let I=0;I<m;I++){const G=I+d*x,R=I+d*(x+1),D=I+1+d*(x+1),U=I+1+d*x;y.push(G,R,U),y.push(R,D,U)}this.setIndex(y),this.setAttribute("position",new Xn(M,3)),this.setAttribute("normal",new Xn(w,3)),this.setAttribute("uv",new Xn(b,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Su(e.width,e.height,e.widthSegments,e.heightSegments)}}function Zr(r){const e={};for(const i in r){e[i]={};for(const s in r[i]){const l=r[i][s];if(J_(l))l.isRenderTargetTexture?(nt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[i][s]=null):e[i][s]=l.clone();else if(Array.isArray(l))if(J_(l[0])){const c=[];for(let f=0,m=l.length;f<m;f++)c[f]=l[f].clone();e[i][s]=c}else e[i][s]=l.slice();else e[i][s]=l}}return e}function Vn(r){const e={};for(let i=0;i<r.length;i++){const s=Zr(r[i]);for(const l in s)e[l]=s[l]}return e}function J_(r){return r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)}function Tb(r){const e=[];for(let i=0;i<r.length;i++)e.push(r[i].clone());return e}function fx(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Tt.workingColorSpace}const Ab={clone:Zr,merge:Vn};var Rb=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Cb=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ia extends jr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Rb,this.fragmentShader=Cb,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Zr(e.uniforms),this.uniformsGroups=Tb(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const i=super.toJSON(e);i.glslVersion=this.glslVersion,i.uniforms={};for(const l in this.uniforms){const f=this.uniforms[l].value;f&&f.isTexture?i.uniforms[l]={type:"t",value:f.toJSON(e).uuid}:f&&f.isColor?i.uniforms[l]={type:"c",value:f.getHex()}:f&&f.isVector2?i.uniforms[l]={type:"v2",value:f.toArray()}:f&&f.isVector3?i.uniforms[l]={type:"v3",value:f.toArray()}:f&&f.isVector4?i.uniforms[l]={type:"v4",value:f.toArray()}:f&&f.isMatrix3?i.uniforms[l]={type:"m3",value:f.toArray()}:f&&f.isMatrix4?i.uniforms[l]={type:"m4",value:f.toArray()}:i.uniforms[l]={value:f}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;const s={};for(const l in this.extensions)this.extensions[l]===!0&&(s[l]=!0);return Object.keys(s).length>0&&(i.extensions=s),i}fromJSON(e,i){if(super.fromJSON(e,i),e.uniforms!==void 0)for(const s in e.uniforms){const l=e.uniforms[s];switch(this.uniforms[s]={},l.type){case"t":this.uniforms[s].value=i[l.value]||null;break;case"c":this.uniforms[s].value=new _t().setHex(l.value);break;case"v2":this.uniforms[s].value=new at().fromArray(l.value);break;case"v3":this.uniforms[s].value=new ee().fromArray(l.value);break;case"v4":this.uniforms[s].value=new nn().fromArray(l.value);break;case"m3":this.uniforms[s].value=new ot().fromArray(l.value);break;case"m4":this.uniforms[s].value=new tn().fromArray(l.value);break;default:this.uniforms[s].value=l.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const s in e.extensions)this.extensions[s]=e.extensions[s];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class wb extends ia{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Db extends jr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new _t(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new _t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ap,this.normalScale=new at(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ms,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Nb extends jr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=BM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Ub extends jr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class dx extends On{constructor(e,i=1){super(),this.isLight=!0,this.type="Light",this.color=new _t(e),this.intensity=i}copy(e,i){return super.copy(e,i),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const i=super.toJSON(e);return i.object.color=this.color.getHex(),i.object.intensity=this.intensity,i}}const oh=new tn,$_=new ee,ev=new ee;class Lb{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new at(512,512),this.mapType=gi,this.map=null,this.mapPass=null,this.matrix=new tn,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new bp,this._frameExtents=new at(1,1),this._viewportCount=1,this._viewports=[new nn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const i=this.camera;$_.setFromMatrixPosition(e.matrixWorld),i.position.copy($_),ev.setFromMatrixPosition(e.target.matrixWorld),i.lookAt(ev),i.updateMatrixWorld(),this._updateMatrix(i,this.matrix,this._frustum)}_updateMatrix(e,i,s,l){oh.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),s.setFromProjectionMatrix(oh,e.coordinateSystem,e.reversedDepth);const c=this._frameExtents,f=l?l.z/c.x:1,m=l?l.w/c.y:1,h=l?l.x/c.x:0,d=l?l.y/c.y:0;e.coordinateSystem===sl||e.reversedDepth?i.set(.5*f,0,0,.5*f+h,0,.5*m,0,.5*m+d,0,0,1,0,0,0,0,1):i.set(.5*f,0,0,.5*f+h,0,.5*m,0,.5*m+d,0,0,.5,.5,0,0,0,1),i.multiply(oh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Xc=new ee,Wc=new ps,qi=new ee;class hx extends On{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new tn,this.projectionMatrix=new tn,this.projectionMatrixInverse=new tn,this.coordinateSystem=Ji,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,i){return super.copy(e,i),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Xc,Wc,qi),qi.x===1&&qi.y===1&&qi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Xc,Wc,qi.set(1,1,1)).invert()}updateWorldMatrix(e,i,s=!1){super.updateWorldMatrix(e,i,s),this.matrixWorld.decompose(Xc,Wc,qi),qi.x===1&&qi.y===1&&qi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Xc,Wc,qi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const ds=new ee,tv=new at,nv=new at;class wi extends hx{constructor(e=50,i=1,s=.1,l=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=s,this.far=l,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const i=.5*this.getFilmHeight()/e;this.fov=sp*2*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(su*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return sp*2*Math.atan(Math.tan(su*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,i,s){ds.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ds.x,ds.y).multiplyScalar(-e/ds.z),ds.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),s.set(ds.x,ds.y).multiplyScalar(-e/ds.z)}getViewSize(e,i){return this.getViewBounds(e,tv,nv),i.subVectors(nv,tv)}setViewOffset(e,i,s,l,c,f){this.aspect=e/i,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=s,this.view.offsetY=l,this.view.width=c,this.view.height=f,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let i=e*Math.tan(su*.5*this.fov)/this.zoom,s=2*i,l=this.aspect*s,c=-.5*l;const f=this.view;if(this.view!==null&&this.view.enabled){const h=f.fullWidth,d=f.fullHeight;c+=f.offsetX*l/h,i-=f.offsetY*s/d,l*=f.width/h,s*=f.height/d}const m=this.filmOffset;m!==0&&(c+=e*m/this.getFilmWidth()),this.projectionMatrix.makePerspective(c,c+l,i,i-s,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,this.view!==null&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}class Tp extends hx{constructor(e=-1,i=1,s=1,l=-1,c=.1,f=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=i,this.top=s,this.bottom=l,this.near=c,this.far=f,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,i,s,l,c,f){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=s,this.view.offsetY=l,this.view.width=c,this.view.height=f,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),s=(this.right+this.left)/2,l=(this.top+this.bottom)/2;let c=s-e,f=s+e,m=l+i,h=l-i;if(this.view!==null&&this.view.enabled){const d=(this.right-this.left)/this.view.fullWidth/this.zoom,g=(this.top-this.bottom)/this.view.fullHeight/this.zoom;c+=d*this.view.offsetX,f=c+d*this.view.width,m-=g*this.view.offsetY,h=m-g*this.view.height}this.projectionMatrix.makeOrthographic(c,f,m,h,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}class Ob extends Lb{constructor(){super(new Tp(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class iv extends dx{constructor(e,i){super(e,i),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(On.DEFAULT_UP),this.updateMatrix(),this.target=new On,this.shadow=new Ob}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const i=super.toJSON(e);return i.object.shadow=this.shadow.toJSON(),i.object.target=this.target.uuid,i}}class Pb extends dx{constructor(e,i){super(e,i),this.isAmbientLight=!0,this.type="AmbientLight"}}const Fr=-90,Br=1;class Ib extends On{constructor(e,i,s){super(),this.type="CubeCamera",this.renderTarget=s,this.coordinateSystem=null,this.activeMipmapLevel=0;const l=new wi(Fr,Br,e,i);l.layers=this.layers,this.add(l);const c=new wi(Fr,Br,e,i);c.layers=this.layers,this.add(c);const f=new wi(Fr,Br,e,i);f.layers=this.layers,this.add(f);const m=new wi(Fr,Br,e,i);m.layers=this.layers,this.add(m);const h=new wi(Fr,Br,e,i);h.layers=this.layers,this.add(h);const d=new wi(Fr,Br,e,i);d.layers=this.layers,this.add(d)}updateCoordinateSystem(){const e=this.coordinateSystem,i=this.children.concat(),[s,l,c,f,m,h]=i;for(const d of i)this.remove(d);if(e===Ji)s.up.set(0,1,0),s.lookAt(1,0,0),l.up.set(0,1,0),l.lookAt(-1,0,0),c.up.set(0,0,-1),c.lookAt(0,1,0),f.up.set(0,0,1),f.lookAt(0,-1,0),m.up.set(0,1,0),m.lookAt(0,0,1),h.up.set(0,1,0),h.lookAt(0,0,-1);else if(e===sl)s.up.set(0,-1,0),s.lookAt(-1,0,0),l.up.set(0,-1,0),l.lookAt(1,0,0),c.up.set(0,0,1),c.lookAt(0,1,0),f.up.set(0,0,-1),f.lookAt(0,-1,0),m.up.set(0,-1,0),m.lookAt(0,0,1),h.up.set(0,-1,0),h.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const d of i)this.add(d),d.updateMatrixWorld()}update(e,i){this.parent===null&&this.updateMatrixWorld();const{renderTarget:s,activeMipmapLevel:l}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[c,f,m,h,d,g]=this.children,_=e.getRenderTarget(),v=e.getActiveCubeFace(),y=e.getActiveMipmapLevel(),M=e.xr.enabled;e.xr.enabled=!1;const w=s.texture.generateMipmaps;s.texture.generateMipmaps=!1;let b=!1;e.isWebGLRenderer===!0?b=e.state.buffers.depth.getReversed():b=e.reversedDepthBuffer,e.setRenderTarget(s,0,l),b&&e.autoClear===!1&&e.clearDepth(),e.render(i,c),e.setRenderTarget(s,1,l),b&&e.autoClear===!1&&e.clearDepth(),e.render(i,f),e.setRenderTarget(s,2,l),b&&e.autoClear===!1&&e.clearDepth(),e.render(i,m),e.setRenderTarget(s,3,l),b&&e.autoClear===!1&&e.clearDepth(),e.render(i,h),e.setRenderTarget(s,4,l),b&&e.autoClear===!1&&e.clearDepth(),e.render(i,d),s.texture.generateMipmaps=w,e.setRenderTarget(s,5,l),b&&e.autoClear===!1&&e.clearDepth(),e.render(i,g),e.setRenderTarget(_,v,y),e.xr.enabled=M,s.texture.needsPMREMUpdate=!0}}class Fb extends wi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const av=new tn;class Bb{constructor(e,i,s=0,l=1/0){this.ray=new vu(e,i),this.near=s,this.far=l,this.camera=null,this.layers=new Mp,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,i){this.ray.set(e,i)}setFromCamera(e,i){i.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(i.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(i).sub(this.ray.origin).normalize(),this.camera=i):i.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,i.projectionMatrix.elements[14]).unproject(i),this.ray.direction.set(0,0,-1).transformDirection(i.matrixWorld),this.camera=i):Ct("Raycaster: Unsupported camera type: "+i.type)}setFromXRController(e){return av.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(av),this}intersectObject(e,i=!0,s=[]){return rp(e,this,s,i),s.sort(sv),s}intersectObjects(e,i=!0,s=[]){for(let l=0,c=e.length;l<c;l++)rp(e[l],this,s,i);return s.sort(sv),s}}function sv(r,e){return r.distance-e.distance}function rp(r,e,i,s){let l=!0;if(r.layers.test(e.layers)&&r.raycast(e,i)===!1&&(l=!1),l===!0&&s===!0){const c=r.children;for(let f=0,m=c.length;f<m;f++)rp(c[f],e,i,!0)}}class rv{constructor(e=1,i=0,s=0){this.radius=e,this.phi=i,this.theta=s}set(e,i,s){return this.radius=e,this.phi=i,this.theta=s,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=St(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,i,s){return this.radius=Math.sqrt(e*e+i*i+s*s),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,s),this.phi=Math.acos(St(i/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Np=class Np{constructor(e,i,s,l){this.elements=[1,0,0,1],e!==void 0&&this.set(e,i,s,l)}identity(){return this.set(1,0,0,1),this}fromArray(e,i=0){for(let s=0;s<4;s++)this.elements[s]=e[s+i];return this}set(e,i,s,l){const c=this.elements;return c[0]=e,c[2]=i,c[1]=s,c[3]=l,this}};Np.prototype.isMatrix2=!0;let ov=Np;class zb extends Ep{constructor(e=10,i=10,s=4473924,l=8947848){s=new _t(s),l=new _t(l);const c=i/2,f=e/i,m=e/2,h=[],d=[];for(let v=0,y=0,M=-m;v<=i;v++,M+=f){h.push(-m,0,M,m,0,M),h.push(M,0,-m,M,0,m);const w=v===c?s:l;w.toArray(d,y),y+=3,w.toArray(d,y),y+=3,w.toArray(d,y),y+=3,w.toArray(d,y),y+=3}const g=new ai;g.setAttribute("position",new Xn(h,3)),g.setAttribute("color",new Xn(d,3));const _=new xu({vertexColors:!0,toneMapped:!1});super(g,_),this.type="GridHelper"}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}class Hb extends Ep{constructor(e=1){const i=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],s=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],l=new ai;l.setAttribute("position",new Xn(i,3)),l.setAttribute("color",new Xn(s,3));const c=new xu({vertexColors:!0,toneMapped:!1});super(l,c),this.type="AxesHelper"}setColors(e,i,s){const l=new _t,c=this.geometry.attributes.color.array;return l.set(e),l.toArray(c,0),l.toArray(c,3),l.set(i),l.toArray(c,6),l.toArray(c,9),l.set(s),l.toArray(c,12),l.toArray(c,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}class Gb extends gs{constructor(e,i=null){super(),this.object=e,this.domElement=i,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function lv(r,e,i,s){const l=Vb(s);switch(i){case ex:return r*e;case nx:return r*e/l.components*l.byteLength;case gp:return r*e/l.components*l.byteLength;case Ws:return r*e*2/l.components*l.byteLength;case _p:return r*e*2/l.components*l.byteLength;case tx:return r*e*3/l.components*l.byteLength;case Bi:return r*e*4/l.components*l.byteLength;case vp:return r*e*4/l.components*l.byteLength;case tu:case nu:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case iu:case au:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case wh:case Nh:return Math.max(r,16)*Math.max(e,8)/4;case Ch:case Dh:return Math.max(r,8)*Math.max(e,8)/2;case Uh:case Lh:case Ph:case Ih:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Oh:case lu:case Fh:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Bh:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case zh:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case Hh:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case Gh:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case Vh:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case kh:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case Xh:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case Wh:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case Yh:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case qh:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case Zh:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case jh:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case Kh:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case Qh:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case Jh:case $h:case ep:return Math.ceil(r/4)*Math.ceil(e/4)*16;case tp:case np:return Math.ceil(r/4)*Math.ceil(e/4)*8;case cu:case ip:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function Vb(r){switch(r){case gi:case Kv:return{byteLength:1,components:1};case il:case Qv:case ta:return{byteLength:2,components:1};case pp:case mp:return{byteLength:2,components:4};case ea:case hp:case Qi:return{byteLength:4,components:1};case Jv:case $v:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:dp}}));typeof window<"u"&&(window.__THREE__?nt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=dp);function px(){let r=null,e=!1,i=null,s=null;function l(c,f){s=r.requestAnimationFrame(l),i(c,f)}return{start:function(){e!==!0&&i!==null&&r!==null&&(s=r.requestAnimationFrame(l),e=!0)},stop:function(){r!==null&&r.cancelAnimationFrame(s),e=!1},setAnimationLoop:function(c){i=c},setContext:function(c){r=c}}}function kb(r){const e=new WeakMap;function i(m,h){const d=m.array,g=m.usage,_=d.byteLength,v=r.createBuffer();r.bindBuffer(h,v),r.bufferData(h,d,g),m.onUploadCallback();let y;if(d instanceof Float32Array)y=r.FLOAT;else if(typeof Float16Array<"u"&&d instanceof Float16Array)y=r.HALF_FLOAT;else if(d instanceof Uint16Array)m.isFloat16BufferAttribute?y=r.HALF_FLOAT:y=r.UNSIGNED_SHORT;else if(d instanceof Int16Array)y=r.SHORT;else if(d instanceof Uint32Array)y=r.UNSIGNED_INT;else if(d instanceof Int32Array)y=r.INT;else if(d instanceof Int8Array)y=r.BYTE;else if(d instanceof Uint8Array)y=r.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)y=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:v,type:y,bytesPerElement:d.BYTES_PER_ELEMENT,version:m.version,size:_}}function s(m,h,d){const g=h.array,_=h.updateRanges;if(r.bindBuffer(d,m),_.length===0)r.bufferSubData(d,0,g);else{_.sort((y,M)=>y.start-M.start);let v=0;for(let y=1;y<_.length;y++){const M=_[v],w=_[y];w.start<=M.start+M.count+1?M.count=Math.max(M.count,w.start+w.count-M.start):(++v,_[v]=w)}_.length=v+1;for(let y=0,M=_.length;y<M;y++){const w=_[y];r.bufferSubData(d,w.start*g.BYTES_PER_ELEMENT,g,w.start,w.count)}h.clearUpdateRanges()}h.onUploadCallback()}function l(m){return m.isInterleavedBufferAttribute&&(m=m.data),e.get(m)}function c(m){m.isInterleavedBufferAttribute&&(m=m.data);const h=e.get(m);h&&(r.deleteBuffer(h.buffer),e.delete(m))}function f(m,h){if(m.isInterleavedBufferAttribute&&(m=m.data),m.isGLBufferAttribute){const g=e.get(m);(!g||g.version<m.version)&&e.set(m,{buffer:m.buffer,type:m.type,bytesPerElement:m.elementSize,version:m.version});return}const d=e.get(m);if(d===void 0)e.set(m,i(m,h));else if(d.version<m.version){if(d.size!==m.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(d.buffer,m,h),d.version=m.version}}return{get:l,remove:c,update:f}}var Xb=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Wb=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Yb=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,qb=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Zb=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,jb=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Kb=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Qb=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Jb=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,$b=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,eE=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,tE=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,nE=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iE=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,aE=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,sE=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,rE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,oE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,lE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,cE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,uE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,fE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,dE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,hE=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,pE=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,mE=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,gE=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,_E=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,vE=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,xE=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,SE="gl_FragColor = linearToOutputTexel( gl_FragColor );",yE=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,ME=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,bE=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,EE=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,TE=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,AE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,RE=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,CE=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,wE=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,DE=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,NE=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,UE=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,LE=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,OE=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,PE=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,IE=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,FE=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,BE=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,zE=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,HE=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,GE=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,VE=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,kE=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,XE=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,WE=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,YE=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,qE=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ZE=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jE=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,KE=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,QE=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,JE=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$E=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,eT=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,tT=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,nT=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,iT=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,aT=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,sT=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rT=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,oT=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lT=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,cT=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,uT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dT=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,hT=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,pT=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,mT=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,gT=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,_T=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,vT=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,xT=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,ST=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,yT=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,MT=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,bT=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ET=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,TT=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,AT=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,RT=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,CT=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,wT=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,DT=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,NT=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,UT=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,LT=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,OT=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,PT=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,IT=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,FT=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,BT=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,zT=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,HT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,GT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,VT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,kT=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const XT=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,WT=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,YT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,qT=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ZT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,jT=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,KT=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,QT=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,JT=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,$T=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,e1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,t1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,n1=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,i1=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,a1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,s1=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,r1=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,o1=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,l1=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,c1=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,u1=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,f1=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,d1=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,h1=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,p1=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,m1=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,g1=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_1=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,v1=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,x1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,S1=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,y1=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,M1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,b1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,pt={alphahash_fragment:Xb,alphahash_pars_fragment:Wb,alphamap_fragment:Yb,alphamap_pars_fragment:qb,alphatest_fragment:Zb,alphatest_pars_fragment:jb,aomap_fragment:Kb,aomap_pars_fragment:Qb,batching_pars_vertex:Jb,batching_vertex:$b,begin_vertex:eE,beginnormal_vertex:tE,bsdfs:nE,iridescence_fragment:iE,bumpmap_pars_fragment:aE,clipping_planes_fragment:sE,clipping_planes_pars_fragment:rE,clipping_planes_pars_vertex:oE,clipping_planes_vertex:lE,color_fragment:cE,color_pars_fragment:uE,color_pars_vertex:fE,color_vertex:dE,common:hE,cube_uv_reflection_fragment:pE,defaultnormal_vertex:mE,displacementmap_pars_vertex:gE,displacementmap_vertex:_E,emissivemap_fragment:vE,emissivemap_pars_fragment:xE,colorspace_fragment:SE,colorspace_pars_fragment:yE,envmap_fragment:ME,envmap_common_pars_fragment:bE,envmap_pars_fragment:EE,envmap_pars_vertex:TE,envmap_physical_pars_fragment:IE,envmap_vertex:AE,fog_vertex:RE,fog_pars_vertex:CE,fog_fragment:wE,fog_pars_fragment:DE,gradientmap_pars_fragment:NE,lightmap_pars_fragment:UE,lights_lambert_fragment:LE,lights_lambert_pars_fragment:OE,lights_pars_begin:PE,lights_toon_fragment:FE,lights_toon_pars_fragment:BE,lights_phong_fragment:zE,lights_phong_pars_fragment:HE,lights_physical_fragment:GE,lights_physical_pars_fragment:VE,lights_fragment_begin:kE,lights_fragment_maps:XE,lights_fragment_end:WE,lightprobes_pars_fragment:YE,logdepthbuf_fragment:qE,logdepthbuf_pars_fragment:ZE,logdepthbuf_pars_vertex:jE,logdepthbuf_vertex:KE,map_fragment:QE,map_pars_fragment:JE,map_particle_fragment:$E,map_particle_pars_fragment:eT,metalnessmap_fragment:tT,metalnessmap_pars_fragment:nT,morphinstance_vertex:iT,morphcolor_vertex:aT,morphnormal_vertex:sT,morphtarget_pars_vertex:rT,morphtarget_vertex:oT,normal_fragment_begin:lT,normal_fragment_maps:cT,normal_pars_fragment:uT,normal_pars_vertex:fT,normal_vertex:dT,normalmap_pars_fragment:hT,clearcoat_normal_fragment_begin:pT,clearcoat_normal_fragment_maps:mT,clearcoat_pars_fragment:gT,iridescence_pars_fragment:_T,opaque_fragment:vT,packing:xT,premultiplied_alpha_fragment:ST,project_vertex:yT,dithering_fragment:MT,dithering_pars_fragment:bT,roughnessmap_fragment:ET,roughnessmap_pars_fragment:TT,shadowmap_pars_fragment:AT,shadowmap_pars_vertex:RT,shadowmap_vertex:CT,shadowmask_pars_fragment:wT,skinbase_vertex:DT,skinning_pars_vertex:NT,skinning_vertex:UT,skinnormal_vertex:LT,specularmap_fragment:OT,specularmap_pars_fragment:PT,tonemapping_fragment:IT,tonemapping_pars_fragment:FT,transmission_fragment:BT,transmission_pars_fragment:zT,uv_pars_fragment:HT,uv_pars_vertex:GT,uv_vertex:VT,worldpos_vertex:kT,background_vert:XT,background_frag:WT,backgroundCube_vert:YT,backgroundCube_frag:qT,cube_vert:ZT,cube_frag:jT,depth_vert:KT,depth_frag:QT,distance_vert:JT,distance_frag:$T,equirect_vert:e1,equirect_frag:t1,linedashed_vert:n1,linedashed_frag:i1,meshbasic_vert:a1,meshbasic_frag:s1,meshlambert_vert:r1,meshlambert_frag:o1,meshmatcap_vert:l1,meshmatcap_frag:c1,meshnormal_vert:u1,meshnormal_frag:f1,meshphong_vert:d1,meshphong_frag:h1,meshphysical_vert:p1,meshphysical_frag:m1,meshtoon_vert:g1,meshtoon_frag:_1,points_vert:v1,points_frag:x1,shadow_vert:S1,shadow_frag:y1,sprite_vert:M1,sprite_frag:b1},Ie={common:{diffuse:{value:new _t(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ot},alphaMap:{value:null},alphaMapTransform:{value:new ot},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ot}},envmap:{envMap:{value:null},envMapRotation:{value:new ot},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ot}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ot}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ot},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ot},normalScale:{value:new at(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ot},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ot}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ot}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ot}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new _t(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new ee},probesMax:{value:new ee},probesResolution:{value:new ee}},points:{diffuse:{value:new _t(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ot},alphaTest:{value:0},uvTransform:{value:new ot}},sprite:{diffuse:{value:new _t(16777215)},opacity:{value:1},center:{value:new at(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ot},alphaMap:{value:null},alphaMapTransform:{value:new ot},alphaTest:{value:0}}},ji={basic:{uniforms:Vn([Ie.common,Ie.specularmap,Ie.envmap,Ie.aomap,Ie.lightmap,Ie.fog]),vertexShader:pt.meshbasic_vert,fragmentShader:pt.meshbasic_frag},lambert:{uniforms:Vn([Ie.common,Ie.specularmap,Ie.envmap,Ie.aomap,Ie.lightmap,Ie.emissivemap,Ie.bumpmap,Ie.normalmap,Ie.displacementmap,Ie.fog,Ie.lights,{emissive:{value:new _t(0)},envMapIntensity:{value:1}}]),vertexShader:pt.meshlambert_vert,fragmentShader:pt.meshlambert_frag},phong:{uniforms:Vn([Ie.common,Ie.specularmap,Ie.envmap,Ie.aomap,Ie.lightmap,Ie.emissivemap,Ie.bumpmap,Ie.normalmap,Ie.displacementmap,Ie.fog,Ie.lights,{emissive:{value:new _t(0)},specular:{value:new _t(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:pt.meshphong_vert,fragmentShader:pt.meshphong_frag},standard:{uniforms:Vn([Ie.common,Ie.envmap,Ie.aomap,Ie.lightmap,Ie.emissivemap,Ie.bumpmap,Ie.normalmap,Ie.displacementmap,Ie.roughnessmap,Ie.metalnessmap,Ie.fog,Ie.lights,{emissive:{value:new _t(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:pt.meshphysical_vert,fragmentShader:pt.meshphysical_frag},toon:{uniforms:Vn([Ie.common,Ie.aomap,Ie.lightmap,Ie.emissivemap,Ie.bumpmap,Ie.normalmap,Ie.displacementmap,Ie.gradientmap,Ie.fog,Ie.lights,{emissive:{value:new _t(0)}}]),vertexShader:pt.meshtoon_vert,fragmentShader:pt.meshtoon_frag},matcap:{uniforms:Vn([Ie.common,Ie.bumpmap,Ie.normalmap,Ie.displacementmap,Ie.fog,{matcap:{value:null}}]),vertexShader:pt.meshmatcap_vert,fragmentShader:pt.meshmatcap_frag},points:{uniforms:Vn([Ie.points,Ie.fog]),vertexShader:pt.points_vert,fragmentShader:pt.points_frag},dashed:{uniforms:Vn([Ie.common,Ie.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:pt.linedashed_vert,fragmentShader:pt.linedashed_frag},depth:{uniforms:Vn([Ie.common,Ie.displacementmap]),vertexShader:pt.depth_vert,fragmentShader:pt.depth_frag},normal:{uniforms:Vn([Ie.common,Ie.bumpmap,Ie.normalmap,Ie.displacementmap,{opacity:{value:1}}]),vertexShader:pt.meshnormal_vert,fragmentShader:pt.meshnormal_frag},sprite:{uniforms:Vn([Ie.sprite,Ie.fog]),vertexShader:pt.sprite_vert,fragmentShader:pt.sprite_frag},background:{uniforms:{uvTransform:{value:new ot},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:pt.background_vert,fragmentShader:pt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ot}},vertexShader:pt.backgroundCube_vert,fragmentShader:pt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:pt.cube_vert,fragmentShader:pt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:pt.equirect_vert,fragmentShader:pt.equirect_frag},distance:{uniforms:Vn([Ie.common,Ie.displacementmap,{referencePosition:{value:new ee},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:pt.distance_vert,fragmentShader:pt.distance_frag},shadow:{uniforms:Vn([Ie.lights,Ie.fog,{color:{value:new _t(0)},opacity:{value:1}}]),vertexShader:pt.shadow_vert,fragmentShader:pt.shadow_frag}};ji.physical={uniforms:Vn([ji.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ot},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ot},clearcoatNormalScale:{value:new at(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ot},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ot},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ot},sheen:{value:0},sheenColor:{value:new _t(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ot},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ot},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ot},transmissionSamplerSize:{value:new at},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ot},attenuationDistance:{value:0},attenuationColor:{value:new _t(0)},specularColor:{value:new _t(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ot},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ot},anisotropyVector:{value:new at},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ot}}]),vertexShader:pt.meshphysical_vert,fragmentShader:pt.meshphysical_frag};const Yc={r:0,b:0,g:0},E1=new tn,mx=new ot;mx.set(-1,0,0,0,1,0,0,0,1);function T1(r,e,i,s,l,c){const f=new _t(0);let m=l===!0?0:1,h,d,g=null,_=0,v=null;function y(I){let G=I.isScene===!0?I.background:null;if(G&&G.isTexture){const R=I.backgroundBlurriness>0;G=e.get(G,R)}return G}function M(I){let G=!1;const R=y(I);R===null?b(f,m):R&&R.isColor&&(b(R,1),G=!0);const D=r.xr.getEnvironmentBlendMode();D==="additive"?i.buffers.color.setClear(0,0,0,1,c):D==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,c),(r.autoClear||G)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function w(I,G){const R=y(G);R&&(R.isCubeTexture||R.mapping===gu)?(d===void 0&&(d=new na(new cl(1,1,1),new ia({name:"BackgroundCubeMaterial",uniforms:Zr(ji.backgroundCube.uniforms),vertexShader:ji.backgroundCube.vertexShader,fragmentShader:ji.backgroundCube.fragmentShader,side:ii,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(D,U,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),d.material.uniforms.envMap.value=R,d.material.uniforms.backgroundBlurriness.value=G.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=G.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(E1.makeRotationFromEuler(G.backgroundRotation)).transpose(),R.isCubeTexture&&R.isRenderTargetTexture===!1&&d.material.uniforms.backgroundRotation.value.premultiply(mx),d.material.toneMapped=Tt.getTransfer(R.colorSpace)!==Bt,(g!==R||_!==R.version||v!==r.toneMapping)&&(d.material.needsUpdate=!0,g=R,_=R.version,v=r.toneMapping),d.layers.enableAll(),I.unshift(d,d.geometry,d.material,0,0,null)):R&&R.isTexture&&(h===void 0&&(h=new na(new Su(2,2),new ia({name:"BackgroundMaterial",uniforms:Zr(ji.background.uniforms),vertexShader:ji.background.vertexShader,fragmentShader:ji.background.fragmentShader,side:ks,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=R,h.material.uniforms.backgroundIntensity.value=G.backgroundIntensity,h.material.toneMapped=Tt.getTransfer(R.colorSpace)!==Bt,R.matrixAutoUpdate===!0&&R.updateMatrix(),h.material.uniforms.uvTransform.value.copy(R.matrix),(g!==R||_!==R.version||v!==r.toneMapping)&&(h.material.needsUpdate=!0,g=R,_=R.version,v=r.toneMapping),h.layers.enableAll(),I.unshift(h,h.geometry,h.material,0,0,null))}function b(I,G){I.getRGB(Yc,fx(r)),i.buffers.color.setClear(Yc.r,Yc.g,Yc.b,G,c)}function x(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0)}return{getClearColor:function(){return f},setClearColor:function(I,G=1){f.set(I),m=G,b(f,m)},getClearAlpha:function(){return m},setClearAlpha:function(I){m=I,b(f,m)},render:M,addToRenderList:w,dispose:x}}function A1(r,e){const i=r.getParameter(r.MAX_VERTEX_ATTRIBS),s={},l=v(null);let c=l,f=!1;function m(q,$,j,X,te){let F=!1;const V=_(q,X,j,$);c!==V&&(c=V,d(c.object)),F=y(q,X,j,te),F&&M(q,X,j,te),te!==null&&e.update(te,r.ELEMENT_ARRAY_BUFFER),(F||f)&&(f=!1,R(q,$,j,X),te!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(te).buffer))}function h(){return r.createVertexArray()}function d(q){return r.bindVertexArray(q)}function g(q){return r.deleteVertexArray(q)}function _(q,$,j,X){const te=X.wireframe===!0;let F=s[$.id];F===void 0&&(F={},s[$.id]=F);const V=q.isInstancedMesh===!0?q.id:0;let ue=F[V];ue===void 0&&(ue={},F[V]=ue);let K=ue[j.id];K===void 0&&(K={},ue[j.id]=K);let he=K[te];return he===void 0&&(he=v(h()),K[te]=he),he}function v(q){const $=[],j=[],X=[];for(let te=0;te<i;te++)$[te]=0,j[te]=0,X[te]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:$,enabledAttributes:j,attributeDivisors:X,object:q,attributes:{},index:null}}function y(q,$,j,X){const te=c.attributes,F=$.attributes;let V=0;const ue=j.getAttributes();for(const K in ue)if(ue[K].location>=0){const L=te[K];let ne=F[K];if(ne===void 0&&(K==="instanceMatrix"&&q.instanceMatrix&&(ne=q.instanceMatrix),K==="instanceColor"&&q.instanceColor&&(ne=q.instanceColor)),L===void 0||L.attribute!==ne||ne&&L.data!==ne.data)return!0;V++}return c.attributesNum!==V||c.index!==X}function M(q,$,j,X){const te={},F=$.attributes;let V=0;const ue=j.getAttributes();for(const K in ue)if(ue[K].location>=0){let L=F[K];L===void 0&&(K==="instanceMatrix"&&q.instanceMatrix&&(L=q.instanceMatrix),K==="instanceColor"&&q.instanceColor&&(L=q.instanceColor));const ne={};ne.attribute=L,L&&L.data&&(ne.data=L.data),te[K]=ne,V++}c.attributes=te,c.attributesNum=V,c.index=X}function w(){const q=c.newAttributes;for(let $=0,j=q.length;$<j;$++)q[$]=0}function b(q){x(q,0)}function x(q,$){const j=c.newAttributes,X=c.enabledAttributes,te=c.attributeDivisors;j[q]=1,X[q]===0&&(r.enableVertexAttribArray(q),X[q]=1),te[q]!==$&&(r.vertexAttribDivisor(q,$),te[q]=$)}function I(){const q=c.newAttributes,$=c.enabledAttributes;for(let j=0,X=$.length;j<X;j++)$[j]!==q[j]&&(r.disableVertexAttribArray(j),$[j]=0)}function G(q,$,j,X,te,F,V){V===!0?r.vertexAttribIPointer(q,$,j,te,F):r.vertexAttribPointer(q,$,j,X,te,F)}function R(q,$,j,X){w();const te=X.attributes,F=j.getAttributes(),V=$.defaultAttributeValues;for(const ue in F){const K=F[ue];if(K.location>=0){let he=te[ue];if(he===void 0&&(ue==="instanceMatrix"&&q.instanceMatrix&&(he=q.instanceMatrix),ue==="instanceColor"&&q.instanceColor&&(he=q.instanceColor)),he!==void 0){const L=he.normalized,ne=he.itemSize,_e=e.get(he);if(_e===void 0)continue;const Ee=_e.buffer,Le=_e.type,Xe=_e.bytesPerElement,re=Le===r.INT||Le===r.UNSIGNED_INT||he.gpuType===hp;if(he.isInterleavedBufferAttribute){const ve=he.data,Ae=ve.stride,tt=he.offset;if(ve.isInstancedInterleavedBuffer){for(let He=0;He<K.locationSize;He++)x(K.location+He,ve.meshPerAttribute);q.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=ve.meshPerAttribute*ve.count)}else for(let He=0;He<K.locationSize;He++)b(K.location+He);r.bindBuffer(r.ARRAY_BUFFER,Ee);for(let He=0;He<K.locationSize;He++)G(K.location+He,ne/K.locationSize,Le,L,Ae*Xe,(tt+ne/K.locationSize*He)*Xe,re)}else{if(he.isInstancedBufferAttribute){for(let ve=0;ve<K.locationSize;ve++)x(K.location+ve,he.meshPerAttribute);q.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let ve=0;ve<K.locationSize;ve++)b(K.location+ve);r.bindBuffer(r.ARRAY_BUFFER,Ee);for(let ve=0;ve<K.locationSize;ve++)G(K.location+ve,ne/K.locationSize,Le,L,ne*Xe,ne/K.locationSize*ve*Xe,re)}}else if(V!==void 0){const L=V[ue];if(L!==void 0)switch(L.length){case 2:r.vertexAttrib2fv(K.location,L);break;case 3:r.vertexAttrib3fv(K.location,L);break;case 4:r.vertexAttrib4fv(K.location,L);break;default:r.vertexAttrib1fv(K.location,L)}}}}I()}function D(){N();for(const q in s){const $=s[q];for(const j in $){const X=$[j];for(const te in X){const F=X[te];for(const V in F)g(F[V].object),delete F[V];delete X[te]}}delete s[q]}}function U(q){if(s[q.id]===void 0)return;const $=s[q.id];for(const j in $){const X=$[j];for(const te in X){const F=X[te];for(const V in F)g(F[V].object),delete F[V];delete X[te]}}delete s[q.id]}function P(q){for(const $ in s){const j=s[$];for(const X in j){const te=j[X];if(te[q.id]===void 0)continue;const F=te[q.id];for(const V in F)g(F[V].object),delete F[V];delete te[q.id]}}}function T(q){for(const $ in s){const j=s[$],X=q.isInstancedMesh===!0?q.id:0,te=j[X];if(te!==void 0){for(const F in te){const V=te[F];for(const ue in V)g(V[ue].object),delete V[ue];delete te[F]}delete j[X],Object.keys(j).length===0&&delete s[$]}}}function N(){z(),f=!0,c!==l&&(c=l,d(c.object))}function z(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:m,reset:N,resetDefaultState:z,dispose:D,releaseStatesOfGeometry:U,releaseStatesOfObject:T,releaseStatesOfProgram:P,initAttributes:w,enableAttribute:b,disableUnusedAttributes:I}}function R1(r,e,i){let s;function l(h){s=h}function c(h,d){r.drawArrays(s,h,d),i.update(d,s,1)}function f(h,d,g){g!==0&&(r.drawArraysInstanced(s,h,d,g),i.update(d,s,g))}function m(h,d,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(s,h,0,d,0,g);let v=0;for(let y=0;y<g;y++)v+=d[y];i.update(v,s,1)}this.setMode=l,this.render=c,this.renderInstances=f,this.renderMultiDraw=m}function C1(r,e,i,s){let l;function c(){if(l!==void 0)return l;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");l=r.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else l=0;return l}function f(P){return!(P!==Bi&&s.convert(P)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function m(P){const T=P===ta&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==gi&&P!==Qi&&!T&&s.convert(P)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE))}function h(P){if(P==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let d=i.precision!==void 0?i.precision:"highp";const g=h(d);g!==d&&(nt("WebGLRenderer:",d,"not supported, using",g,"instead."),d=g);const _=i.logarithmicDepthBuffer===!0,v=i.reversedDepthBuffer===!0&&e.has("EXT_clip_control");i.reversedDepthBuffer===!0&&v===!1&&nt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const y=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),M=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),w=r.getParameter(r.MAX_TEXTURE_SIZE),b=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),x=r.getParameter(r.MAX_VERTEX_ATTRIBS),I=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),G=r.getParameter(r.MAX_VARYING_VECTORS),R=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),D=r.getParameter(r.MAX_SAMPLES),U=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:c,getMaxPrecision:h,textureFormatReadable:f,textureTypeReadable:m,precision:d,logarithmicDepthBuffer:_,reversedDepthBuffer:v,maxTextures:y,maxVertexTextures:M,maxTextureSize:w,maxCubemapSize:b,maxAttributes:x,maxVertexUniforms:I,maxVaryings:G,maxFragmentUniforms:R,maxSamples:D,samples:U}}function w1(r){const e=this;let i=null,s=0,l=!1,c=!1;const f=new Ca,m=new ot,h={value:null,needsUpdate:!1};this.uniform=h,this.numPlanes=0,this.numIntersection=0,this.init=function(_,v){const y=_.length!==0||v||s!==0||l;return l=v,s=_.length,y},this.beginShadows=function(){c=!0,g(null)},this.endShadows=function(){c=!1},this.setGlobalState=function(_,v){i=g(_,v,0)},this.setState=function(_,v,y){const M=_.clippingPlanes,w=_.clipIntersection,b=_.clipShadows,x=r.get(_);if(!l||M===null||M.length===0||c&&!b)c?g(null):d();else{const I=c?0:s,G=I*4;let R=x.clippingState||null;h.value=R,R=g(M,v,G,y);for(let D=0;D!==G;++D)R[D]=i[D];x.clippingState=R,this.numIntersection=w?this.numPlanes:0,this.numPlanes+=I}};function d(){h.value!==i&&(h.value=i,h.needsUpdate=s>0),e.numPlanes=s,e.numIntersection=0}function g(_,v,y,M){const w=_!==null?_.length:0;let b=null;if(w!==0){if(b=h.value,M!==!0||b===null){const x=y+w*4,I=v.matrixWorldInverse;m.getNormalMatrix(I),(b===null||b.length<x)&&(b=new Float32Array(x));for(let G=0,R=y;G!==w;++G,R+=4)f.copy(_[G]).applyMatrix4(I,m),f.normal.toArray(b,R),b[R+3]=f.constant}h.value=b,h.needsUpdate=!0}return e.numPlanes=w,e.numIntersection=0,b}}const kr=4,D1=6,N1=20,U1=256,Qo=new Tp,cv=new _t;let lh=null,ch=0,uh=0,fh=!1;const L1=new ee,Hs=new ee;class uv{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,i=0,s=.1,l=100,c={}){const{size:f=256,position:m=L1}=c;lh=this._renderer.getRenderTarget(),ch=this._renderer.getActiveCubeFace(),uh=this._renderer.getActiveMipmapLevel(),fh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(f);const h=this._allocateTargets();return h.depthBuffer=!0,this._sceneToCubeUV(e,s,l,h,m),i>0&&this._blur(h,0,0,i),this._applyPMREM(h),this._cleanup(h),h}fromEquirectangular(e,i=null){return this._fromTexture(e,i)}fromCubemap(e,i=null){return this._fromTexture(e,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=hv(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=dv(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(lh,ch,uh),this._renderer.xr.enabled=fh,e.scissorTest=!1,zr(e,0,0,e.width,e.height)}_fromTexture(e,i){e.mapping===Xs||e.mapping===qr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),lh=this._renderer.getRenderTarget(),ch=this._renderer.getActiveCubeFace(),uh=this._renderer.getActiveMipmapLevel(),fh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const s=i||this._allocateTargets();return this._textureToCubeUV(e,s),this._applyPMREM(s),this._cleanup(s),s}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,s={magFilter:Bn,minFilter:Bn,generateMipmaps:!1,type:ta,format:Bi,colorSpace:uu,depthBuffer:!1},l=fv(e,i,s);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==i){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=fv(e,i,s);const{_lodMax:c}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=O1(c)),this._blurMaterial=I1(c,e,i),this._ggxMaterial=P1(c,e,i)}return l}_compileMaterial(e){const i=new na(new ai,e);this._renderer.compile(i,Qo)}_sceneToCubeUV(e,i,s,l,c){const h=new wi(90,1,i,s),d=[1,-1,1,1,1,1],g=[1,1,1,-1,-1,-1],_=this._renderer,v=_.autoClear,y=_.toneMapping;_.getClearColor(cv),_.toneMapping=$i,_.autoClear=!1,_.state.buffers.depth.getReversed()&&(_.setRenderTarget(l),_.clearDepth(),_.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new na(new cl,new lx({name:"PMREM.Background",side:ii,depthWrite:!1,depthTest:!1})));const w=this._backgroundBox,b=w.material;let x=!1;const I=e.background;I?I.isColor&&(b.color.copy(I),e.background=null,x=!0):(b.color.copy(cv),x=!0);for(let G=0;G<6;G++){const R=G%3;R===0?(h.up.set(0,d[G],0),h.position.set(c.x,c.y,c.z),h.lookAt(c.x+g[G],c.y,c.z)):R===1?(h.up.set(0,0,d[G]),h.position.set(c.x,c.y,c.z),h.lookAt(c.x,c.y+g[G],c.z)):(h.up.set(0,d[G],0),h.position.set(c.x,c.y,c.z),h.lookAt(c.x,c.y,c.z+g[G]));const D=this._cubeSize;zr(l,R*D,G>2?D:0,D,D),_.setRenderTarget(l),x&&_.render(w,h),_.render(e,h)}_.toneMapping=y,_.autoClear=v,e.background=I}_textureToCubeUV(e,i){const s=this._renderer,l=e.mapping===Xs||e.mapping===qr;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=hv()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=dv());const c=l?this._cubemapMaterial:this._equirectMaterial,f=this._lodMeshes[0];f.material=c;const m=c.uniforms;m.envMap.value=e;const h=this._cubeSize;zr(i,0,0,3*h,2*h),s.setRenderTarget(i),s.render(f,Qo)}_applyPMREM(e){const i=this._renderer,s=i.autoClear;i.autoClear=!1;const l=this._lodMeshes.length;for(let c=1;c<l;c++)this._applyGGXFilter(e,c-1,c);i.autoClear=s}_applyGGXFilter(e,i,s){const l=this._renderer,c=this._pingPongRenderTarget,f=this._ggxMaterial,m=this._lodMeshes[s];m.material=f;const h=f.uniforms,d=s/(this._lodMeshes.length-1),g=i/(this._lodMeshes.length-1),_=Math.sqrt(d*d-g*g),v=d*1.25,y=_*v,{_lodMax:M}=this,w=this._sizeLods[s],b=3*w*(s>M-kr?s-M+kr:0),x=4*(this._cubeSize-w);h.envMap.value=e.texture,h.roughness.value=y,h.mipInt.value=M-i,zr(c,b,x,3*w,2*w),l.setRenderTarget(c),l.render(m,Qo),h.envMap.value=c.texture,h.roughness.value=0,h.mipInt.value=M-s,zr(e,b,x,3*w,2*w),l.setRenderTarget(e),l.render(m,Qo)}_blur(e,i,s,l){const c=this._pingPongRenderTarget,f=Math.min(l,Math.PI)/Math.SQRT2;this._blurPass(e,c,i,s,f),this._blurPass(c,e,s,s,f)}_blurPass(e,i,s,l,c){const f=this._renderer,m=this._blurMaterial,h=this._lodMeshes[l];h.material=m;const d=m.uniforms;d.envMap.value=e.texture,d.sigma.value=c,d.mipInt.value=this._lodMax-s;const g=this._sizeLods[l],_=3*g*(l>this._lodMax-kr?l-this._lodMax+kr:0),v=4*(this._cubeSize-g);zr(i,_,v,3*g,2*g),f.setRenderTarget(i),f.render(h,Qo)}}function O1(r){const e=[],i=[];let s=r;const l=r-kr+1+D1;for(let c=0;c<l;c++){const f=Math.pow(2,s);e.push(f);const m=1/(f-2),h=-m,d=1+m,g=[h,h,d,h,d,d,h,h,d,d,h,d],_=6,v=6,y=3,M=new Float32Array(y*v*_),w=new Float32Array(y*v*_);for(let x=0;x<_;x++){const I=x%3*2/3-1,G=x>2?0:-1,R=[I,G,0,I+2/3,G,0,I+2/3,G+1,0,I,G,0,I+2/3,G+1,0,I,G+1,0];M.set(R,y*v*x);for(let D=0;D<v;D++){const U=g[D*2]*2-1,P=g[D*2+1]*2-1;x===0?Hs.set(1,P,U):x===1?Hs.set(-U,1,-P):x===2?Hs.set(-U,P,1):x===3?Hs.set(-1,P,-U):x===4?Hs.set(-U,-1,P):Hs.set(U,P,-1),Hs.toArray(w,(x*v+D)*y)}}const b=new ai;b.setAttribute("position",new ni(M,y)),b.setAttribute("outputDirection",new ni(w,y)),i.push(new na(b,null)),s>kr&&s--}return{lodMeshes:i,sizeLods:e}}function fv(r,e,i){const s=new Hi(r,e,i);return s.texture.mapping=gu,s.texture.name="PMREM.cubeUv",s.scissorTest=!0,s}function zr(r,e,i,s,l){r.viewport.set(e,i,s,l),r.scissor.set(e,i,s,l)}function P1(r,e,i){return new ia({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:U1,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:yu(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Da,depthTest:!1,depthWrite:!1})}function I1(r,e,i){return new ia({name:"SphericalGaussianBlur",defines:{SAMPLES:N1,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:yu(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Da,depthTest:!1,depthWrite:!1})}function dv(){return new ia({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:yu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Da,depthTest:!1,depthWrite:!1})}function hv(){return new ia({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:yu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Da,depthTest:!1,depthWrite:!1})}function yu(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class gx extends Hi{constructor(e=1,i={}){super(e,e,i),this.isWebGLCubeRenderTarget=!0;const s={width:e,height:e,depth:1},l=[s,s,s,s,s,s];this.texture=new cx(l),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;const s={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},l=new cl(5,5,5),c=new ia({name:"CubemapFromEquirect",uniforms:Zr(s.uniforms),vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,side:ii,blending:Da});c.uniforms.tEquirect.value=i;const f=new na(l,c),m=i.minFilter;return i.minFilter===Gs&&(i.minFilter=Bn),new Ib(1,10,this).update(e,f),i.minFilter=m,f.geometry.dispose(),f.material.dispose(),this}clear(e,i=!0,s=!0,l=!0){const c=e.getRenderTarget();for(let f=0;f<6;f++)e.setRenderTarget(this,f),e.clear(i,s,l);e.setRenderTarget(c)}}function F1(r){let e=new WeakMap,i=new WeakMap,s=null;function l(v,y=!1){return v==null?null:y?f(v):c(v)}function c(v){if(v&&v.isTexture){const y=v.mapping;if(y===Pd||y===Id)if(e.has(v)){const M=e.get(v).texture;return m(M,v.mapping)}else{const M=v.image;if(M&&M.height>0){const w=new gx(M.height);return w.fromEquirectangularTexture(r,v),e.set(v,w),v.addEventListener("dispose",d),m(w.texture,v.mapping)}else return null}}return v}function f(v){if(v&&v.isTexture){const y=v.mapping,M=y===Pd||y===Id,w=y===Xs||y===qr;if(M||w){let b=i.get(v);const x=b!==void 0?b.texture.pmremVersion:0;if(v.isRenderTargetTexture&&v.pmremVersion!==x)return s===null&&(s=new uv(r)),b=M?s.fromEquirectangular(v,b):s.fromCubemap(v,b),b.texture.pmremVersion=v.pmremVersion,i.set(v,b),b.texture;if(b!==void 0)return b.texture;{const I=v.image;return M&&I&&I.height>0||w&&I&&h(I)?(s===null&&(s=new uv(r)),b=M?s.fromEquirectangular(v):s.fromCubemap(v),b.texture.pmremVersion=v.pmremVersion,i.set(v,b),v.addEventListener("dispose",g),b.texture):null}}}return v}function m(v,y){return y===Pd?v.mapping=Xs:y===Id&&(v.mapping=qr),v}function h(v){let y=0;const M=6;for(let w=0;w<M;w++)v[w]!==void 0&&y++;return y===M}function d(v){const y=v.target;y.removeEventListener("dispose",d);const M=e.get(y);M!==void 0&&(e.delete(y),M.dispose())}function g(v){const y=v.target;y.removeEventListener("dispose",g);const M=i.get(y);M!==void 0&&(i.delete(y),M.dispose())}function _(){e=new WeakMap,i=new WeakMap,s!==null&&(s.dispose(),s=null)}return{get:l,dispose:_}}function B1(r){const e={};function i(s){if(e[s]!==void 0)return e[s];const l=r.getExtension(s);return e[s]=l,l}return{has:function(s){return i(s)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(s){const l=i(s);return l===null&&Wr("WebGLRenderer: "+s+" extension not supported."),l}}}function z1(r,e,i,s){const l={},c=new WeakMap;function f(_){const v=_.target;v.index!==null&&e.remove(v.index);for(const M in v.attributes)e.remove(v.attributes[M]);v.removeEventListener("dispose",f),delete l[v.id];const y=c.get(v);y&&(e.remove(y),c.delete(v)),s.releaseStatesOfGeometry(v),v.isInstancedBufferGeometry===!0&&delete v._maxInstanceCount,i.memory.geometries--}function m(_,v){return l[v.id]===!0||(v.addEventListener("dispose",f),l[v.id]=!0,i.memory.geometries++),v}function h(_){const v=_.attributes;for(const y in v)e.update(v[y],r.ARRAY_BUFFER)}function d(_){const v=[],y=_.index,M=_.attributes.position;let w=0;if(M===void 0)return;if(y!==null){const I=y.array;w=y.version;for(let G=0,R=I.length;G<R;G+=3){const D=I[G+0],U=I[G+1],P=I[G+2];v.push(D,U,U,P,P,D)}}else{const I=M.array;w=M.version;for(let G=0,R=I.length/3-1;G<R;G+=3){const D=G+0,U=G+1,P=G+2;v.push(D,U,U,P,P,D)}}const b=new(M.count>=65535?ox:rx)(v,1);b.version=w;const x=c.get(_);x&&e.remove(x),c.set(_,b)}function g(_){const v=c.get(_);if(v){const y=_.index;y!==null&&v.version<y.version&&d(_)}else d(_);return c.get(_)}return{get:m,update:h,getWireframeAttribute:g}}function H1(r,e,i){let s;function l(_){s=_}let c,f;function m(_){c=_.type,f=_.bytesPerElement}function h(_,v){r.drawElements(s,v,c,_*f),i.update(v,s,1)}function d(_,v,y){y!==0&&(r.drawElementsInstanced(s,v,c,_*f,y),i.update(v,s,y))}function g(_,v,y){if(y===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(s,v,0,c,_,0,y);let w=0;for(let b=0;b<y;b++)w+=v[b];i.update(w,s,1)}this.setMode=l,this.setIndex=m,this.render=h,this.renderInstances=d,this.renderMultiDraw=g}function G1(r){const e={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function s(c,f,m){switch(i.calls++,f){case r.TRIANGLES:i.triangles+=m*(c/3);break;case r.LINES:i.lines+=m*(c/2);break;case r.LINE_STRIP:i.lines+=m*(c-1);break;case r.LINE_LOOP:i.lines+=m*c;break;case r.POINTS:i.points+=m*c;break;default:Ct("WebGLInfo: Unknown draw mode:",f);break}}function l(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:e,render:i,programs:null,autoReset:!0,reset:l,update:s}}function V1(r,e,i){const s=new WeakMap,l=new nn;function c(f,m,h){const d=f.morphTargetInfluences,g=m.morphAttributes.position||m.morphAttributes.normal||m.morphAttributes.color,_=g!==void 0?g.length:0;let v=s.get(m);if(v===void 0||v.count!==_){let N=function(){P.dispose(),s.delete(m),m.removeEventListener("dispose",N)};v!==void 0&&v.texture.dispose();const y=m.morphAttributes.position!==void 0,M=m.morphAttributes.normal!==void 0,w=m.morphAttributes.color!==void 0,b=m.morphAttributes.position||[],x=m.morphAttributes.normal||[],I=m.morphAttributes.color||[];let G=0;y===!0&&(G=1),M===!0&&(G=2),w===!0&&(G=3);let R=m.attributes.position.count*G,D=1;R>e.maxTextureSize&&(D=Math.ceil(R/e.maxTextureSize),R=e.maxTextureSize);const U=new Float32Array(R*D*4*_),P=new ax(U,R,D,_);P.type=Qi,P.needsUpdate=!0;const T=G*4;for(let z=0;z<_;z++){const q=b[z],$=x[z],j=I[z],X=R*D*4*z;for(let te=0;te<q.count;te++){const F=te*T;y===!0&&(l.fromBufferAttribute(q,te),U[X+F+0]=l.x,U[X+F+1]=l.y,U[X+F+2]=l.z,U[X+F+3]=0),M===!0&&(l.fromBufferAttribute($,te),U[X+F+4]=l.x,U[X+F+5]=l.y,U[X+F+6]=l.z,U[X+F+7]=0),w===!0&&(l.fromBufferAttribute(j,te),U[X+F+8]=l.x,U[X+F+9]=l.y,U[X+F+10]=l.z,U[X+F+11]=j.itemSize===4?l.w:1)}}v={count:_,texture:P,size:new at(R,D)},s.set(m,v),m.addEventListener("dispose",N)}if(f.isInstancedMesh===!0&&f.morphTexture!==null)h.getUniforms().setValue(r,"morphTexture",f.morphTexture,i);else{let y=0;for(let w=0;w<d.length;w++)y+=d[w];const M=m.morphTargetsRelative?1:1-y;h.getUniforms().setValue(r,"morphTargetBaseInfluence",M),h.getUniforms().setValue(r,"morphTargetInfluences",d)}h.getUniforms().setValue(r,"morphTargetsTexture",v.texture,i),h.getUniforms().setValue(r,"morphTargetsTextureSize",v.size)}return{update:c}}function k1(r,e,i,s,l){let c=new WeakMap;function f(d){const g=l.render.frame,_=d.geometry,v=e.get(d,_);if(c.get(v)!==g&&(e.update(v),c.set(v,g)),d.isInstancedMesh&&(d.hasEventListener("dispose",h)===!1&&d.addEventListener("dispose",h),c.get(d)!==g&&(i.update(d.instanceMatrix,r.ARRAY_BUFFER),d.instanceColor!==null&&i.update(d.instanceColor,r.ARRAY_BUFFER),c.set(d,g))),d.isSkinnedMesh){const y=d.skeleton;c.get(y)!==g&&(y.update(),c.set(y,g))}return v}function m(){c=new WeakMap}function h(d){const g=d.target;g.removeEventListener("dispose",h),s.releaseStatesOfObject(g),i.remove(g.instanceMatrix),g.instanceColor!==null&&i.remove(g.instanceColor)}return{update:f,dispose:m}}const X1={[Vv]:"LINEAR_TONE_MAPPING",[kv]:"REINHARD_TONE_MAPPING",[Xv]:"CINEON_TONE_MAPPING",[Wv]:"ACES_FILMIC_TONE_MAPPING",[qv]:"AGX_TONE_MAPPING",[Zv]:"NEUTRAL_TONE_MAPPING",[Yv]:"CUSTOM_TONE_MAPPING"};function W1(r,e,i,s,l,c){const f=new Hi(e,i,{type:r,depthBuffer:l,stencilBuffer:c,samples:s?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let m=null,h=null;const d=new ai;d.setAttribute("position",new Xn([-1,3,0,-1,-1,0,3,-1,0],3)),d.setAttribute("uv",new Xn([0,2,0,0,2,0],2));const g=new wb({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),_=new na(d,g),v=new Tp(-1,1,1,-1,0,1);let y=null,M=null,w=!1,b,x=null,I=[],G=!1;this.setSize=function(R,D){f.setSize(R,D),m!==null&&m.setSize(R,D),h!==null&&h.setSize(R,D);for(let U=0;U<I.length;U++){const P=I[U];P.setSize&&P.setSize(R,D)}},this.setEffects=function(R){I=R,G=I.length>0&&I[0].isRenderPass===!0;const D=f.width,U=f.height;I.length>0&&m===null&&(m=new Hi(D,U,{type:ta,depthBuffer:!1,stencilBuffer:!1}),h=new Hi(D,U,{type:ta,depthBuffer:!1,stencilBuffer:!1}));for(let P=0;P<I.length;P++){const T=I[P];T.setSize&&T.setSize(D,U)}},this.begin=function(R,D){if(w||R.toneMapping===$i&&I.length===0)return!1;if(x=D,D!==null){const U=D.width,P=D.height;(f.width!==U||f.height!==P)&&this.setSize(U,P)}return G===!1&&R.setRenderTarget(f),b=R.toneMapping,R.toneMapping=$i,!0},this.hasRenderPass=function(){return G},this.end=function(R,D){R.toneMapping=b,w=!0;let U=f,P=m;for(let T=0;T<I.length;T++){const N=I[T];N.enabled!==!1&&(N.render(R,P,U,D),N.needsSwap!==!1&&(U=P,P=P===m?h:m))}if(y!==R.outputColorSpace||M!==R.toneMapping){y=R.outputColorSpace,M=R.toneMapping,g.defines={},Tt.getTransfer(y)===Bt&&(g.defines.SRGB_TRANSFER="");const T=X1[M];T&&(g.defines[T]=""),g.needsUpdate=!0}g.uniforms.tDiffuse.value=U.texture,R.setRenderTarget(x),R.render(_,v),x=null,w=!1},this.isCompositing=function(){return w},this.dispose=function(){f.dispose(),m!==null&&m.dispose(),h!==null&&h.dispose(),d.dispose(),g.dispose()}}const _x=new kn,op=new rl(1,1),vx=new ax,xx=new sb,Sx=new cx,pv=[],mv=[],gv=new Float32Array(16),_v=new Float32Array(9),vv=new Float32Array(4);function Kr(r,e,i){const s=r[0];if(s<=0||s>0)return r;const l=e*i;let c=pv[l];if(c===void 0&&(c=new Float32Array(l),pv[l]=c),e!==0){s.toArray(c,0);for(let f=1,m=0;f!==e;++f)m+=i,r[f].toArray(c,m)}return c}function bn(r,e){if(r.length!==e.length)return!1;for(let i=0,s=r.length;i<s;i++)if(r[i]!==e[i])return!1;return!0}function En(r,e){for(let i=0,s=e.length;i<s;i++)r[i]=e[i]}function Mu(r,e){let i=mv[e];i===void 0&&(i=new Int32Array(e),mv[e]=i);for(let s=0;s!==e;++s)i[s]=r.allocateTextureUnit();return i}function Y1(r,e){const i=this.cache;i[0]!==e&&(r.uniform1f(this.addr,e),i[0]=e)}function q1(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(bn(i,e))return;r.uniform2fv(this.addr,e),En(i,e)}}function Z1(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else if(e.r!==void 0)(i[0]!==e.r||i[1]!==e.g||i[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),i[0]=e.r,i[1]=e.g,i[2]=e.b);else{if(bn(i,e))return;r.uniform3fv(this.addr,e),En(i,e)}}function j1(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(bn(i,e))return;r.uniform4fv(this.addr,e),En(i,e)}}function K1(r,e){const i=this.cache,s=e.elements;if(s===void 0){if(bn(i,e))return;r.uniformMatrix2fv(this.addr,!1,e),En(i,e)}else{if(bn(i,s))return;vv.set(s),r.uniformMatrix2fv(this.addr,!1,vv),En(i,s)}}function Q1(r,e){const i=this.cache,s=e.elements;if(s===void 0){if(bn(i,e))return;r.uniformMatrix3fv(this.addr,!1,e),En(i,e)}else{if(bn(i,s))return;_v.set(s),r.uniformMatrix3fv(this.addr,!1,_v),En(i,s)}}function J1(r,e){const i=this.cache,s=e.elements;if(s===void 0){if(bn(i,e))return;r.uniformMatrix4fv(this.addr,!1,e),En(i,e)}else{if(bn(i,s))return;gv.set(s),r.uniformMatrix4fv(this.addr,!1,gv),En(i,s)}}function $1(r,e){const i=this.cache;i[0]!==e&&(r.uniform1i(this.addr,e),i[0]=e)}function eA(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(bn(i,e))return;r.uniform2iv(this.addr,e),En(i,e)}}function tA(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(bn(i,e))return;r.uniform3iv(this.addr,e),En(i,e)}}function nA(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(bn(i,e))return;r.uniform4iv(this.addr,e),En(i,e)}}function iA(r,e){const i=this.cache;i[0]!==e&&(r.uniform1ui(this.addr,e),i[0]=e)}function aA(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(bn(i,e))return;r.uniform2uiv(this.addr,e),En(i,e)}}function sA(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(bn(i,e))return;r.uniform3uiv(this.addr,e),En(i,e)}}function rA(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(bn(i,e))return;r.uniform4uiv(this.addr,e),En(i,e)}}function oA(r,e,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l);let c;this.type===r.SAMPLER_2D_SHADOW?(op.compareFunction=i.isReversedDepthBuffer()?Sp:xp,c=op):c=_x,i.setTexture2D(e||c,l)}function lA(r,e,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTexture3D(e||xx,l)}function cA(r,e,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTextureCube(e||Sx,l)}function uA(r,e,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTexture2DArray(e||vx,l)}function fA(r){switch(r){case 5126:return Y1;case 35664:return q1;case 35665:return Z1;case 35666:return j1;case 35674:return K1;case 35675:return Q1;case 35676:return J1;case 5124:case 35670:return $1;case 35667:case 35671:return eA;case 35668:case 35672:return tA;case 35669:case 35673:return nA;case 5125:return iA;case 36294:return aA;case 36295:return sA;case 36296:return rA;case 35678:case 36198:case 36298:case 36306:case 35682:return oA;case 35679:case 36299:case 36307:return lA;case 35680:case 36300:case 36308:case 36293:return cA;case 36289:case 36303:case 36311:case 36292:return uA}}function dA(r,e){r.uniform1fv(this.addr,e)}function hA(r,e){const i=Kr(e,this.size,2);r.uniform2fv(this.addr,i)}function pA(r,e){const i=Kr(e,this.size,3);r.uniform3fv(this.addr,i)}function mA(r,e){const i=Kr(e,this.size,4);r.uniform4fv(this.addr,i)}function gA(r,e){const i=Kr(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,i)}function _A(r,e){const i=Kr(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,i)}function vA(r,e){const i=Kr(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,i)}function xA(r,e){r.uniform1iv(this.addr,e)}function SA(r,e){r.uniform2iv(this.addr,e)}function yA(r,e){r.uniform3iv(this.addr,e)}function MA(r,e){r.uniform4iv(this.addr,e)}function bA(r,e){r.uniform1uiv(this.addr,e)}function EA(r,e){r.uniform2uiv(this.addr,e)}function TA(r,e){r.uniform3uiv(this.addr,e)}function AA(r,e){r.uniform4uiv(this.addr,e)}function RA(r,e,i){const s=this.cache,l=e.length,c=Mu(i,l);bn(s,c)||(r.uniform1iv(this.addr,c),En(s,c));let f;this.type===r.SAMPLER_2D_SHADOW?f=op:f=_x;for(let m=0;m!==l;++m)i.setTexture2D(e[m]||f,c[m])}function CA(r,e,i){const s=this.cache,l=e.length,c=Mu(i,l);bn(s,c)||(r.uniform1iv(this.addr,c),En(s,c));for(let f=0;f!==l;++f)i.setTexture3D(e[f]||xx,c[f])}function wA(r,e,i){const s=this.cache,l=e.length,c=Mu(i,l);bn(s,c)||(r.uniform1iv(this.addr,c),En(s,c));for(let f=0;f!==l;++f)i.setTextureCube(e[f]||Sx,c[f])}function DA(r,e,i){const s=this.cache,l=e.length,c=Mu(i,l);bn(s,c)||(r.uniform1iv(this.addr,c),En(s,c));for(let f=0;f!==l;++f)i.setTexture2DArray(e[f]||vx,c[f])}function NA(r){switch(r){case 5126:return dA;case 35664:return hA;case 35665:return pA;case 35666:return mA;case 35674:return gA;case 35675:return _A;case 35676:return vA;case 5124:case 35670:return xA;case 35667:case 35671:return SA;case 35668:case 35672:return yA;case 35669:case 35673:return MA;case 5125:return bA;case 36294:return EA;case 36295:return TA;case 36296:return AA;case 35678:case 36198:case 36298:case 36306:case 35682:return RA;case 35679:case 36299:case 36307:return CA;case 35680:case 36300:case 36308:case 36293:return wA;case 36289:case 36303:case 36311:case 36292:return DA}}class UA{constructor(e,i,s){this.id=e,this.addr=s,this.cache=[],this.type=i.type,this.setValue=fA(i.type)}}class LA{constructor(e,i,s){this.id=e,this.addr=s,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=NA(i.type)}}class OA{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,i,s){const l=this.seq;for(let c=0,f=l.length;c!==f;++c){const m=l[c];m.setValue(e,i[m.id],s)}}}const dh=/(\w+)(\])?(\[|\.)?/g;function xv(r,e){r.seq.push(e),r.map[e.id]=e}function PA(r,e,i){const s=r.name,l=s.length;for(dh.lastIndex=0;;){const c=dh.exec(s),f=dh.lastIndex;let m=c[1];const h=c[2]==="]",d=c[3];if(h&&(m=m|0),d===void 0||d==="["&&f+2===l){xv(i,d===void 0?new UA(m,r,e):new LA(m,r,e));break}else{let _=i.map[m];_===void 0&&(_=new OA(m),xv(i,_)),i=_}}}class ru{constructor(e,i){this.seq=[],this.map={};const s=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let f=0;f<s;++f){const m=e.getActiveUniform(i,f),h=e.getUniformLocation(i,m.name);PA(m,h,this)}const l=[],c=[];for(const f of this.seq)f.type===e.SAMPLER_2D_SHADOW||f.type===e.SAMPLER_CUBE_SHADOW||f.type===e.SAMPLER_2D_ARRAY_SHADOW?l.push(f):c.push(f);l.length>0&&(this.seq=l.concat(c))}setValue(e,i,s,l){const c=this.map[i];c!==void 0&&c.setValue(e,s,l)}setOptional(e,i,s){const l=i[s];l!==void 0&&this.setValue(e,s,l)}static upload(e,i,s,l){for(let c=0,f=i.length;c!==f;++c){const m=i[c],h=s[m.id];h.needsUpdate!==!1&&m.setValue(e,h.value,l)}}static seqWithValue(e,i){const s=[];for(let l=0,c=e.length;l!==c;++l){const f=e[l];f.id in i&&s.push(f)}return s}}function Sv(r,e,i){const s=r.createShader(e);return r.shaderSource(s,i),r.compileShader(s),s}const IA=37297;let FA=0;function BA(r,e){const i=r.split(`
`),s=[],l=Math.max(e-6,0),c=Math.min(e+6,i.length);for(let f=l;f<c;f++){const m=f+1;s.push(`${m===e?">":" "} ${m}: ${i[f]}`)}return s.join(`
`)}const yv=new ot;function zA(r){Tt._getMatrix(yv,Tt.workingColorSpace,r);const e=`mat3( ${yv.elements.map(i=>i.toFixed(4))} )`;switch(Tt.getTransfer(r)){case fu:return[e,"LinearTransferOETF"];case Bt:return[e,"sRGBTransferOETF"];default:return nt("WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function Mv(r,e,i){const s=r.getShaderParameter(e,r.COMPILE_STATUS),c=(r.getShaderInfoLog(e)||"").trim();if(s&&c==="")return"";const f=/ERROR: 0:(\d+)/.exec(c);if(f){const m=parseInt(f[1]);return i.toUpperCase()+`

`+c+`

`+BA(r.getShaderSource(e),m)}else return c}function HA(r,e){const i=zA(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${i[1]}( vec4( value.rgb * ${i[0]}, value.a ) );`,"}"].join(`
`)}const GA={[Vv]:"Linear",[kv]:"Reinhard",[Xv]:"Cineon",[Wv]:"ACESFilmic",[qv]:"AgX",[Zv]:"Neutral",[Yv]:"Custom"};function VA(r,e){const i=GA[e];return i===void 0?(nt("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}const qc=new ee;function kA(){Tt.getLuminanceCoefficients(qc);const r=qc.x.toFixed(4),e=qc.y.toFixed(4),i=qc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function XA(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(el).join(`
`)}function WA(r){const e=[];for(const i in r){const s=r[i];s!==!1&&e.push("#define "+i+" "+s)}return e.join(`
`)}function YA(r,e){const i={},s=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let l=0;l<s;l++){const c=r.getActiveAttrib(e,l),f=c.name;let m=1;c.type===r.FLOAT_MAT2&&(m=2),c.type===r.FLOAT_MAT3&&(m=3),c.type===r.FLOAT_MAT4&&(m=4),i[f]={type:c.type,location:r.getAttribLocation(e,f),locationSize:m}}return i}function el(r){return r!==""}function bv(r,e){const i=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ev(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const qA=/^[ \t]*#include +<([\w\d./]+)>/gm;function lp(r){return r.replace(qA,jA)}const ZA=new Map;function jA(r,e){let i=pt[e];if(i===void 0){const s=ZA.get(e);if(s!==void 0)i=pt[s],nt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,s);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return lp(i)}const KA=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Tv(r){return r.replace(KA,QA)}function QA(r,e,i,s){let l="";for(let c=parseInt(e);c<parseInt(i);c++)l+=s.replace(/\[\s*i\s*\]/g,"[ "+c+" ]").replace(/UNROLLED_LOOP_INDEX/g,c);return l}function Av(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const JA={[eu]:"SHADOWMAP_TYPE_PCF",[$o]:"SHADOWMAP_TYPE_VSM"};function $A(r){return JA[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const eR={[Xs]:"ENVMAP_TYPE_CUBE",[qr]:"ENVMAP_TYPE_CUBE",[gu]:"ENVMAP_TYPE_CUBE_UV"};function tR(r){return r.envMap===!1?"ENVMAP_TYPE_CUBE":eR[r.envMapMode]||"ENVMAP_TYPE_CUBE"}const nR={[qr]:"ENVMAP_MODE_REFRACTION"};function iR(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":nR[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}const aR={[Gv]:"ENVMAP_BLENDING_MULTIPLY",[PM]:"ENVMAP_BLENDING_MIX",[IM]:"ENVMAP_BLENDING_ADD"};function sR(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":aR[r.combine]||"ENVMAP_BLENDING_NONE"}function rR(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const i=Math.log2(e)-2,s=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:s,maxMip:i}}function oR(r,e,i,s){const l=r.getContext(),c=i.defines;let f=i.vertexShader,m=i.fragmentShader;const h=$A(i),d=tR(i),g=iR(i),_=sR(i),v=rR(i),y=XA(i),M=WA(c),w=l.createProgram();let b,x,I=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(b=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,M].filter(el).join(`
`),b.length>0&&(b+=`
`),x=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,M].filter(el).join(`
`),x.length>0&&(x+=`
`)):(b=[Av(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,M,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+g:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexNormals?"#define HAS_NORMAL":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+h:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(el).join(`
`),x=[Av(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,M,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+d:"",i.envMap?"#define "+g:"",i.envMap?"#define "+_:"",v?"#define CUBEUV_TEXEL_WIDTH "+v.texelWidth:"",v?"#define CUBEUV_TEXEL_HEIGHT "+v.texelHeight:"",v?"#define CUBEUV_MAX_MIP "+v.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.retroreflection?"#define USE_RETROREFLECTION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor?"#define USE_COLOR":"",i.vertexAlphas||i.batchingColor?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+h:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==$i?"#define TONE_MAPPING":"",i.toneMapping!==$i?pt.tonemapping_pars_fragment:"",i.toneMapping!==$i?VA("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",pt.colorspace_pars_fragment,HA("linearToOutputTexel",i.outputColorSpace),kA(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(el).join(`
`)),f=lp(f),f=bv(f,i),f=Ev(f,i),m=lp(m),m=bv(m,i),m=Ev(m,i),f=Tv(f),m=Tv(m),i.isRawShaderMaterial!==!0&&(I=`#version 300 es
`,b=[y,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+b,x=["#define varying in",i.glslVersion===N_?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===N_?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const G=I+b+f,R=I+x+m,D=Sv(l,l.VERTEX_SHADER,G),U=Sv(l,l.FRAGMENT_SHADER,R);l.attachShader(w,D),l.attachShader(w,U),i.index0AttributeName!==void 0?l.bindAttribLocation(w,0,i.index0AttributeName):i.hasPositionAttribute===!0&&l.bindAttribLocation(w,0,"position"),l.linkProgram(w);function P(q){if(r.debug.checkShaderErrors){const $=l.getProgramInfoLog(w)||"",j=l.getShaderInfoLog(D)||"",X=l.getShaderInfoLog(U)||"",te=$.trim(),F=j.trim(),V=X.trim();let ue=!0,K=!0;if(l.getProgramParameter(w,l.LINK_STATUS)===!1)if(ue=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(l,w,D,U);else{const he=Mv(l,D,"vertex"),L=Mv(l,U,"fragment");Ct("WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(w,l.VALIDATE_STATUS)+`

Material Name: `+q.name+`
Material Type: `+q.type+`

Program Info Log: `+te+`
`+he+`
`+L)}else te!==""?nt("WebGLProgram: Program Info Log:",te):(F===""||V==="")&&(K=!1);K&&(q.diagnostics={runnable:ue,programLog:te,vertexShader:{log:F,prefix:b},fragmentShader:{log:V,prefix:x}})}l.deleteShader(D),l.deleteShader(U),T=new ru(l,w),N=YA(l,w)}let T;this.getUniforms=function(){return T===void 0&&P(this),T};let N;this.getAttributes=function(){return N===void 0&&P(this),N};let z=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return z===!1&&(z=l.getProgramParameter(w,IA)),z},this.destroy=function(){s.releaseStatesOfProgram(this),l.deleteProgram(w),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=FA++,this.cacheKey=e,this.usedTimes=1,this.program=w,this.vertexShader=D,this.fragmentShader=U,this}let lR=0;class cR{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,i,s){const l=this._getShaderCacheForMaterial(e);return l.has(i)===!1&&(l.add(i),i.usedTimes++),l.has(s)===!1&&(l.add(s),s.usedTimes++),this}remove(e){const i=this.materialCache.get(e);for(const s of i)s.usedTimes--,s.usedTimes===0&&this.shaderCache.delete(s.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const i=this.materialCache;let s=i.get(e);return s===void 0&&(s=new Set,i.set(e,s)),s}_getShaderStage(e){const i=this.shaderCache;let s=i.get(e);return s===void 0&&(s=new uR(e),i.set(e,s)),s}}class uR{constructor(e){this.id=lR++,this.code=e,this.usedTimes=0}}function fR(r){return r===Ws||r===lu||r===cu}function dR(r,e,i,s,l,c){const f=new Mp,m=new cR,h=new Set,d=[],g=new Map,_=s.logarithmicDepthBuffer;let v=s.precision;const y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(T){return h.add(T),T===0?"uv":`uv${T}`}function w(T,N,z,q,$,j){const X=q.fog,te=$.geometry,F=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?q.environment:null,V=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap,ue=e.get(T.envMap||F,V),K=ue&&ue.mapping===gu?ue.image.height:null,he=y[T.type];T.precision!==null&&(v=s.getMaxPrecision(T.precision),v!==T.precision&&nt("WebGLProgram.getParameters:",T.precision,"not supported, using",v,"instead."));const L=te.morphAttributes.position||te.morphAttributes.normal||te.morphAttributes.color,ne=L!==void 0?L.length:0;let _e=0;te.morphAttributes.position!==void 0&&(_e=1),te.morphAttributes.normal!==void 0&&(_e=2),te.morphAttributes.color!==void 0&&(_e=3);let Ee,Le,Xe,re;if(he){const Ht=ji[he];Ee=Ht.vertexShader,Le=Ht.fragmentShader}else{Ee=T.vertexShader,Le=T.fragmentShader;const Ht=m.getVertexShaderStage(T),At=m.getFragmentShaderStage(T);m.update(T,Ht,At),Xe=Ht.id,re=At.id}const ve=r.getRenderTarget(),Ae=r.state.buffers.depth.getReversed(),tt=$.isInstancedMesh===!0,He=$.isBatchedMesh===!0,ct=!!T.map,an=!!T.matcap,st=!!ue,yt=!!T.aoMap,Ot=!!T.lightMap,gt=!!T.bumpMap&&T.wireframe===!1,Wt=!!T.normalMap,sn=!!T.displacementMap,Tn=!!T.emissiveMap,Yt=!!T.metalnessMap,rn=!!T.roughnessMap,Z=T.anisotropy>0,Pt=T.clearcoat>0,Nt=T.dispersion>0,O=T.retroreflectivity>0,E=T.iridescence>0,J=T.sheen>0,le=T.transmission>0,pe=Z&&!!T.anisotropyMap,Te=Pt&&!!T.clearcoatMap,De=Pt&&!!T.clearcoatNormalMap,me=Pt&&!!T.clearcoatRoughnessMap,ge=E&&!!T.iridescenceMap,Re=E&&!!T.iridescenceThicknessMap,Ge=J&&!!T.sheenColorMap,Oe=J&&!!T.sheenRoughnessMap,Ne=!!T.specularMap,Qe=!!T.specularColorMap,Je=!!T.specularIntensityMap,it=le&&!!T.transmissionMap,Y=le&&!!T.thicknessMap,Ce=!!T.gradientMap,Se=!!T.alphaMap,we=T.alphaTest>0,Fe=!!T.alphaHash,be=!!T.extensions;let Ke=$i;T.toneMapped&&(ve===null||ve.isXRRenderTarget===!0)&&(Ke=r.toneMapping);const We={shaderID:he,shaderType:T.type,shaderName:T.name,vertexShader:Ee,fragmentShader:Le,defines:T.defines,customVertexShaderID:Xe,customFragmentShaderID:re,isRawShaderMaterial:T.isRawShaderMaterial===!0,glslVersion:T.glslVersion,precision:v,batching:He,batchingColor:He&&$._colorsTexture!==null,instancing:tt,instancingColor:tt&&$.instanceColor!==null,instancingMorph:tt&&$.morphTexture!==null,outputColorSpace:ve===null?r.outputColorSpace:ve.isXRRenderTarget===!0?ve.texture.colorSpace:Tt.workingColorSpace,alphaToCoverage:!!T.alphaToCoverage,map:ct,matcap:an,envMap:st,envMapMode:st&&ue.mapping,envMapCubeUVHeight:K,aoMap:yt,lightMap:Ot,bumpMap:gt,normalMap:Wt,displacementMap:sn,emissiveMap:Tn,normalMapObjectSpace:Wt&&T.normalMapType===zM,normalMapTangentSpace:Wt&&T.normalMapType===ap,packedNormalMap:Wt&&T.normalMapType===ap&&fR(T.normalMap.format),metalnessMap:Yt,roughnessMap:rn,anisotropy:Z,anisotropyMap:pe,clearcoat:Pt,clearcoatMap:Te,clearcoatNormalMap:De,clearcoatRoughnessMap:me,dispersion:Nt,retroreflection:O,iridescence:E,iridescenceMap:ge,iridescenceThicknessMap:Re,sheen:J,sheenColorMap:Ge,sheenRoughnessMap:Oe,specularMap:Ne,specularColorMap:Qe,specularIntensityMap:Je,transmission:le,transmissionMap:it,thicknessMap:Y,gradientMap:Ce,opaque:T.transparent===!1&&T.blending===tl&&T.alphaToCoverage===!1,alphaMap:Se,alphaTest:we,alphaHash:Fe,combine:T.combine,mapUv:ct&&M(T.map.channel),aoMapUv:yt&&M(T.aoMap.channel),lightMapUv:Ot&&M(T.lightMap.channel),bumpMapUv:gt&&M(T.bumpMap.channel),normalMapUv:Wt&&M(T.normalMap.channel),displacementMapUv:sn&&M(T.displacementMap.channel),emissiveMapUv:Tn&&M(T.emissiveMap.channel),metalnessMapUv:Yt&&M(T.metalnessMap.channel),roughnessMapUv:rn&&M(T.roughnessMap.channel),anisotropyMapUv:pe&&M(T.anisotropyMap.channel),clearcoatMapUv:Te&&M(T.clearcoatMap.channel),clearcoatNormalMapUv:De&&M(T.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:me&&M(T.clearcoatRoughnessMap.channel),iridescenceMapUv:ge&&M(T.iridescenceMap.channel),iridescenceThicknessMapUv:Re&&M(T.iridescenceThicknessMap.channel),sheenColorMapUv:Ge&&M(T.sheenColorMap.channel),sheenRoughnessMapUv:Oe&&M(T.sheenRoughnessMap.channel),specularMapUv:Ne&&M(T.specularMap.channel),specularColorMapUv:Qe&&M(T.specularColorMap.channel),specularIntensityMapUv:Je&&M(T.specularIntensityMap.channel),transmissionMapUv:it&&M(T.transmissionMap.channel),thicknessMapUv:Y&&M(T.thicknessMap.channel),alphaMapUv:Se&&M(T.alphaMap.channel),vertexTangents:!!te.attributes.tangent&&(Wt||Z),vertexNormals:!!te.attributes.normal,vertexColors:T.vertexColors,vertexAlphas:T.vertexColors===!0&&!!te.attributes.color&&te.attributes.color.itemSize===4,pointsUvs:$.isPoints===!0&&!!te.attributes.uv&&(ct||Se),fog:!!X,useFog:T.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:T.wireframe===!1&&(T.flatShading===!0||te.attributes.normal===void 0&&Wt===!1&&(T.isMeshLambertMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isMeshPhysicalMaterial)),sizeAttenuation:T.sizeAttenuation===!0,logarithmicDepthBuffer:_,reversedDepthBuffer:Ae,skinning:$.isSkinnedMesh===!0,hasPositionAttribute:te.attributes.position!==void 0,morphTargets:te.morphAttributes.position!==void 0,morphNormals:te.morphAttributes.normal!==void 0,morphColors:te.morphAttributes.color!==void 0,morphTargetsCount:ne,morphTextureStride:_e,numSunLights:N.sun.length,numDirLights:N.directional.length,numPointLights:N.point.length,numSpotLights:N.spot.length,numSpotLightMaps:N.spotLightMap.length,numRectAreaLights:N.rectArea.length,numHemiLights:N.hemi.length,numSunLightShadows:N.sunShadowMap.length,numDirLightShadows:N.directionalShadowMap.length,numPointLightShadows:N.pointShadowMap.length,numSpotLightShadows:N.spotShadowMap.length,numSpotLightShadowsWithMaps:N.numSpotLightShadowsWithMaps,numLightProbes:N.numLightProbes,numLightProbeGrids:j.length,numClippingPlanes:c.numPlanes,numClipIntersection:c.numIntersection,dithering:T.dithering,shadowMapEnabled:r.shadowMap.enabled&&z.length>0,shadowMapType:r.shadowMap.type,toneMapping:Ke,decodeVideoTexture:ct&&T.map.isVideoTexture===!0&&Tt.getTransfer(T.map.colorSpace)===Bt,decodeVideoTextureEmissive:Tn&&T.emissiveMap.isVideoTexture===!0&&Tt.getTransfer(T.emissiveMap.colorSpace)===Bt,premultipliedAlpha:T.premultipliedAlpha,doubleSided:T.side===Ki,flipSided:T.side===ii,useDepthPacking:T.depthPacking>=0,depthPacking:T.depthPacking||0,index0AttributeName:T.index0AttributeName,extensionClipCullDistance:be&&T.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(be&&T.extensions.multiDraw===!0||He)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:T.customProgramCacheKey()};return We.vertexUv1s=h.has(1),We.vertexUv2s=h.has(2),We.vertexUv3s=h.has(3),h.clear(),We}function b(T){const N=[];if(T.shaderID?N.push(T.shaderID):(N.push(T.customVertexShaderID),N.push(T.customFragmentShaderID)),T.defines!==void 0)for(const z in T.defines)N.push(z),N.push(T.defines[z]);return T.isRawShaderMaterial===!1&&(x(N,T),I(N,T),N.push(r.outputColorSpace)),N.push(T.customProgramCacheKey),N.join()}function x(T,N){T.push(N.precision),T.push(N.outputColorSpace),T.push(N.envMapMode),T.push(N.envMapCubeUVHeight),T.push(N.mapUv),T.push(N.alphaMapUv),T.push(N.lightMapUv),T.push(N.aoMapUv),T.push(N.bumpMapUv),T.push(N.normalMapUv),T.push(N.displacementMapUv),T.push(N.emissiveMapUv),T.push(N.metalnessMapUv),T.push(N.roughnessMapUv),T.push(N.anisotropyMapUv),T.push(N.clearcoatMapUv),T.push(N.clearcoatNormalMapUv),T.push(N.clearcoatRoughnessMapUv),T.push(N.iridescenceMapUv),T.push(N.iridescenceThicknessMapUv),T.push(N.sheenColorMapUv),T.push(N.sheenRoughnessMapUv),T.push(N.specularMapUv),T.push(N.specularColorMapUv),T.push(N.specularIntensityMapUv),T.push(N.transmissionMapUv),T.push(N.thicknessMapUv),T.push(N.combine),T.push(N.fogExp2),T.push(N.sizeAttenuation),T.push(N.morphTargetsCount),T.push(N.morphAttributeCount),T.push(N.numSunLights),T.push(N.numDirLights),T.push(N.numPointLights),T.push(N.numSpotLights),T.push(N.numSpotLightMaps),T.push(N.numHemiLights),T.push(N.numRectAreaLights),T.push(N.numSunLightShadows),T.push(N.numDirLightShadows),T.push(N.numPointLightShadows),T.push(N.numSpotLightShadows),T.push(N.numSpotLightShadowsWithMaps),T.push(N.numLightProbes),T.push(N.shadowMapType),T.push(N.toneMapping),T.push(N.numClippingPlanes),T.push(N.numClipIntersection),T.push(N.depthPacking)}function I(T,N){f.disableAll(),N.instancing&&f.enable(0),N.instancingColor&&f.enable(1),N.instancingMorph&&f.enable(2),N.matcap&&f.enable(3),N.envMap&&f.enable(4),N.normalMapObjectSpace&&f.enable(5),N.normalMapTangentSpace&&f.enable(6),N.clearcoat&&f.enable(7),N.iridescence&&f.enable(8),N.alphaTest&&f.enable(9),N.vertexColors&&f.enable(10),N.vertexAlphas&&f.enable(11),N.vertexUv1s&&f.enable(12),N.vertexUv2s&&f.enable(13),N.vertexUv3s&&f.enable(14),N.vertexTangents&&f.enable(15),N.anisotropy&&f.enable(16),N.alphaHash&&f.enable(17),N.batching&&f.enable(18),N.dispersion&&f.enable(19),N.retroreflection&&f.enable(24),N.batchingColor&&f.enable(20),N.gradientMap&&f.enable(21),N.packedNormalMap&&f.enable(22),N.vertexNormals&&f.enable(23),T.push(f.mask),f.disableAll(),N.fog&&f.enable(0),N.useFog&&f.enable(1),N.flatShading&&f.enable(2),N.logarithmicDepthBuffer&&f.enable(3),N.reversedDepthBuffer&&f.enable(4),N.skinning&&f.enable(5),N.morphTargets&&f.enable(6),N.morphNormals&&f.enable(7),N.morphColors&&f.enable(8),N.premultipliedAlpha&&f.enable(9),N.shadowMapEnabled&&f.enable(10),N.doubleSided&&f.enable(11),N.flipSided&&f.enable(12),N.useDepthPacking&&f.enable(13),N.dithering&&f.enable(14),N.transmission&&f.enable(15),N.sheen&&f.enable(16),N.opaque&&f.enable(17),N.pointsUvs&&f.enable(18),N.decodeVideoTexture&&f.enable(19),N.decodeVideoTextureEmissive&&f.enable(20),N.alphaToCoverage&&f.enable(21),N.numLightProbeGrids>0&&f.enable(22),N.hasPositionAttribute&&f.enable(23),T.push(f.mask)}function G(T){const N=y[T.type];let z;if(N){const q=ji[N];z=Ab.clone(q.uniforms)}else z=T.uniforms;return z}function R(T,N){let z=g.get(N);return z!==void 0?++z.usedTimes:(z=new oR(r,N,T,l),d.push(z),g.set(N,z)),z}function D(T){if(--T.usedTimes===0){const N=d.indexOf(T);d[N]=d[d.length-1],d.pop(),g.delete(T.cacheKey),T.destroy()}}function U(T){m.remove(T)}function P(){m.dispose()}return{getParameters:w,getProgramCacheKey:b,getUniforms:G,acquireProgram:R,releaseProgram:D,releaseShaderCache:U,programs:d,dispose:P}}function hR(){let r=new WeakMap;function e(f){return r.has(f)}function i(f){let m=r.get(f);return m===void 0&&(m={},r.set(f,m)),m}function s(f){r.delete(f)}function l(f,m,h){r.get(f)[m]=h}function c(){r=new WeakMap}return{has:e,get:i,remove:s,update:l,dispose:c}}function pR(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.materialVariant!==e.materialVariant?r.materialVariant-e.materialVariant:r.z!==e.z?r.z-e.z:r.id-e.id}function Rv(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function Cv(){const r=[];let e=0;const i=[],s=[],l=[];function c(){e=0,i.length=0,s.length=0,l.length=0}function f(v){let y=0;return v.isInstancedMesh&&(y+=2),v.isSkinnedMesh&&(y+=1),y}function m(v,y,M,w,b,x){let I=r[e];return I===void 0?(I={id:v.id,object:v,geometry:y,material:M,materialVariant:f(v),groupOrder:w,renderOrder:v.renderOrder,z:b,group:x},r[e]=I):(I.id=v.id,I.object=v,I.geometry=y,I.material=M,I.materialVariant=f(v),I.groupOrder=w,I.renderOrder=v.renderOrder,I.z=b,I.group=x),e++,I}function h(v,y,M,w,b,x,I){I.reversedDepth===!0&&(b=-b);const G=m(v,y,M,w,b,x);M.transmission>0?s.push(G):M.transparent===!0?l.push(G):i.push(G)}function d(v,y,M,w,b,x){const I=m(v,y,M,w,b,x);M.transmission>0?s.unshift(I):M.transparent===!0?l.unshift(I):i.unshift(I)}function g(v,y){i.length>1&&i.sort(v||pR),s.length>1&&s.sort(y||Rv),l.length>1&&l.sort(y||Rv)}function _(){for(let v=e,y=r.length;v<y;v++){const M=r[v];if(M.id===null)break;M.id=null,M.object=null,M.geometry=null,M.material=null,M.group=null}}return{opaque:i,transmissive:s,transparent:l,init:c,push:h,unshift:d,finish:_,sort:g}}function mR(){let r=new WeakMap;function e(s,l){const c=r.get(s);let f;return c===void 0?(f=new Cv,r.set(s,[f])):l>=c.length?(f=new Cv,c.push(f)):f=c[l],f}function i(){r=new WeakMap}return{get:e,dispose:i}}function gR(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let i;switch(e.type){case"SunLight":case"DirectionalLight":i={direction:new ee,color:new _t};break;case"SpotLight":i={position:new ee,direction:new ee,color:new _t,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new ee,color:new _t,distance:0,decay:0};break;case"HemisphereLight":i={direction:new ee,skyColor:new _t,groundColor:new _t};break;case"RectAreaLight":i={color:new _t,position:new ee,halfWidth:new ee,halfHeight:new ee};break}return r[e.id]=i,i}}}function _R(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let i;switch(e.type){case"SunLight":case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=i,i}}}let vR=0;function xR(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function SR(r){const e=new gR,i=_R(),s={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let d=0;d<9;d++)s.probe.push(new ee);const l=new ee,c=new tn,f=new tn;function m(d){let g=0,_=0,v=0;for(let $=0;$<9;$++)s.probe[$].set(0,0,0);let y=0,M=0,w=0,b=0,x=0,I=0,G=0,R=0,D=0,U=0,P=0,T=0,N=0,z=0;d.sort(xR);for(let $=0,j=d.length;$<j;$++){const X=d[$],te=X.color,F=X.intensity,V=X.distance;let ue=null;if(X.shadow&&X.shadow.map&&(X.shadow.map.texture.format===Ws?ue=X.shadow.map.texture:ue=X.shadow.map.depthTexture||X.shadow.map.texture),X.isAmbientLight)g+=te.r*F,_+=te.g*F,v+=te.b*F;else if(X.isLightProbe){for(let K=0;K<9;K++)s.probe[K].addScaledVector(X.sh.coefficients[K],F);z++}else if(X.isSunLight){const K=e.get(X);if(K.color.copy(X.color).multiplyScalar(X.intensity),X.castShadow){const he=X.shadow,L=i.get(X);L.shadowIntensity=he.intensity,L.shadowBias=he.bias,L.shadowNormalBias=he.normalBias,L.shadowRadius=he.radius,L.shadowMapSize.copy(he.mapSize).multiply(he.getFrameExtents()),s.sunShadow[M]=L,s.sunShadowMap[M]=ue;const ne=he.getViewportCount();for(let _e=0;_e<ne;_e++)s.sunShadowMatrix[w+_e]=he.getMatrix(_e),s.sunShadowCascade[w+_e]=he._cascadeData[_e];w+=ne,M++}s.sun[y]=K,y++}else if(X.isDirectionalLight){const K=e.get(X);if(K.color.copy(X.color).multiplyScalar(X.intensity),X.castShadow){const he=X.shadow,L=i.get(X);L.shadowIntensity=he.intensity,L.shadowBias=he.bias,L.shadowNormalBias=he.normalBias,L.shadowRadius=he.radius,L.shadowMapSize=he.mapSize,s.directionalShadow[b]=L,s.directionalShadowMap[b]=ue,s.directionalShadowMatrix[b]=X.shadow.matrix,D++}s.directional[b]=K,b++}else if(X.isSpotLight){const K=e.get(X);K.position.setFromMatrixPosition(X.matrixWorld),K.color.copy(te).multiplyScalar(F),K.distance=V,K.coneCos=Math.cos(X.angle),K.penumbraCos=Math.cos(X.angle*(1-X.penumbra)),K.decay=X.decay,s.spot[I]=K;const he=X.shadow;if(X.map&&(s.spotLightMap[T]=X.map,T++,he.updateMatrices(X),X.castShadow&&N++),s.spotLightMatrix[I]=he.matrix,X.castShadow){const L=i.get(X);L.shadowIntensity=he.intensity,L.shadowBias=he.bias,L.shadowNormalBias=he.normalBias,L.shadowRadius=he.radius,L.shadowMapSize=he.mapSize,s.spotShadow[I]=L,s.spotShadowMap[I]=ue,P++}I++}else if(X.isRectAreaLight){const K=e.get(X);K.color.copy(te).multiplyScalar(F),K.halfWidth.set(X.width*.5,0,0),K.halfHeight.set(0,X.height*.5,0),s.rectArea[G]=K,G++}else if(X.isPointLight){const K=e.get(X);if(K.color.copy(X.color).multiplyScalar(X.intensity),K.distance=X.distance,K.decay=X.decay,X.castShadow){const he=X.shadow,L=i.get(X);L.shadowIntensity=he.intensity,L.shadowBias=he.bias,L.shadowNormalBias=he.normalBias,L.shadowRadius=he.radius,L.shadowMapSize=he.mapSize,L.shadowCameraNear=he.camera.near,L.shadowCameraFar=he.camera.far,s.pointShadow[x]=L,s.pointShadowMap[x]=ue,s.pointShadowMatrix[x]=X.shadow.matrix,U++}s.point[x]=K,x++}else if(X.isHemisphereLight){const K=e.get(X);K.skyColor.copy(X.color).multiplyScalar(F),K.groundColor.copy(X.groundColor).multiplyScalar(F),s.hemi[R]=K,R++}}G>0&&(r.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Ie.LTC_FLOAT_1,s.rectAreaLTC2=Ie.LTC_FLOAT_2):(s.rectAreaLTC1=Ie.LTC_HALF_1,s.rectAreaLTC2=Ie.LTC_HALF_2)),s.ambient[0]=g,s.ambient[1]=_,s.ambient[2]=v;const q=s.hash;(q.sunLength!==y||q.directionalLength!==b||q.pointLength!==x||q.spotLength!==I||q.rectAreaLength!==G||q.hemiLength!==R||q.numSunShadows!==M||q.numDirectionalShadows!==D||q.numPointShadows!==U||q.numSpotShadows!==P||q.numSpotMaps!==T||q.numLightProbes!==z)&&(s.sun.length=y,s.directional.length=b,s.spot.length=I,s.rectArea.length=G,s.point.length=x,s.hemi.length=R,s.sunShadow.length=M,s.sunShadowMap.length=M,s.sunShadowMatrix.length=w,s.sunShadowCascade.length=w,s.directionalShadow.length=D,s.directionalShadowMap.length=D,s.directionalShadowMatrix.length=D,s.pointShadow.length=U,s.pointShadowMap.length=U,s.pointShadowMatrix.length=U,s.spotShadow.length=P,s.spotShadowMap.length=P,s.spotLightMatrix.length=P+T-N,s.spotLightMap.length=T,s.numSpotLightShadowsWithMaps=N,s.numLightProbes=z,q.sunLength=y,q.directionalLength=b,q.pointLength=x,q.spotLength=I,q.rectAreaLength=G,q.hemiLength=R,q.numSunShadows=M,q.numDirectionalShadows=D,q.numPointShadows=U,q.numSpotShadows=P,q.numSpotMaps=T,q.numLightProbes=z,s.version=vR++)}function h(d,g){let _=0,v=0,y=0,M=0,w=0,b=0;const x=g.matrixWorldInverse;for(let I=0,G=d.length;I<G;I++){const R=d[I];if(R.isSunLight){const D=s.sun[_];D.direction.setFromMatrixPosition(R.matrixWorld),D.direction.transformDirection(x),_++}else if(R.isDirectionalLight){const D=s.directional[v];D.direction.setFromMatrixPosition(R.matrixWorld),l.setFromMatrixPosition(R.target.matrixWorld),D.direction.sub(l),D.direction.transformDirection(x),v++}else if(R.isSpotLight){const D=s.spot[M];D.position.setFromMatrixPosition(R.matrixWorld),D.position.applyMatrix4(x),D.direction.setFromMatrixPosition(R.matrixWorld),l.setFromMatrixPosition(R.target.matrixWorld),D.direction.sub(l),D.direction.transformDirection(x),M++}else if(R.isRectAreaLight){const D=s.rectArea[w];D.position.setFromMatrixPosition(R.matrixWorld),D.position.applyMatrix4(x),f.identity(),c.copy(R.matrixWorld),c.premultiply(x),f.extractRotation(c),D.halfWidth.set(R.width*.5,0,0),D.halfHeight.set(0,R.height*.5,0),D.halfWidth.applyMatrix4(f),D.halfHeight.applyMatrix4(f),w++}else if(R.isPointLight){const D=s.point[y];D.position.setFromMatrixPosition(R.matrixWorld),D.position.applyMatrix4(x),y++}else if(R.isHemisphereLight){const D=s.hemi[b];D.direction.setFromMatrixPosition(R.matrixWorld),D.direction.transformDirection(x),b++}}}return{setup:m,setupView:h,state:s}}function wv(r){const e=new SR(r),i=[],s=[],l=[];function c(v){_.camera=v,i.length=0,s.length=0,l.length=0}function f(v){i.push(v)}function m(v){s.push(v)}function h(v){l.push(v)}function d(){e.setup(i)}function g(v){e.setupView(i,v)}const _={lightsArray:i,shadowsArray:s,lightProbeGridArray:l,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:c,state:_,setupLights:d,setupLightsView:g,pushLight:f,pushShadow:m,pushLightProbeGrid:h}}function yR(r){let e=new WeakMap;function i(l,c=0){const f=e.get(l);let m;return f===void 0?(m=new wv(r),e.set(l,[m])):c>=f.length?(m=new wv(r),f.push(m)):m=f[c],m}function s(){e=new WeakMap}return{get:i,dispose:s}}const MR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,bR=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,ER=[new ee(1,0,0),new ee(-1,0,0),new ee(0,1,0),new ee(0,-1,0),new ee(0,0,1),new ee(0,0,-1)],TR=[new ee(0,-1,0),new ee(0,-1,0),new ee(0,0,1),new ee(0,0,-1),new ee(0,-1,0),new ee(0,-1,0)],Dv=new tn,Jo=new ee,hh=new ee;function AR(r,e,i){let s=new bp;const l=new at,c=new at,f=new nn,m=new Nb,h=new Ub,d={},g=i.maxTextureSize,_={[ks]:ii,[ii]:ks,[Ki]:Ki},v=new ia({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new at},radius:{value:4}},vertexShader:MR,fragmentShader:bR}),y=v.clone();y.defines.HORIZONTAL_PASS=1;const M=new ai;M.setAttribute("position",new ni(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const w=new na(M,v),b=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=eu;let x=this.type;this.render=function(U,P,T){if(b.enabled===!1||b.autoUpdate===!1&&b.needsUpdate===!1||U.length===0)return;this.type===gM&&(nt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=eu);const N=r.getRenderTarget(),z=r.getActiveCubeFace(),q=r.getActiveMipmapLevel(),$=r.state;$.setBlending(Da),$.buffers.depth.getReversed()===!0?$.buffers.color.setClear(0,0,0,0):$.buffers.color.setClear(1,1,1,1),$.buffers.depth.setTest(!0),$.setScissorTest(!1);const j=x!==this.type;j&&P.traverse(function(X){X.material&&(Array.isArray(X.material)?X.material.forEach(te=>te.needsUpdate=!0):X.material.needsUpdate=!0)});for(let X=0,te=U.length;X<te;X++){const F=U[X],V=F.shadow;if(V===void 0){nt("WebGLShadowMap:",F,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;l.copy(V.mapSize);const ue=V.getFrameExtents();l.multiply(ue),c.copy(V.mapSize),(l.x>g||l.y>g)&&(l.x>g&&(c.x=Math.floor(g/ue.x),l.x=c.x*ue.x,V.mapSize.x=c.x),l.y>g&&(c.y=Math.floor(g/ue.y),l.y=c.y*ue.y,V.mapSize.y=c.y));const K=r.state.buffers.depth.getReversed();if(V.camera._reversedDepth=K,V.map===null||j===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===$o){if(F.isPointLight){nt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new Hi(l.x,l.y,{format:Ws,type:ta,minFilter:Bn,magFilter:Bn,generateMipmaps:!1}),V.map.texture.name=F.name+".shadowMap",V.map.depthTexture=new rl(l.x,l.y,Qi),V.map.depthTexture.name=F.name+".shadowMapDepth",V.map.depthTexture.format=La,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Ln,V.map.depthTexture.magFilter=Ln}else F.isPointLight?(V.map=new gx(l.x),V.map.depthTexture=new Eb(l.x,ea)):(V.map=new Hi(l.x,l.y),V.map.depthTexture=new rl(l.x,l.y,ea)),V.map.depthTexture.name=F.name+".shadowMap",V.map.depthTexture.format=La,this.type===eu?(V.map.depthTexture.compareFunction=K?Sp:xp,V.map.depthTexture.minFilter=Bn,V.map.depthTexture.magFilter=Bn):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Ln,V.map.depthTexture.magFilter=Ln);V.camera.updateProjectionMatrix()}V.map.isWebGLCubeRenderTarget!==!0&&(V.map.width!==l.x||V.map.height!==l.y)&&V.map.setSize(l.x,l.y);const he=V.map.isWebGLCubeRenderTarget?6:V.getViewportCount();F.isPointLight!==!0&&V.updateMatrices(F,T);for(let L=0;L<he;L++){const ne=V.getCamera(L);if(F.isPointLight){const _e=V.camera,Ee=V.matrix,Le=F.distance||_e.far;Le!==_e.far&&(_e.far=Le,_e.updateProjectionMatrix()),Jo.setFromMatrixPosition(F.matrixWorld),_e.position.copy(Jo),hh.copy(_e.position),hh.add(ER[L]),_e.up.copy(TR[L]),_e.lookAt(hh),_e.updateMatrixWorld(),Ee.makeTranslation(-Jo.x,-Jo.y,-Jo.z),Dv.multiplyMatrices(_e.projectionMatrix,_e.matrixWorldInverse),V._frustum.setFromProjectionMatrix(Dv,_e.coordinateSystem,_e.reversedDepth)}if(V.map.isWebGLCubeRenderTarget)r.setRenderTarget(V.map,L),r.clear();else{L===0&&(r.setRenderTarget(V.map),r.clear());const _e=V.getViewport(L);f.set(c.x*_e.x,c.y*_e.y,c.x*_e.z,c.y*_e.w),$.viewport(f)}s=V.getFrustum(L),R(P,T,ne,F,this.type)}V.isPointLightShadow!==!0&&this.type===$o&&I(V,T),V.needsUpdate=!1}x=this.type,b.needsUpdate=!1,r.setRenderTarget(N,z,q)};function I(U,P){const T=e.update(w);v.defines.VSM_SAMPLES!==U.blurSamples&&(v.defines.VSM_SAMPLES=U.blurSamples,y.defines.VSM_SAMPLES=U.blurSamples,v.needsUpdate=!0,y.needsUpdate=!0),U.mapPass===null?U.mapPass=new Hi(l.x,l.y,{format:Ws,type:ta}):(U.mapPass.width!==U.map.width||U.mapPass.height!==U.map.height)&&U.mapPass.setSize(U.map.width,U.map.height),v.uniforms.shadow_pass.value=U.map.depthTexture,v.uniforms.resolution.value.set(U.map.width,U.map.height),v.uniforms.radius.value=U.radius,r.setRenderTarget(U.mapPass),r.clear(),r.renderBufferDirect(P,null,T,v,w,null),y.uniforms.shadow_pass.value=U.mapPass.texture,y.uniforms.resolution.value.set(U.map.width,U.map.height),y.uniforms.radius.value=U.radius,r.setRenderTarget(U.map),r.clear(),r.renderBufferDirect(P,null,T,y,w,null)}function G(U,P,T,N){let z=null;const q=T.isPointLight===!0?U.customDistanceMaterial:U.customDepthMaterial;if(q!==void 0)z=q;else if(z=T.isPointLight===!0?h:m,r.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const $=z.uuid,j=P.uuid;let X=d[$];X===void 0&&(X={},d[$]=X);let te=X[j];te===void 0&&(te=z.clone(),X[j]=te,P.addEventListener("dispose",D)),z=te}if(z.visible=P.visible,z.wireframe=P.wireframe,N===$o?z.side=P.shadowSide!==null?P.shadowSide:P.side:z.side=P.shadowSide!==null?P.shadowSide:_[P.side],z.alphaMap=P.alphaMap,z.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,z.map=P.map,z.clipShadows=P.clipShadows,z.clippingPlanes=P.clippingPlanes,z.clipIntersection=P.clipIntersection,z.displacementMap=P.displacementMap,z.displacementScale=P.displacementScale,z.displacementBias=P.displacementBias,z.wireframeLinewidth=P.wireframeLinewidth,z.linewidth=P.linewidth,T.isPointLight===!0&&z.isMeshDistanceMaterial===!0){const $=r.properties.get(z);$.light=T}return z}function R(U,P,T,N,z){if(U.visible===!1)return;if(U.layers.test(P.layers)&&(U.isMesh||U.isLine||U.isPoints)&&(U.castShadow||U.receiveShadow&&z===$o)&&(!U.frustumCulled||U.intersectsFrustum(s))){U.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,U.matrixWorld);const j=e.update(U),X=U.material;if(Array.isArray(X)){const te=j.groups;for(let F=0,V=te.length;F<V;F++){const ue=te[F],K=X[ue.materialIndex];if(K&&K.visible){const he=G(U,K,N,z);U.onBeforeShadow(r,U,P,T,j,he,ue),r.renderBufferDirect(T,null,j,he,U,ue),U.onAfterShadow(r,U,P,T,j,he,ue)}}}else if(X.visible){const te=G(U,X,N,z);U.onBeforeShadow(r,U,P,T,j,te,null),r.renderBufferDirect(T,null,j,te,U,null),U.onAfterShadow(r,U,P,T,j,te,null)}}const $=U.children;for(let j=0,X=$.length;j<X;j++)R($[j],P,T,N,z)}function D(U){U.target.removeEventListener("dispose",D);for(const T in d){const N=d[T],z=U.target.uuid;z in N&&(N[z].dispose(),delete N[z])}}}function RR(r,e){function i(){let Y=!1;const Ce=new nn;let Se=null;const we=new nn(0,0,0,0);return{setMask:function(Fe){Se!==Fe&&!Y&&(r.colorMask(Fe,Fe,Fe,Fe),Se=Fe)},setLocked:function(Fe){Y=Fe},setClear:function(Fe,be,Ke,We,Ht){Ht===!0&&(Fe*=We,be*=We,Ke*=We),Ce.set(Fe,be,Ke,We),we.equals(Ce)===!1&&(r.clearColor(Fe,be,Ke,We),we.copy(Ce))},reset:function(){Y=!1,Se=null,we.set(-1,0,0,0)}}}function s(){let Y=!1,Ce=!1,Se=null,we=null,Fe=null;return{setReversed:function(be){if(Ce!==be){const Ke=e.get("EXT_clip_control");be?Ke.clipControlEXT(Ke.LOWER_LEFT_EXT,Ke.ZERO_TO_ONE_EXT):Ke.clipControlEXT(Ke.LOWER_LEFT_EXT,Ke.NEGATIVE_ONE_TO_ONE_EXT),Ce=be;const We=Fe;Fe=null,this.setClear(We)}},getReversed:function(){return Ce},setTest:function(be){be?ve(r.DEPTH_TEST):Ae(r.DEPTH_TEST)},setMask:function(be){Se!==be&&!Y&&(r.depthMask(be),Se=be)},setFunc:function(be){if(Ce&&(be=QM[be]),we!==be){switch(be){case xh:r.depthFunc(r.NEVER);break;case Sh:r.depthFunc(r.ALWAYS);break;case yh:r.depthFunc(r.LESS);break;case nl:r.depthFunc(r.LEQUAL);break;case Mh:r.depthFunc(r.EQUAL);break;case bh:r.depthFunc(r.GEQUAL);break;case Eh:r.depthFunc(r.GREATER);break;case Th:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}we=be}},setLocked:function(be){Y=be},setClear:function(be){Fe!==be&&(Fe=be,Ce&&(be=1-be),r.clearDepth(be))},reset:function(){Y=!1,Se=null,we=null,Fe=null,Ce=!1}}}function l(){let Y=!1,Ce=null,Se=null,we=null,Fe=null,be=null,Ke=null,We=null,Ht=null;return{setTest:function(At){Y||(At?ve(r.STENCIL_TEST):Ae(r.STENCIL_TEST))},setMask:function(At){Ce!==At&&!Y&&(r.stencilMask(At),Ce=At)},setFunc:function(At,Yn,si){(Se!==At||we!==Yn||Fe!==si)&&(r.stencilFunc(At,Yn,si),Se=At,we=Yn,Fe=si)},setOp:function(At,Yn,si){(be!==At||Ke!==Yn||We!==si)&&(r.stencilOp(At,Yn,si),be=At,Ke=Yn,We=si)},setLocked:function(At){Y=At},setClear:function(At){Ht!==At&&(r.clearStencil(At),Ht=At)},reset:function(){Y=!1,Ce=null,Se=null,we=null,Fe=null,be=null,Ke=null,We=null,Ht=null}}}const c=new i,f=new s,m=new l,h=new WeakMap,d=new WeakMap;let g={},_={},v={},y=new WeakMap,M=[],w=null,b=!1,x=null,I=null,G=null,R=null,D=null,U=null,P=null,T=new _t(0,0,0),N=0,z=!1,q=null,$=null,j=null,X=null,te=null;const F=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,ue=0;const K=r.getParameter(r.VERSION);K.indexOf("WebGL")!==-1?(ue=parseFloat(/^WebGL (\d)/.exec(K)[1]),V=ue>=1):K.indexOf("OpenGL ES")!==-1&&(ue=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),V=ue>=2);let he=null,L={};const ne=r.getParameter(r.SCISSOR_BOX),_e=r.getParameter(r.VIEWPORT),Ee=new nn().fromArray(ne),Le=new nn().fromArray(_e);function Xe(Y,Ce,Se,we){const Fe=new Uint8Array(4),be=r.createTexture();r.bindTexture(Y,be),r.texParameteri(Y,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(Y,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Ke=0;Ke<Se;Ke++)Y===r.TEXTURE_3D||Y===r.TEXTURE_2D_ARRAY?r.texImage3D(Ce,0,r.RGBA,1,1,we,0,r.RGBA,r.UNSIGNED_BYTE,Fe):r.texImage2D(Ce+Ke,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Fe);return be}const re={};re[r.TEXTURE_2D]=Xe(r.TEXTURE_2D,r.TEXTURE_2D,1),re[r.TEXTURE_CUBE_MAP]=Xe(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),re[r.TEXTURE_2D_ARRAY]=Xe(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),re[r.TEXTURE_3D]=Xe(r.TEXTURE_3D,r.TEXTURE_3D,1,1),c.setClear(0,0,0,1),f.setClear(1),m.setClear(0),ve(r.DEPTH_TEST),f.setFunc(nl),gt(!1),Wt(R_),ve(r.CULL_FACE),yt(Da);function ve(Y){g[Y]!==!0&&(r.enable(Y),g[Y]=!0)}function Ae(Y){g[Y]!==!1&&(r.disable(Y),g[Y]=!1)}function tt(Y,Ce){return v[Y]!==Ce?(r.bindFramebuffer(Y,Ce),v[Y]=Ce,Y===r.DRAW_FRAMEBUFFER&&(v[r.FRAMEBUFFER]=Ce),Y===r.FRAMEBUFFER&&(v[r.DRAW_FRAMEBUFFER]=Ce),!0):!1}function He(Y,Ce){let Se=M,we=!1;if(Y){Se=y.get(Ce),Se===void 0&&(Se=[],y.set(Ce,Se));const Fe=Y.textures;if(Se.length!==Fe.length||Se[0]!==r.COLOR_ATTACHMENT0){for(let be=0,Ke=Fe.length;be<Ke;be++)Se[be]=r.COLOR_ATTACHMENT0+be;Se.length=Fe.length,we=!0}}else Se[0]!==r.BACK&&(Se[0]=r.BACK,we=!0);we&&r.drawBuffers(Se)}function ct(Y){return w!==Y?(r.useProgram(Y),w=Y,!0):!1}const an={[Hr]:r.FUNC_ADD,[vM]:r.FUNC_SUBTRACT,[xM]:r.FUNC_REVERSE_SUBTRACT};an[SM]=r.MIN,an[yM]=r.MAX;const st={[MM]:r.ZERO,[bM]:r.ONE,[EM]:r.SRC_COLOR,[zv]:r.SRC_ALPHA,[DM]:r.SRC_ALPHA_SATURATE,[CM]:r.DST_COLOR,[AM]:r.DST_ALPHA,[TM]:r.ONE_MINUS_SRC_COLOR,[Hv]:r.ONE_MINUS_SRC_ALPHA,[wM]:r.ONE_MINUS_DST_COLOR,[RM]:r.ONE_MINUS_DST_ALPHA,[NM]:r.CONSTANT_COLOR,[UM]:r.ONE_MINUS_CONSTANT_COLOR,[LM]:r.CONSTANT_ALPHA,[OM]:r.ONE_MINUS_CONSTANT_ALPHA};function yt(Y,Ce,Se,we,Fe,be,Ke,We,Ht,At){if(Y===Da){b===!0&&(Ae(r.BLEND),b=!1);return}if(b===!1&&(ve(r.BLEND),b=!0),Y!==_M){if(Y!==x||At!==z){if((I!==Hr||D!==Hr)&&(r.blendEquation(r.FUNC_ADD),I=Hr,D=Hr),At)switch(Y){case tl:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case C_:r.blendFunc(r.ONE,r.ONE);break;case w_:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case D_:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:Ct("WebGLState: Invalid blending: ",Y);break}else switch(Y){case tl:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case C_:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case w_:Ct("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case D_:Ct("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ct("WebGLState: Invalid blending: ",Y);break}G=null,R=null,U=null,P=null,T.set(0,0,0),N=0,x=Y,z=At}return}Fe=Fe||Ce,be=be||Se,Ke=Ke||we,(Ce!==I||Fe!==D)&&(r.blendEquationSeparate(an[Ce],an[Fe]),I=Ce,D=Fe),(Se!==G||we!==R||be!==U||Ke!==P)&&(r.blendFuncSeparate(st[Se],st[we],st[be],st[Ke]),G=Se,R=we,U=be,P=Ke),(We.equals(T)===!1||Ht!==N)&&(r.blendColor(We.r,We.g,We.b,Ht),T.copy(We),N=Ht),x=Y,z=!1}function Ot(Y,Ce){Y.side===Ki?Ae(r.CULL_FACE):ve(r.CULL_FACE);let Se=Y.side===ii;Ce&&(Se=!Se),gt(Se),Y.blending===tl&&Y.transparent===!1?yt(Da):yt(Y.blending,Y.blendEquation,Y.blendSrc,Y.blendDst,Y.blendEquationAlpha,Y.blendSrcAlpha,Y.blendDstAlpha,Y.blendColor,Y.blendAlpha,Y.premultipliedAlpha),f.setFunc(Y.depthFunc),f.setTest(Y.depthTest),f.setMask(Y.depthWrite),c.setMask(Y.colorWrite);const we=Y.stencilWrite;m.setTest(we),we&&(m.setMask(Y.stencilWriteMask),m.setFunc(Y.stencilFunc,Y.stencilRef,Y.stencilFuncMask),m.setOp(Y.stencilFail,Y.stencilZFail,Y.stencilZPass)),Tn(Y.polygonOffset,Y.polygonOffsetFactor,Y.polygonOffsetUnits),Y.alphaToCoverage===!0?ve(r.SAMPLE_ALPHA_TO_COVERAGE):Ae(r.SAMPLE_ALPHA_TO_COVERAGE)}function gt(Y){q!==Y&&(Y?r.frontFace(r.CW):r.frontFace(r.CCW),q=Y)}function Wt(Y){Y!==pM?(ve(r.CULL_FACE),Y!==$&&(Y===R_?r.cullFace(r.BACK):Y===mM?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Ae(r.CULL_FACE),$=Y}function sn(Y){Y!==j&&(V&&r.lineWidth(Y),j=Y)}function Tn(Y,Ce,Se){Y?(ve(r.POLYGON_OFFSET_FILL),(X!==Ce||te!==Se)&&(X=Ce,te=Se,f.getReversed()&&(Ce=-Ce),r.polygonOffset(Ce,Se))):Ae(r.POLYGON_OFFSET_FILL)}function Yt(Y){Y?ve(r.SCISSOR_TEST):Ae(r.SCISSOR_TEST)}function rn(Y){Y===void 0&&(Y=r.TEXTURE0+F-1),he!==Y&&(r.activeTexture(Y),he=Y)}function Z(Y,Ce,Se){Se===void 0&&(he===null?Se=r.TEXTURE0+F-1:Se=he);let we=L[Se];we===void 0&&(we={type:void 0,texture:void 0},L[Se]=we),(we.type!==Y||we.texture!==Ce)&&(he!==Se&&(r.activeTexture(Se),he=Se),r.bindTexture(Y,Ce||re[Y]),we.type=Y,we.texture=Ce)}function Pt(){const Y=L[he];Y!==void 0&&Y.type!==void 0&&(r.bindTexture(Y.type,null),Y.type=void 0,Y.texture=void 0)}function Nt(){try{r.compressedTexImage2D(...arguments)}catch(Y){Ct("WebGLState:",Y)}}function O(){try{r.compressedTexImage3D(...arguments)}catch(Y){Ct("WebGLState:",Y)}}function E(){try{r.texSubImage2D(...arguments)}catch(Y){Ct("WebGLState:",Y)}}function J(){try{r.texSubImage3D(...arguments)}catch(Y){Ct("WebGLState:",Y)}}function le(){try{r.compressedTexSubImage2D(...arguments)}catch(Y){Ct("WebGLState:",Y)}}function pe(){try{r.compressedTexSubImage3D(...arguments)}catch(Y){Ct("WebGLState:",Y)}}function Te(){try{r.texStorage2D(...arguments)}catch(Y){Ct("WebGLState:",Y)}}function De(){try{r.texStorage3D(...arguments)}catch(Y){Ct("WebGLState:",Y)}}function me(){try{r.texImage2D(...arguments)}catch(Y){Ct("WebGLState:",Y)}}function ge(){try{r.texImage3D(...arguments)}catch(Y){Ct("WebGLState:",Y)}}function Re(Y){return _[Y]!==void 0?_[Y]:r.getParameter(Y)}function Ge(Y,Ce){_[Y]!==Ce&&(r.pixelStorei(Y,Ce),_[Y]=Ce)}function Oe(Y){Ee.equals(Y)===!1&&(r.scissor(Y.x,Y.y,Y.z,Y.w),Ee.copy(Y))}function Ne(Y){Le.equals(Y)===!1&&(r.viewport(Y.x,Y.y,Y.z,Y.w),Le.copy(Y))}function Qe(Y,Ce){let Se=d.get(Ce);Se===void 0&&(Se=new WeakMap,d.set(Ce,Se));let we=Se.get(Y);we===void 0&&(we=r.getUniformBlockIndex(Ce,Y.name),Se.set(Y,we))}function Je(Y,Ce){const we=d.get(Ce).get(Y);h.get(Ce)!==we&&(r.uniformBlockBinding(Ce,we,Y.__bindingPointIndex),h.set(Ce,we))}function it(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),f.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),r.pixelStorei(r.PACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,r.BROWSER_DEFAULT_WEBGL),r.pixelStorei(r.PACK_ROW_LENGTH,0),r.pixelStorei(r.PACK_SKIP_PIXELS,0),r.pixelStorei(r.PACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_ROW_LENGTH,0),r.pixelStorei(r.UNPACK_IMAGE_HEIGHT,0),r.pixelStorei(r.UNPACK_SKIP_PIXELS,0),r.pixelStorei(r.UNPACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_SKIP_IMAGES,0),g={},_={},he=null,L={},v={},y=new WeakMap,M=[],w=null,b=!1,x=null,I=null,G=null,R=null,D=null,U=null,P=null,T=new _t(0,0,0),N=0,z=!1,q=null,$=null,j=null,X=null,te=null,Ee.set(0,0,r.canvas.width,r.canvas.height),Le.set(0,0,r.canvas.width,r.canvas.height),c.reset(),f.reset(),m.reset()}return{buffers:{color:c,depth:f,stencil:m},enable:ve,disable:Ae,bindFramebuffer:tt,drawBuffers:He,useProgram:ct,setBlending:yt,setMaterial:Ot,setFlipSided:gt,setCullFace:Wt,setLineWidth:sn,setPolygonOffset:Tn,setScissorTest:Yt,activeTexture:rn,bindTexture:Z,unbindTexture:Pt,compressedTexImage2D:Nt,compressedTexImage3D:O,texImage2D:me,texImage3D:ge,pixelStorei:Ge,getParameter:Re,updateUBOMapping:Qe,uniformBlockBinding:Je,texStorage2D:Te,texStorage3D:De,texSubImage2D:E,texSubImage3D:J,compressedTexSubImage2D:le,compressedTexSubImage3D:pe,scissor:Oe,viewport:Ne,reset:it}}function CR(r,e,i,s,l,c,f){const m=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),d=new at,g=new WeakMap,_=new Set;let v;const y=new WeakMap;let M=!1;try{M=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function w(O,E){return M?new OffscreenCanvas(O,E):du("canvas")}function b(O,E,J){let le=1;const pe=Nt(O);if((pe.width>J||pe.height>J)&&(le=J/Math.max(pe.width,pe.height)),le<1)if(typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&O instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&O instanceof ImageBitmap||typeof VideoFrame<"u"&&O instanceof VideoFrame){const Te=Math.floor(le*pe.width),De=Math.floor(le*pe.height);v===void 0&&(v=w(Te,De));const me=E?w(Te,De):v;return me.width=Te,me.height=De,me.getContext("2d").drawImage(O,0,0,Te,De),nt("WebGLRenderer: Texture has been resized from ("+pe.width+"x"+pe.height+") to ("+Te+"x"+De+")."),me}else return"data"in O&&nt("WebGLRenderer: Image in DataTexture is too big ("+pe.width+"x"+pe.height+")."),O;return O}function x(O){return O.generateMipmaps}function I(O){r.generateMipmap(O)}function G(O){return O.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:O.isWebGL3DRenderTarget?r.TEXTURE_3D:O.isWebGLArrayRenderTarget||O.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function R(O,E,J,le,pe,Te=!1){if(O!==null){if(r[O]!==void 0)return r[O];nt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+O+"'")}let De;le&&(De=e.get("EXT_texture_norm16"),De||nt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let me=E;if(E===r.RED&&(J===r.FLOAT&&(me=r.R32F),J===r.HALF_FLOAT&&(me=r.R16F),J===r.UNSIGNED_BYTE&&(me=r.R8),J===r.UNSIGNED_SHORT&&De&&(me=De.R16_EXT),J===r.SHORT&&De&&(me=De.R16_SNORM_EXT)),E===r.RED_INTEGER&&(J===r.UNSIGNED_BYTE&&(me=r.R8UI),J===r.UNSIGNED_SHORT&&(me=r.R16UI),J===r.UNSIGNED_INT&&(me=r.R32UI),J===r.BYTE&&(me=r.R8I),J===r.SHORT&&(me=r.R16I),J===r.INT&&(me=r.R32I)),E===r.RG&&(J===r.FLOAT&&(me=r.RG32F),J===r.HALF_FLOAT&&(me=r.RG16F),J===r.UNSIGNED_BYTE&&(me=r.RG8),J===r.UNSIGNED_SHORT&&De&&(me=De.RG16_EXT),J===r.SHORT&&De&&(me=De.RG16_SNORM_EXT)),E===r.RG_INTEGER&&(J===r.UNSIGNED_BYTE&&(me=r.RG8UI),J===r.UNSIGNED_SHORT&&(me=r.RG16UI),J===r.UNSIGNED_INT&&(me=r.RG32UI),J===r.BYTE&&(me=r.RG8I),J===r.SHORT&&(me=r.RG16I),J===r.INT&&(me=r.RG32I)),E===r.RGB_INTEGER&&(J===r.UNSIGNED_BYTE&&(me=r.RGB8UI),J===r.UNSIGNED_SHORT&&(me=r.RGB16UI),J===r.UNSIGNED_INT&&(me=r.RGB32UI),J===r.BYTE&&(me=r.RGB8I),J===r.SHORT&&(me=r.RGB16I),J===r.INT&&(me=r.RGB32I)),E===r.RGBA_INTEGER&&(J===r.UNSIGNED_BYTE&&(me=r.RGBA8UI),J===r.UNSIGNED_SHORT&&(me=r.RGBA16UI),J===r.UNSIGNED_INT&&(me=r.RGBA32UI),J===r.BYTE&&(me=r.RGBA8I),J===r.SHORT&&(me=r.RGBA16I),J===r.INT&&(me=r.RGBA32I)),E===r.RGB&&(J===r.UNSIGNED_SHORT&&De&&(me=De.RGB16_EXT),J===r.SHORT&&De&&(me=De.RGB16_SNORM_EXT),J===r.UNSIGNED_INT_5_9_9_9_REV&&(me=r.RGB9_E5),J===r.UNSIGNED_INT_10F_11F_11F_REV&&(me=r.R11F_G11F_B10F)),E===r.RGBA){const ge=Te?fu:Tt.getTransfer(pe);J===r.FLOAT&&(me=r.RGBA32F),J===r.HALF_FLOAT&&(me=r.RGBA16F),J===r.UNSIGNED_BYTE&&(me=ge===Bt?r.SRGB8_ALPHA8:r.RGBA8),J===r.UNSIGNED_SHORT&&De&&(me=De.RGBA16_EXT),J===r.SHORT&&De&&(me=De.RGBA16_SNORM_EXT),J===r.UNSIGNED_SHORT_4_4_4_4&&(me=r.RGBA4),J===r.UNSIGNED_SHORT_5_5_5_1&&(me=r.RGB5_A1)}return(me===r.R16F||me===r.R32F||me===r.RG16F||me===r.RG32F||me===r.RGBA16F||me===r.RGBA32F)&&e.get("EXT_color_buffer_float"),me}function D(O,E){let J;return O?E===null||E===ea||E===al?J=r.DEPTH24_STENCIL8:E===Qi?J=r.DEPTH32F_STENCIL8:E===il&&(J=r.DEPTH24_STENCIL8,nt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===ea||E===al?J=r.DEPTH_COMPONENT24:E===Qi?J=r.DEPTH_COMPONENT32F:E===il&&(J=r.DEPTH_COMPONENT16),J}function U(O,E){return x(O)===!0||O.isFramebufferTexture&&O.minFilter!==Ln&&O.minFilter!==Bn?Math.log2(Math.max(E.width,E.height))+1:O.mipmaps!==void 0&&O.mipmaps.length>0?O.mipmaps.length:O.isCompressedTexture&&Array.isArray(O.image)?E.mipmaps.length:1}function P(O){const E=O.target;E.removeEventListener("dispose",P),N(E),E.isVideoTexture&&g.delete(E),E.isHTMLTexture&&_.delete(E)}function T(O){const E=O.target;E.removeEventListener("dispose",T),q(E)}function N(O){const E=s.get(O);if(E.__webglInit===void 0)return;const J=O.source,le=y.get(J);if(le){const pe=le[E.__cacheKey];pe.usedTimes--,pe.usedTimes===0&&z(O),Object.keys(le).length===0&&y.delete(J)}s.remove(O)}function z(O){const E=s.get(O);r.deleteTexture(E.__webglTexture);const J=O.source,le=y.get(J);delete le[E.__cacheKey],f.memory.textures--}function q(O){const E=s.get(O);if(O.depthTexture&&(O.depthTexture.dispose(),s.remove(O.depthTexture)),O.isWebGLCubeRenderTarget)for(let le=0;le<6;le++){if(Array.isArray(E.__webglFramebuffer[le]))for(let pe=0;pe<E.__webglFramebuffer[le].length;pe++)r.deleteFramebuffer(E.__webglFramebuffer[le][pe]);else r.deleteFramebuffer(E.__webglFramebuffer[le]);E.__webglDepthbuffer&&r.deleteRenderbuffer(E.__webglDepthbuffer[le])}else{if(Array.isArray(E.__webglFramebuffer))for(let le=0;le<E.__webglFramebuffer.length;le++)r.deleteFramebuffer(E.__webglFramebuffer[le]);else r.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&r.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&r.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let le=0;le<E.__webglColorRenderbuffer.length;le++)E.__webglColorRenderbuffer[le]&&r.deleteRenderbuffer(E.__webglColorRenderbuffer[le]);E.__webglDepthRenderbuffer&&r.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const J=O.textures;for(let le=0,pe=J.length;le<pe;le++){const Te=s.get(J[le]);Te.__webglTexture&&(r.deleteTexture(Te.__webglTexture),f.memory.textures--),s.remove(J[le])}s.remove(O)}let $=0;function j(){$=0}function X(){return $}function te(O){$=O}function F(){const O=$;return O>=l.maxTextures&&nt("WebGLTextures: Trying to use "+(O+1)+" texture units while this GPU supports only "+l.maxTextures),$+=1,O}function V(O){const E=[];return E.push(O.wrapS),E.push(O.wrapT),E.push(O.wrapR||0),E.push(O.magFilter),E.push(O.minFilter),E.push(O.anisotropy),E.push(O.internalFormat),E.push(O.format),E.push(O.type),E.push(O.generateMipmaps),E.push(O.premultiplyAlpha),E.push(O.flipY),E.push(O.unpackAlignment),E.push(O.colorSpace),E.join()}function ue(O,E){const J=s.get(O);if(O.isVideoTexture&&Z(O),O.isRenderTargetTexture===!1&&O.isExternalTexture!==!0&&O.version>0&&J.__version!==O.version){const le=O.image;if(le===null)nt("WebGLRenderer: Texture marked for update but no image data found.");else if(le.complete===!1)nt("WebGLRenderer: Texture marked for update but image is incomplete");else{Ae(J,O,E);return}}else O.isExternalTexture&&(J.__webglTexture=O.sourceTexture?O.sourceTexture:null);i.bindTexture(r.TEXTURE_2D,J.__webglTexture,r.TEXTURE0+E)}function K(O,E){const J=s.get(O);if(O.isRenderTargetTexture===!1&&O.version>0&&J.__version!==O.version){Ae(J,O,E);return}else O.isExternalTexture&&(J.__webglTexture=O.sourceTexture?O.sourceTexture:null);i.bindTexture(r.TEXTURE_2D_ARRAY,J.__webglTexture,r.TEXTURE0+E)}function he(O,E){const J=s.get(O);if(O.isRenderTargetTexture===!1&&O.version>0&&J.__version!==O.version){Ae(J,O,E);return}i.bindTexture(r.TEXTURE_3D,J.__webglTexture,r.TEXTURE0+E)}function L(O,E){const J=s.get(O);if(O.isCubeDepthTexture!==!0&&O.version>0&&J.__version!==O.version){tt(J,O,E);return}i.bindTexture(r.TEXTURE_CUBE_MAP,J.__webglTexture,r.TEXTURE0+E)}const ne={[Ah]:r.REPEAT,[wa]:r.CLAMP_TO_EDGE,[Rh]:r.MIRRORED_REPEAT},_e={[Ln]:r.NEAREST,[FM]:r.NEAREST_MIPMAP_NEAREST,[bc]:r.NEAREST_MIPMAP_LINEAR,[Bn]:r.LINEAR,[Fd]:r.LINEAR_MIPMAP_NEAREST,[Gs]:r.LINEAR_MIPMAP_LINEAR},Ee={[GM]:r.NEVER,[YM]:r.ALWAYS,[VM]:r.LESS,[xp]:r.LEQUAL,[kM]:r.EQUAL,[Sp]:r.GEQUAL,[XM]:r.GREATER,[WM]:r.NOTEQUAL};function Le(O,E){if(E.type===Qi&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===Bn||E.magFilter===Fd||E.magFilter===bc||E.magFilter===Gs||E.minFilter===Bn||E.minFilter===Fd||E.minFilter===bc||E.minFilter===Gs)&&nt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(O,r.TEXTURE_WRAP_S,ne[E.wrapS]),r.texParameteri(O,r.TEXTURE_WRAP_T,ne[E.wrapT]),(O===r.TEXTURE_3D||O===r.TEXTURE_2D_ARRAY)&&r.texParameteri(O,r.TEXTURE_WRAP_R,ne[E.wrapR]),r.texParameteri(O,r.TEXTURE_MAG_FILTER,_e[E.magFilter]),r.texParameteri(O,r.TEXTURE_MIN_FILTER,_e[E.minFilter]),E.compareFunction&&(r.texParameteri(O,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(O,r.TEXTURE_COMPARE_FUNC,Ee[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Ln||E.minFilter!==bc&&E.minFilter!==Gs||E.type===Qi&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||s.get(E).__currentAnisotropy){const J=e.get("EXT_texture_filter_anisotropic");r.texParameterf(O,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,l.getMaxAnisotropy())),s.get(E).__currentAnisotropy=E.anisotropy}}}function Xe(O,E){let J=!1;O.__webglInit===void 0&&(O.__webglInit=!0,E.addEventListener("dispose",P));const le=E.source;let pe=y.get(le);pe===void 0&&(pe={},y.set(le,pe));const Te=V(E);if(Te!==O.__cacheKey){pe[Te]===void 0&&(pe[Te]={texture:r.createTexture(),usedTimes:0},f.memory.textures++,J=!0),pe[Te].usedTimes++;const De=pe[O.__cacheKey];De!==void 0&&(pe[O.__cacheKey].usedTimes--,De.usedTimes===0&&z(E)),O.__cacheKey=Te,O.__webglTexture=pe[Te].texture}return J}function re(O,E,J){return Math.floor(Math.floor(O/J)/E)}function ve(O,E,J,le){const Te=O.updateRanges;if(Te.length===0)i.texSubImage2D(r.TEXTURE_2D,0,0,0,E.width,E.height,J,le,E.data);else{Te.sort((Ge,Oe)=>Ge.start-Oe.start);let De=0;for(let Ge=1;Ge<Te.length;Ge++){const Oe=Te[De],Ne=Te[Ge],Qe=Oe.start+Oe.count,Je=re(Ne.start,E.width,4),it=re(Oe.start,E.width,4);Ne.start<=Qe+1&&Je===it&&re(Ne.start+Ne.count-1,E.width,4)===Je?Oe.count=Math.max(Oe.count,Ne.start+Ne.count-Oe.start):(++De,Te[De]=Ne)}Te.length=De+1;const me=i.getParameter(r.UNPACK_ROW_LENGTH),ge=i.getParameter(r.UNPACK_SKIP_PIXELS),Re=i.getParameter(r.UNPACK_SKIP_ROWS);i.pixelStorei(r.UNPACK_ROW_LENGTH,E.width);for(let Ge=0,Oe=Te.length;Ge<Oe;Ge++){const Ne=Te[Ge],Qe=Math.floor(Ne.start/4),Je=Math.ceil(Ne.count/4),it=Qe%E.width,Y=Math.floor(Qe/E.width),Ce=Je,Se=1;i.pixelStorei(r.UNPACK_SKIP_PIXELS,it),i.pixelStorei(r.UNPACK_SKIP_ROWS,Y),i.texSubImage2D(r.TEXTURE_2D,0,it,Y,Ce,Se,J,le,E.data)}O.clearUpdateRanges(),i.pixelStorei(r.UNPACK_ROW_LENGTH,me),i.pixelStorei(r.UNPACK_SKIP_PIXELS,ge),i.pixelStorei(r.UNPACK_SKIP_ROWS,Re)}}function Ae(O,E,J){let le=r.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(le=r.TEXTURE_2D_ARRAY),E.isData3DTexture&&(le=r.TEXTURE_3D);const pe=Xe(O,E),Te=E.source;i.bindTexture(le,O.__webglTexture,r.TEXTURE0+J);const De=s.get(Te);if(Te.version!==De.__version||pe===!0){if(i.activeTexture(r.TEXTURE0+J),(typeof ImageBitmap<"u"&&E.image instanceof ImageBitmap)===!1){const Se=Tt.getPrimaries(Tt.workingColorSpace),we=E.colorSpace===hs?null:Tt.getPrimaries(E.colorSpace),Fe=E.colorSpace===hs||Se===we?r.NONE:r.BROWSER_DEFAULT_WEBGL;i.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Fe)}i.pixelStorei(r.UNPACK_ALIGNMENT,E.unpackAlignment);let ge=b(E.image,!1,l.maxTextureSize);ge=Pt(E,ge);const Re=c.convert(E.format,E.colorSpace),Ge=c.convert(E.type);let Oe=R(E.internalFormat,Re,Ge,E.normalized,E.colorSpace,E.isVideoTexture);Le(le,E);let Ne;const Qe=E.mipmaps,Je=E.isVideoTexture!==!0,it=De.__version===void 0||pe===!0,Y=Te.dataReady,Ce=U(E,ge);if(E.isDepthTexture)Oe=D(E.format===Vs,E.type),it&&(Je?i.texStorage2D(r.TEXTURE_2D,1,Oe,ge.width,ge.height):i.texImage2D(r.TEXTURE_2D,0,Oe,ge.width,ge.height,0,Re,Ge,null));else if(E.isDataTexture)if(Qe.length>0){Je&&it&&i.texStorage2D(r.TEXTURE_2D,Ce,Oe,Qe[0].width,Qe[0].height);for(let Se=0,we=Qe.length;Se<we;Se++)Ne=Qe[Se],Je?Y&&i.texSubImage2D(r.TEXTURE_2D,Se,0,0,Ne.width,Ne.height,Re,Ge,Ne.data):i.texImage2D(r.TEXTURE_2D,Se,Oe,Ne.width,Ne.height,0,Re,Ge,Ne.data);E.generateMipmaps=!1}else Je?(it&&i.texStorage2D(r.TEXTURE_2D,Ce,Oe,ge.width,ge.height),Y&&ve(E,ge,Re,Ge)):i.texImage2D(r.TEXTURE_2D,0,Oe,ge.width,ge.height,0,Re,Ge,ge.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Je&&it&&i.texStorage3D(r.TEXTURE_2D_ARRAY,Ce,Oe,Qe[0].width,Qe[0].height,ge.depth);for(let Se=0,we=Qe.length;Se<we;Se++)if(Ne=Qe[Se],E.format!==Bi)if(Re!==null)if(Je){if(Y)if(E.layerUpdates.size>0){const Fe=lv(Ne.width,Ne.height,E.format,E.type);for(const be of E.layerUpdates){const Ke=Ne.data.subarray(be*Fe/Ne.data.BYTES_PER_ELEMENT,(be+1)*Fe/Ne.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Se,0,0,be,Ne.width,Ne.height,1,Re,Ke)}}else i.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Se,0,0,0,Ne.width,Ne.height,ge.depth,Re,Ne.data)}else i.compressedTexImage3D(r.TEXTURE_2D_ARRAY,Se,Oe,Ne.width,Ne.height,ge.depth,0,Ne.data,0,0);else nt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Je?Y&&i.texSubImage3D(r.TEXTURE_2D_ARRAY,Se,0,0,0,Ne.width,Ne.height,ge.depth,Re,Ge,Ne.data):i.texImage3D(r.TEXTURE_2D_ARRAY,Se,Oe,Ne.width,Ne.height,ge.depth,0,Re,Ge,Ne.data);E.layerUpdates.size>0&&E.clearLayerUpdates()}else{Je&&it&&i.texStorage2D(r.TEXTURE_2D,Ce,Oe,Qe[0].width,Qe[0].height);for(let Se=0,we=Qe.length;Se<we;Se++)Ne=Qe[Se],E.format!==Bi?Re!==null?Je?Y&&i.compressedTexSubImage2D(r.TEXTURE_2D,Se,0,0,Ne.width,Ne.height,Re,Ne.data):i.compressedTexImage2D(r.TEXTURE_2D,Se,Oe,Ne.width,Ne.height,0,Ne.data):nt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Je?Y&&i.texSubImage2D(r.TEXTURE_2D,Se,0,0,Ne.width,Ne.height,Re,Ge,Ne.data):i.texImage2D(r.TEXTURE_2D,Se,Oe,Ne.width,Ne.height,0,Re,Ge,Ne.data)}else if(E.isDataArrayTexture)if(Je){if(it&&i.texStorage3D(r.TEXTURE_2D_ARRAY,Ce,Oe,ge.width,ge.height,ge.depth),Y)if(E.layerUpdates.size>0){const Se=lv(ge.width,ge.height,E.format,E.type);for(const we of E.layerUpdates){const Fe=ge.data.subarray(we*Se/ge.data.BYTES_PER_ELEMENT,(we+1)*Se/ge.data.BYTES_PER_ELEMENT);i.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,we,ge.width,ge.height,1,Re,Ge,Fe)}E.clearLayerUpdates()}else i.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,ge.width,ge.height,ge.depth,Re,Ge,ge.data)}else i.texImage3D(r.TEXTURE_2D_ARRAY,0,Oe,ge.width,ge.height,ge.depth,0,Re,Ge,ge.data);else if(E.isData3DTexture)Je?(it&&i.texStorage3D(r.TEXTURE_3D,Ce,Oe,ge.width,ge.height,ge.depth),Y&&i.texSubImage3D(r.TEXTURE_3D,0,0,0,0,ge.width,ge.height,ge.depth,Re,Ge,ge.data)):i.texImage3D(r.TEXTURE_3D,0,Oe,ge.width,ge.height,ge.depth,0,Re,Ge,ge.data);else if(E.isFramebufferTexture){if(it)if(Je)i.texStorage2D(r.TEXTURE_2D,Ce,Oe,ge.width,ge.height);else{let Se=ge.width,we=ge.height;for(let Fe=0;Fe<Ce;Fe++)i.texImage2D(r.TEXTURE_2D,Fe,Oe,Se,we,0,Re,Ge,null),Se>>=1,we>>=1}}else if(E.isHTMLTexture){if("texElementImage2D"in r){const Se=r.canvas;if(Se.hasAttribute("layoutsubtree")||Se.setAttribute("layoutsubtree","true"),ge.parentNode!==Se){Se.appendChild(ge),_.add(E),Se.onpaint=we=>{const Fe=we.changedElements;for(const be of _)Fe.includes(be.image)&&(be.needsUpdate=!0)},Se.requestPaint();return}if(r.texElementImage2D.length===3)r.texElementImage2D(r.TEXTURE_2D,r.RGBA8,ge);else{const Fe=r.RGBA,be=r.RGBA,Ke=r.UNSIGNED_BYTE;r.texElementImage2D(r.TEXTURE_2D,0,Fe,be,Ke,ge)}r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)}}else if(Qe.length>0){if(Je&&it){const Se=Nt(Qe[0]);i.texStorage2D(r.TEXTURE_2D,Ce,Oe,Se.width,Se.height)}for(let Se=0,we=Qe.length;Se<we;Se++)Ne=Qe[Se],Je?Y&&i.texSubImage2D(r.TEXTURE_2D,Se,0,0,Re,Ge,Ne):i.texImage2D(r.TEXTURE_2D,Se,Oe,Re,Ge,Ne);E.generateMipmaps=!1}else if(Je){if(it){const Se=Nt(ge);i.texStorage2D(r.TEXTURE_2D,Ce,Oe,Se.width,Se.height)}Y&&i.texSubImage2D(r.TEXTURE_2D,0,0,0,Re,Ge,ge)}else i.texImage2D(r.TEXTURE_2D,0,Oe,Re,Ge,ge);x(E)&&I(le),De.__version=Te.version,E.onUpdate&&E.onUpdate(E)}O.__version=E.version}function tt(O,E,J){if(E.image.length!==6)return;const le=Xe(O,E),pe=E.source;i.bindTexture(r.TEXTURE_CUBE_MAP,O.__webglTexture,r.TEXTURE0+J);const Te=s.get(pe);if(pe.version!==Te.__version||le===!0){i.activeTexture(r.TEXTURE0+J);const De=Tt.getPrimaries(Tt.workingColorSpace),me=E.colorSpace===hs?null:Tt.getPrimaries(E.colorSpace),ge=E.colorSpace===hs||De===me?r.NONE:r.BROWSER_DEFAULT_WEBGL;i.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(r.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,ge);const Re=E.isCompressedTexture||E.image[0].isCompressedTexture,Ge=E.image[0]&&E.image[0].isDataTexture,Oe=[];for(let be=0;be<6;be++)!Re&&!Ge?Oe[be]=b(E.image[be],!0,l.maxCubemapSize):Oe[be]=Ge?E.image[be].image:E.image[be],Oe[be]=Pt(E,Oe[be]);const Ne=Oe[0],Qe=c.convert(E.format,E.colorSpace),Je=c.convert(E.type),it=R(E.internalFormat,Qe,Je,E.normalized,E.colorSpace),Y=E.isVideoTexture!==!0,Ce=Te.__version===void 0||le===!0,Se=pe.dataReady;let we=U(E,Ne);Le(r.TEXTURE_CUBE_MAP,E);let Fe;if(Re){Y&&Ce&&i.texStorage2D(r.TEXTURE_CUBE_MAP,we,it,Ne.width,Ne.height);for(let be=0;be<6;be++){Fe=Oe[be].mipmaps;for(let Ke=0;Ke<Fe.length;Ke++){const We=Fe[Ke];E.format!==Bi?Qe!==null?Y?Se&&i.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+be,Ke,0,0,We.width,We.height,Qe,We.data):i.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+be,Ke,it,We.width,We.height,0,We.data):nt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Y?Se&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+be,Ke,0,0,We.width,We.height,Qe,Je,We.data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+be,Ke,it,We.width,We.height,0,Qe,Je,We.data)}}}else{if(Fe=E.mipmaps,Y&&Ce){Fe.length>0&&we++;const be=Nt(Oe[0]);i.texStorage2D(r.TEXTURE_CUBE_MAP,we,it,be.width,be.height)}for(let be=0;be<6;be++)if(Ge){Y?Se&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+be,0,0,0,Oe[be].width,Oe[be].height,Qe,Je,Oe[be].data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+be,0,it,Oe[be].width,Oe[be].height,0,Qe,Je,Oe[be].data);for(let Ke=0;Ke<Fe.length;Ke++){const Ht=Fe[Ke].image[be].image;Y?Se&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+be,Ke+1,0,0,Ht.width,Ht.height,Qe,Je,Ht.data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+be,Ke+1,it,Ht.width,Ht.height,0,Qe,Je,Ht.data)}}else{Y?Se&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+be,0,0,0,Qe,Je,Oe[be]):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+be,0,it,Qe,Je,Oe[be]);for(let Ke=0;Ke<Fe.length;Ke++){const We=Fe[Ke];Y?Se&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+be,Ke+1,0,0,Qe,Je,We.image[be]):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+be,Ke+1,it,Qe,Je,We.image[be])}}}x(E)&&I(r.TEXTURE_CUBE_MAP),Te.__version=pe.version,E.onUpdate&&E.onUpdate(E)}O.__version=E.version}function He(O,E,J,le,pe,Te){const De=c.convert(J.format,J.colorSpace),me=c.convert(J.type),ge=R(J.internalFormat,De,me,J.normalized,J.colorSpace),Re=s.get(E),Ge=s.get(J);if(Ge.__renderTarget=E,!Re.__hasExternalTextures){const Oe=Math.max(1,E.width>>Te),Ne=Math.max(1,E.height>>Te);pe===r.TEXTURE_3D||pe===r.TEXTURE_2D_ARRAY?i.texImage3D(pe,Te,ge,Oe,Ne,E.depth,0,De,me,null):i.texImage2D(pe,Te,ge,Oe,Ne,0,De,me,null)}i.bindFramebuffer(r.FRAMEBUFFER,O),rn(E)?m.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,le,pe,Ge.__webglTexture,0,Yt(E)):(pe===r.TEXTURE_2D||pe>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&pe<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,le,pe,Ge.__webglTexture,Te),i.bindFramebuffer(r.FRAMEBUFFER,null)}function ct(O,E,J){if(r.bindRenderbuffer(r.RENDERBUFFER,O),E.depthBuffer){const le=E.depthTexture,pe=le&&le.isDepthTexture?le.type:null,Te=D(E.stencilBuffer,pe),De=E.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;rn(E)?m.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Yt(E),Te,E.width,E.height):J?r.renderbufferStorageMultisample(r.RENDERBUFFER,Yt(E),Te,E.width,E.height):r.renderbufferStorage(r.RENDERBUFFER,Te,E.width,E.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,De,r.RENDERBUFFER,O)}else{const le=E.textures;for(let pe=0;pe<le.length;pe++){const Te=le[pe],De=c.convert(Te.format,Te.colorSpace),me=c.convert(Te.type),ge=R(Te.internalFormat,De,me,Te.normalized,Te.colorSpace);rn(E)?m.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Yt(E),ge,E.width,E.height):J?r.renderbufferStorageMultisample(r.RENDERBUFFER,Yt(E),ge,E.width,E.height):r.renderbufferStorage(r.RENDERBUFFER,ge,E.width,E.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function an(O,E,J){const le=E.isWebGLCubeRenderTarget===!0;if(i.bindFramebuffer(r.FRAMEBUFFER,O),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const pe=s.get(E.depthTexture);if(pe.__renderTarget=E,(!pe.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),le){if(pe.__webglInit===void 0&&(pe.__webglInit=!0,E.depthTexture.addEventListener("dispose",P)),pe.__webglTexture===void 0){pe.__webglTexture=r.createTexture(),i.bindTexture(r.TEXTURE_CUBE_MAP,pe.__webglTexture),Le(r.TEXTURE_CUBE_MAP,E.depthTexture);const Re=c.convert(E.depthTexture.format),Ge=c.convert(E.depthTexture.type);let Oe;E.depthTexture.format===La?Oe=r.DEPTH_COMPONENT24:E.depthTexture.format===Vs&&(Oe=r.DEPTH24_STENCIL8);for(let Ne=0;Ne<6;Ne++)r.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Ne,0,Oe,E.width,E.height,0,Re,Ge,null)}}else ue(E.depthTexture,0);const Te=pe.__webglTexture,De=Yt(E),me=le?r.TEXTURE_CUBE_MAP_POSITIVE_X+J:r.TEXTURE_2D,ge=E.depthTexture.format===Vs?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(E.depthTexture.format===La)rn(E)?m.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,ge,me,Te,0,De):r.framebufferTexture2D(r.FRAMEBUFFER,ge,me,Te,0);else if(E.depthTexture.format===Vs)rn(E)?m.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,ge,me,Te,0,De):r.framebufferTexture2D(r.FRAMEBUFFER,ge,me,Te,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function st(O){const E=s.get(O),J=O.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==O.depthTexture){const le=O.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),le){const pe=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,le.removeEventListener("dispose",pe)};le.addEventListener("dispose",pe),E.__depthDisposeCallback=pe}E.__boundDepthTexture=le}if(O.depthTexture&&!E.__autoAllocateDepthBuffer)if(J)for(let le=0;le<6;le++)an(E.__webglFramebuffer[le],O,le);else{const le=O.texture.mipmaps;le&&le.length>0?an(E.__webglFramebuffer[0],O,0):an(E.__webglFramebuffer,O,0)}else if(J){E.__webglDepthbuffer=[];for(let le=0;le<6;le++)if(i.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer[le]),E.__webglDepthbuffer[le]===void 0)E.__webglDepthbuffer[le]=r.createRenderbuffer(),ct(E.__webglDepthbuffer[le],O,!1);else{const pe=O.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Te=E.__webglDepthbuffer[le];r.bindRenderbuffer(r.RENDERBUFFER,Te),r.framebufferRenderbuffer(r.FRAMEBUFFER,pe,r.RENDERBUFFER,Te)}}else{const le=O.texture.mipmaps;if(le&&le.length>0?i.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer[0]):i.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=r.createRenderbuffer(),ct(E.__webglDepthbuffer,O,!1);else{const pe=O.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Te=E.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,Te),r.framebufferRenderbuffer(r.FRAMEBUFFER,pe,r.RENDERBUFFER,Te)}}i.bindFramebuffer(r.FRAMEBUFFER,null)}function yt(O,E,J){const le=s.get(O);E!==void 0&&He(le.__webglFramebuffer,O,O.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),J!==void 0&&st(O)}function Ot(O){const E=O.texture,J=s.get(O),le=s.get(E);O.addEventListener("dispose",T);const pe=O.textures,Te=O.isWebGLCubeRenderTarget===!0,De=pe.length>1;if(De||(le.__webglTexture===void 0&&(le.__webglTexture=r.createTexture()),le.__version=E.version,f.memory.textures++),Te){J.__webglFramebuffer=[];for(let me=0;me<6;me++)if(E.mipmaps&&E.mipmaps.length>0){J.__webglFramebuffer[me]=[];for(let ge=0;ge<E.mipmaps.length;ge++)J.__webglFramebuffer[me][ge]=r.createFramebuffer()}else J.__webglFramebuffer[me]=r.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){J.__webglFramebuffer=[];for(let me=0;me<E.mipmaps.length;me++)J.__webglFramebuffer[me]=r.createFramebuffer()}else J.__webglFramebuffer=r.createFramebuffer();if(De)for(let me=0,ge=pe.length;me<ge;me++){const Re=s.get(pe[me]);Re.__webglTexture===void 0&&(Re.__webglTexture=r.createTexture(),f.memory.textures++)}if(O.samples>0&&rn(O)===!1){J.__webglMultisampledFramebuffer=r.createFramebuffer(),J.__webglColorRenderbuffer=[],i.bindFramebuffer(r.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let me=0;me<pe.length;me++){const ge=pe[me];J.__webglColorRenderbuffer[me]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,J.__webglColorRenderbuffer[me]);const Re=c.convert(ge.format,ge.colorSpace),Ge=c.convert(ge.type),Oe=R(ge.internalFormat,Re,Ge,ge.normalized,ge.colorSpace,O.isXRRenderTarget===!0),Ne=Yt(O);r.renderbufferStorageMultisample(r.RENDERBUFFER,Ne,Oe,O.width,O.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+me,r.RENDERBUFFER,J.__webglColorRenderbuffer[me])}r.bindRenderbuffer(r.RENDERBUFFER,null),O.depthBuffer&&(J.__webglDepthRenderbuffer=r.createRenderbuffer(),ct(J.__webglDepthRenderbuffer,O,!0)),i.bindFramebuffer(r.FRAMEBUFFER,null)}}if(Te){i.bindTexture(r.TEXTURE_CUBE_MAP,le.__webglTexture),Le(r.TEXTURE_CUBE_MAP,E);for(let me=0;me<6;me++)if(E.mipmaps&&E.mipmaps.length>0)for(let ge=0;ge<E.mipmaps.length;ge++)He(J.__webglFramebuffer[me][ge],O,E,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+me,ge);else He(J.__webglFramebuffer[me],O,E,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+me,0);x(E)&&I(r.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(De){for(let me=0,ge=pe.length;me<ge;me++){const Re=pe[me],Ge=s.get(Re);let Oe=r.TEXTURE_2D;(O.isWebGL3DRenderTarget||O.isWebGLArrayRenderTarget)&&(Oe=O.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),i.bindTexture(Oe,Ge.__webglTexture),Le(Oe,Re),He(J.__webglFramebuffer,O,Re,r.COLOR_ATTACHMENT0+me,Oe,0),x(Re)&&I(Oe)}i.unbindTexture()}else{let me=r.TEXTURE_2D;if((O.isWebGL3DRenderTarget||O.isWebGLArrayRenderTarget)&&(me=O.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),i.bindTexture(me,le.__webglTexture),Le(me,E),E.mipmaps&&E.mipmaps.length>0)for(let ge=0;ge<E.mipmaps.length;ge++)He(J.__webglFramebuffer[ge],O,E,r.COLOR_ATTACHMENT0,me,ge);else He(J.__webglFramebuffer,O,E,r.COLOR_ATTACHMENT0,me,0);x(E)&&I(me),i.unbindTexture()}O.depthBuffer&&st(O)}function gt(O){const E=O.textures;for(let J=0,le=E.length;J<le;J++){const pe=E[J];if(x(pe)){const Te=G(O),De=s.get(pe).__webglTexture;i.bindTexture(Te,De),I(Te),i.unbindTexture()}}}const Wt=[],sn=[];function Tn(O){if(O.samples>0){if(rn(O)===!1){const E=O.textures,J=O.width,le=O.height;let pe=r.COLOR_BUFFER_BIT;const Te=O.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,De=s.get(O),me=E.length>1;if(me)for(let Re=0;Re<E.length;Re++)i.bindFramebuffer(r.FRAMEBUFFER,De.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Re,r.RENDERBUFFER,null),i.bindFramebuffer(r.FRAMEBUFFER,De.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Re,r.TEXTURE_2D,null,0);i.bindFramebuffer(r.READ_FRAMEBUFFER,De.__webglMultisampledFramebuffer);const ge=O.texture.mipmaps;ge&&ge.length>0?i.bindFramebuffer(r.DRAW_FRAMEBUFFER,De.__webglFramebuffer[0]):i.bindFramebuffer(r.DRAW_FRAMEBUFFER,De.__webglFramebuffer);for(let Re=0;Re<E.length;Re++){if(O.resolveDepthBuffer&&(O.depthBuffer&&(pe|=r.DEPTH_BUFFER_BIT),O.stencilBuffer&&O.resolveStencilBuffer&&(pe|=r.STENCIL_BUFFER_BIT)),me){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,De.__webglColorRenderbuffer[Re]);const Ge=s.get(E[Re]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Ge,0)}r.blitFramebuffer(0,0,J,le,0,0,J,le,pe,r.NEAREST),h===!0&&(Wt.length=0,sn.length=0,Wt.push(r.COLOR_ATTACHMENT0+Re),O.depthBuffer&&O.storeMultisampledDepthBuffer===!1&&(Wt.push(Te),sn.push(Te),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,sn)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,Wt))}if(i.bindFramebuffer(r.READ_FRAMEBUFFER,null),i.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),me)for(let Re=0;Re<E.length;Re++){i.bindFramebuffer(r.FRAMEBUFFER,De.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Re,r.RENDERBUFFER,De.__webglColorRenderbuffer[Re]);const Ge=s.get(E[Re]).__webglTexture;i.bindFramebuffer(r.FRAMEBUFFER,De.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Re,r.TEXTURE_2D,Ge,0)}i.bindFramebuffer(r.DRAW_FRAMEBUFFER,De.__webglMultisampledFramebuffer)}else if(O.depthBuffer&&O.storeMultisampledDepthBuffer===!1&&h){const E=O.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[E])}}}function Yt(O){return Math.min(l.maxSamples,O.samples)}function rn(O){const E=s.get(O);return O.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function Z(O){const E=f.render.frame;g.get(O)!==E&&(g.set(O,E),O.update())}function Pt(O,E){const J=O.colorSpace,le=O.format,pe=O.type;return O.isCompressedTexture===!0||O.isVideoTexture===!0||J!==uu&&J!==hs&&(Tt.getTransfer(J)===Bt?(le!==Bi||pe!==gi)&&nt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ct("WebGLTextures: Unsupported texture color space:",J)),E}function Nt(O){return typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement?(d.width=O.naturalWidth||O.width,d.height=O.naturalHeight||O.height):typeof VideoFrame<"u"&&O instanceof VideoFrame?(d.width=O.displayWidth,d.height=O.displayHeight):(d.width=O.width,d.height=O.height),d}this.allocateTextureUnit=F,this.resetTextureUnits=j,this.getTextureUnits=X,this.setTextureUnits=te,this.setTexture2D=ue,this.setTexture2DArray=K,this.setTexture3D=he,this.setTextureCube=L,this.rebindTextures=yt,this.setupRenderTarget=Ot,this.updateRenderTargetMipmap=gt,this.updateMultisampleRenderTarget=Tn,this.setupDepthRenderbuffer=st,this.setupFrameBufferTexture=He,this.useMultisampledRTT=rn,this.isReversedDepthBuffer=function(){return i.buffers.depth.getReversed()}}function wR(r,e){function i(s,l=hs){let c;const f=Tt.getTransfer(l);if(s===gi)return r.UNSIGNED_BYTE;if(s===pp)return r.UNSIGNED_SHORT_4_4_4_4;if(s===mp)return r.UNSIGNED_SHORT_5_5_5_1;if(s===Jv)return r.UNSIGNED_INT_5_9_9_9_REV;if(s===$v)return r.UNSIGNED_INT_10F_11F_11F_REV;if(s===Kv)return r.BYTE;if(s===Qv)return r.SHORT;if(s===il)return r.UNSIGNED_SHORT;if(s===hp)return r.INT;if(s===ea)return r.UNSIGNED_INT;if(s===Qi)return r.FLOAT;if(s===ta)return r.HALF_FLOAT;if(s===ex)return r.ALPHA;if(s===tx)return r.RGB;if(s===Bi)return r.RGBA;if(s===La)return r.DEPTH_COMPONENT;if(s===Vs)return r.DEPTH_STENCIL;if(s===nx)return r.RED;if(s===gp)return r.RED_INTEGER;if(s===Ws)return r.RG;if(s===_p)return r.RG_INTEGER;if(s===vp)return r.RGBA_INTEGER;if(s===tu||s===nu||s===iu||s===au)if(f===Bt)if(c=e.get("WEBGL_compressed_texture_s3tc_srgb"),c!==null){if(s===tu)return c.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===nu)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===iu)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===au)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(c=e.get("WEBGL_compressed_texture_s3tc"),c!==null){if(s===tu)return c.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===nu)return c.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===iu)return c.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===au)return c.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===Ch||s===wh||s===Dh||s===Nh)if(c=e.get("WEBGL_compressed_texture_pvrtc"),c!==null){if(s===Ch)return c.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===wh)return c.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===Dh)return c.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===Nh)return c.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===Uh||s===Lh||s===Oh||s===Ph||s===Ih||s===lu||s===Fh)if(c=e.get("WEBGL_compressed_texture_etc"),c!==null){if(s===Uh||s===Lh)return f===Bt?c.COMPRESSED_SRGB8_ETC2:c.COMPRESSED_RGB8_ETC2;if(s===Oh)return f===Bt?c.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:c.COMPRESSED_RGBA8_ETC2_EAC;if(s===Ph)return c.COMPRESSED_R11_EAC;if(s===Ih)return c.COMPRESSED_SIGNED_R11_EAC;if(s===lu)return c.COMPRESSED_RG11_EAC;if(s===Fh)return c.COMPRESSED_SIGNED_RG11_EAC}else return null;if(s===Bh||s===zh||s===Hh||s===Gh||s===Vh||s===kh||s===Xh||s===Wh||s===Yh||s===qh||s===Zh||s===jh||s===Kh||s===Qh)if(c=e.get("WEBGL_compressed_texture_astc"),c!==null){if(s===Bh)return f===Bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:c.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===zh)return f===Bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:c.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===Hh)return f===Bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:c.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===Gh)return f===Bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:c.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===Vh)return f===Bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:c.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===kh)return f===Bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:c.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===Xh)return f===Bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:c.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===Wh)return f===Bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:c.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===Yh)return f===Bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:c.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===qh)return f===Bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:c.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===Zh)return f===Bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:c.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===jh)return f===Bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:c.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===Kh)return f===Bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:c.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===Qh)return f===Bt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:c.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===Jh||s===$h||s===ep)if(c=e.get("EXT_texture_compression_bptc"),c!==null){if(s===Jh)return f===Bt?c.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:c.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===$h)return c.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===ep)return c.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===tp||s===np||s===cu||s===ip)if(c=e.get("EXT_texture_compression_rgtc"),c!==null){if(s===tp)return c.COMPRESSED_RED_RGTC1_EXT;if(s===np)return c.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===cu)return c.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===ip)return c.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===al?r.UNSIGNED_INT_24_8:r[s]!==void 0?r[s]:null}return{convert:i}}const DR=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,NR=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class UR{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,i){if(this.texture===null){const s=new ux(e.texture);(e.depthNear!==i.depthNear||e.depthFar!==i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const i=e.cameras[0].viewport,s=new ia({vertexShader:DR,fragmentShader:NR,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new na(new Su(20,20),s)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class LR extends gs{constructor(e,i){super();const s=this;let l=null,c=1,f=null,m="local-floor",h=1,d=null,g=null,_=null,v=null,y=null,M=null;const w=typeof XRWebGLBinding<"u",b=new UR,x={},I=i.getContextAttributes();let G=null,R=null;const D=[],U=[],P=new at;let T=null,N=null;const z=new wi;z.viewport=new nn;const q=new wi;q.viewport=new nn;const $=[z,q],j=new Fb;let X=null,te=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(re){let ve=D[re];return ve===void 0&&(ve=new Wd,D[re]=ve),ve.getTargetRaySpace()},this.getControllerGrip=function(re){let ve=D[re];return ve===void 0&&(ve=new Wd,D[re]=ve),ve.getGripSpace()},this.getHand=function(re){let ve=D[re];return ve===void 0&&(ve=new Wd,D[re]=ve),ve.getHandSpace()};function F(re){const ve=U.indexOf(re.inputSource);if(ve===-1)return;const Ae=D[ve];Ae!==void 0&&(Ae.update(re.inputSource,re.frame,d||f),Ae.dispatchEvent({type:re.type,data:re.inputSource}))}function V(){l.removeEventListener("select",F),l.removeEventListener("selectstart",F),l.removeEventListener("selectend",F),l.removeEventListener("squeeze",F),l.removeEventListener("squeezestart",F),l.removeEventListener("squeezeend",F),l.removeEventListener("end",V),l.removeEventListener("inputsourceschange",ue);for(let re=0;re<D.length;re++){const ve=U[re];ve!==null&&(U[re]=null,D[re].disconnect(ve))}X=null,te=null,b.reset();for(const re in x)delete x[re];if(e.setRenderTarget(G),y=null,v=null,_=null,l=null,R=null,Xe.stop(),s.isPresenting=!1,e.setPixelRatio(T),e.setSize(P.width,P.height,!1),N!==null){const re=N.camera;re.fov=N.fov,re.zoom=N.zoom,re.updateProjectionMatrix(),N=null}s.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(re){c=re,s.isPresenting===!0&&nt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(re){m=re,s.isPresenting===!0&&nt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return d||f},this.setReferenceSpace=function(re){d=re},this.getBaseLayer=function(){return v!==null?v:y},this.getBinding=function(){return _===null&&w&&(_=new XRWebGLBinding(l,i)),_},this.getFrame=function(){return M},this.getSession=function(){return l},this.setSession=async function(re){if(l=re,l!==null){if(G=e.getRenderTarget(),l.addEventListener("select",F),l.addEventListener("selectstart",F),l.addEventListener("selectend",F),l.addEventListener("squeeze",F),l.addEventListener("squeezestart",F),l.addEventListener("squeezeend",F),l.addEventListener("end",V),l.addEventListener("inputsourceschange",ue),I.xrCompatible!==!0&&await i.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(P),w&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ae=null,tt=null,He=null;I.depth&&(He=I.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,Ae=I.stencil?Vs:La,tt=I.stencil?al:ea);const ct={colorFormat:i.RGBA8,depthFormat:He,scaleFactor:c};_=this.getBinding(),v=_.createProjectionLayer(ct),l.updateRenderState({layers:[v]}),e.setPixelRatio(1),e.setSize(v.textureWidth,v.textureHeight,!1),R=new Hi(v.textureWidth,v.textureHeight,{format:Bi,type:gi,depthTexture:new rl(v.textureWidth,v.textureHeight,tt,void 0,void 0,void 0,void 0,void 0,void 0,Ae),stencilBuffer:I.stencil,colorSpace:e.outputColorSpace,samples:I.antialias?4:0,resolveDepthBuffer:v.ignoreDepthValues===!1,resolveStencilBuffer:v.ignoreDepthValues===!1,storeMultisampledDepthBuffer:v.ignoreDepthValues===!1,storeMultisampledStencilBuffer:v.ignoreDepthValues===!1})}else{const Ae={antialias:I.antialias,alpha:!0,depth:I.depth,stencil:I.stencil,framebufferScaleFactor:c};y=new XRWebGLLayer(l,i,Ae),l.updateRenderState({baseLayer:y}),e.setPixelRatio(1),e.setSize(y.framebufferWidth,y.framebufferHeight,!1),R=new Hi(y.framebufferWidth,y.framebufferHeight,{format:Bi,type:gi,colorSpace:e.outputColorSpace,stencilBuffer:I.stencil,resolveDepthBuffer:y.ignoreDepthValues===!1,resolveStencilBuffer:y.ignoreDepthValues===!1,storeMultisampledDepthBuffer:y.ignoreDepthValues===!1,storeMultisampledStencilBuffer:y.ignoreDepthValues===!1})}R.isXRRenderTarget=!0,this.setFoveation(h),d=null,f=await l.requestReferenceSpace(m),Xe.setContext(l),Xe.start(),s.isPresenting=!0,s.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode},this.getDepthTexture=function(){return b.getDepthTexture()};function ue(re){for(let ve=0;ve<re.removed.length;ve++){const Ae=re.removed[ve],tt=U.indexOf(Ae);tt>=0&&(U[tt]=null,D[tt].disconnect(Ae))}for(let ve=0;ve<re.added.length;ve++){const Ae=re.added[ve];let tt=U.indexOf(Ae);if(tt===-1){for(let ct=0;ct<D.length;ct++)if(ct>=U.length){U.push(Ae),tt=ct;break}else if(U[ct]===null){U[ct]=Ae,tt=ct;break}if(tt===-1)break}const He=D[tt];He&&He.connect(Ae)}}const K=new ee,he=new ee;function L(re,ve,Ae){K.setFromMatrixPosition(ve.matrixWorld),he.setFromMatrixPosition(Ae.matrixWorld);const tt=K.distanceTo(he),He=ve.projectionMatrix.elements,ct=Ae.projectionMatrix.elements,an=He[14]/(He[10]-1),st=He[14]/(He[10]+1),yt=(He[9]+1)/He[5],Ot=(He[9]-1)/He[5],gt=(He[8]-1)/He[0],Wt=(ct[8]+1)/ct[0],sn=an*gt,Tn=an*Wt,Yt=tt/(-gt+Wt),rn=Yt*-gt;if(ve.matrixWorld.decompose(re.position,re.quaternion,re.scale),re.translateX(rn),re.translateZ(Yt),re.matrixWorld.compose(re.position,re.quaternion,re.scale),re.matrixWorldInverse.copy(re.matrixWorld).invert(),He[10]===-1)re.projectionMatrix.copy(ve.projectionMatrix),re.projectionMatrixInverse.copy(ve.projectionMatrixInverse);else{const Z=an+Yt,Pt=st+Yt,Nt=sn-rn,O=Tn+(tt-rn),E=yt*st/Pt*Z,J=Ot*st/Pt*Z;re.projectionMatrix.makePerspective(Nt,O,E,J,Z,Pt),re.projectionMatrixInverse.copy(re.projectionMatrix).invert()}}function ne(re,ve){ve===null?re.matrixWorld.copy(re.matrix):re.matrixWorld.multiplyMatrices(ve.matrixWorld,re.matrix),re.matrixWorldInverse.copy(re.matrixWorld).invert()}this.updateCamera=function(re){if(l===null)return;let ve=re.near,Ae=re.far;b.texture!==null&&(b.depthNear>0&&(ve=b.depthNear),b.depthFar>0&&(Ae=b.depthFar)),j.near=q.near=z.near=ve,j.far=q.far=z.far=Ae,(X!==j.near||te!==j.far)&&(l.updateRenderState({depthNear:j.near,depthFar:j.far}),X=j.near,te=j.far),j.layers.mask=re.layers.mask|6,z.layers.mask=j.layers.mask&-5,q.layers.mask=j.layers.mask&-3;const tt=re.parent,He=j.cameras;ne(j,tt);for(let ct=0;ct<He.length;ct++)ne(He[ct],tt);He.length===2?L(j,z,q):j.projectionMatrix.copy(z.projectionMatrix),N===null&&re.isPerspectiveCamera&&(N={camera:re,fov:re.fov,zoom:re.zoom}),_e(re,j,tt)};function _e(re,ve,Ae){Ae===null?re.matrix.copy(ve.matrixWorld):(re.matrix.copy(Ae.matrixWorld),re.matrix.invert(),re.matrix.multiply(ve.matrixWorld)),re.matrix.decompose(re.position,re.quaternion,re.scale),re.updateMatrixWorld(!0),re.projectionMatrix.copy(ve.projectionMatrix),re.projectionMatrixInverse.copy(ve.projectionMatrixInverse),re.isPerspectiveCamera&&(re.fov=sp*2*Math.atan(1/re.projectionMatrix.elements[5]),re.zoom=1)}this.getCamera=function(){return j},this.getFoveation=function(){if(!(v===null&&y===null))return h},this.setFoveation=function(re){h=re,v!==null&&(v.fixedFoveation=re),y!==null&&y.fixedFoveation!==void 0&&(y.fixedFoveation=re)},this.hasDepthSensing=function(){return b.texture!==null},this.getDepthSensingMesh=function(){return b.getMesh(j)},this.getCameraTexture=function(re){return x[re]};let Ee=null;function Le(re,ve){if(g=ve.getViewerPose(d||f),M=ve,g!==null){const Ae=g.views;y!==null&&(e.setRenderTargetFramebuffer(R,y.framebuffer),e.setRenderTarget(R));let tt=!1;Ae.length!==j.cameras.length&&(j.cameras.length=0,tt=!0);for(let st=0;st<Ae.length;st++){const yt=Ae[st];let Ot=null;if(y!==null)Ot=y.getViewport(yt);else{const Wt=_.getViewSubImage(v,yt);Ot=Wt.viewport,st===0&&(e.setRenderTargetTextures(R,Wt.colorTexture,Wt.depthStencilTexture),e.setRenderTarget(R))}let gt=$[st];gt===void 0&&(gt=new wi,gt.layers.enable(st),gt.viewport=new nn,$[st]=gt),gt.matrix.fromArray(yt.transform.matrix),gt.matrix.decompose(gt.position,gt.quaternion,gt.scale),gt.projectionMatrix.fromArray(yt.projectionMatrix),gt.projectionMatrixInverse.copy(gt.projectionMatrix).invert(),gt.viewport.set(Ot.x,Ot.y,Ot.width,Ot.height),st===0&&(j.matrix.copy(gt.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale)),tt===!0&&j.cameras.push(gt)}const He=l.enabledFeatures;if(He&&He.includes("depth-sensing")&&l.depthUsage=="gpu-optimized"&&w){_=s.getBinding();const st=_.getDepthInformation(Ae[0]);st&&st.isValid&&st.texture&&b.init(st,l.renderState)}if(He&&He.includes("camera-access")&&w){e.state.unbindTexture(),_=s.getBinding();for(let st=0;st<Ae.length;st++){const yt=Ae[st].camera;if(yt){let Ot=x[yt];Ot||(Ot=new ux,x[yt]=Ot);const gt=_.getCameraImage(yt);Ot.sourceTexture=gt}}}}for(let Ae=0;Ae<D.length;Ae++){const tt=U[Ae],He=D[Ae];tt!==null&&He!==void 0&&He.update(tt,ve,d||f)}Ee&&Ee(re,ve),ve.detectedPlanes&&s.dispatchEvent({type:"planesdetected",data:ve}),M=null}const Xe=new px;Xe.setAnimationLoop(Le),this.setAnimationLoop=function(re){Ee=re},this.dispose=function(){}}}const OR=new tn,yx=new ot;yx.set(-1,0,0,0,1,0,0,0,1);function PR(r,e){function i(b,x){b.matrixAutoUpdate===!0&&b.updateMatrix(),x.value.copy(b.matrix)}function s(b,x){x.color.getRGB(b.fogColor.value,fx(r)),x.isFog?(b.fogNear.value=x.near,b.fogFar.value=x.far):x.isFogExp2&&(b.fogDensity.value=x.density)}function l(b,x,I,G,R){x.isNodeMaterial?x.uniformsNeedUpdate=!1:x.isMeshBasicMaterial?c(b,x):x.isMeshLambertMaterial?(c(b,x),x.envMap&&(b.envMapIntensity.value=x.envMapIntensity)):x.isMeshToonMaterial?(c(b,x),_(b,x)):x.isMeshPhongMaterial?(c(b,x),g(b,x),x.envMap&&(b.envMapIntensity.value=x.envMapIntensity)):x.isMeshStandardMaterial?(c(b,x),v(b,x),x.isMeshPhysicalMaterial&&y(b,x,R)):x.isMeshMatcapMaterial?(c(b,x),M(b,x)):x.isMeshDepthMaterial?c(b,x):x.isMeshDistanceMaterial?(c(b,x),w(b,x)):x.isMeshNormalMaterial?c(b,x):x.isLineBasicMaterial?(f(b,x),x.isLineDashedMaterial&&m(b,x)):x.isPointsMaterial?h(b,x,I,G):x.isSpriteMaterial?d(b,x):x.isShadowMaterial?(b.color.value.copy(x.color),b.opacity.value=x.opacity):x.isShaderMaterial&&(x.uniformsNeedUpdate=!1)}function c(b,x){b.opacity.value=x.opacity,x.color&&b.diffuse.value.copy(x.color),x.emissive&&b.emissive.value.copy(x.emissive).multiplyScalar(x.emissiveIntensity),x.map&&(b.map.value=x.map,i(x.map,b.mapTransform)),x.alphaMap&&(b.alphaMap.value=x.alphaMap,i(x.alphaMap,b.alphaMapTransform)),x.bumpMap&&(b.bumpMap.value=x.bumpMap,i(x.bumpMap,b.bumpMapTransform),b.bumpScale.value=x.bumpScale,x.side===ii&&(b.bumpScale.value*=-1)),x.normalMap&&(b.normalMap.value=x.normalMap,i(x.normalMap,b.normalMapTransform),b.normalScale.value.copy(x.normalScale),x.side===ii&&b.normalScale.value.negate()),x.displacementMap&&(b.displacementMap.value=x.displacementMap,i(x.displacementMap,b.displacementMapTransform),b.displacementScale.value=x.displacementScale,b.displacementBias.value=x.displacementBias),x.emissiveMap&&(b.emissiveMap.value=x.emissiveMap,i(x.emissiveMap,b.emissiveMapTransform)),x.specularMap&&(b.specularMap.value=x.specularMap,i(x.specularMap,b.specularMapTransform)),x.alphaTest>0&&(b.alphaTest.value=x.alphaTest);const I=e.get(x),G=I.envMap,R=I.envMapRotation;G&&(b.envMap.value=G,b.envMapRotation.value.setFromMatrix4(OR.makeRotationFromEuler(R)).transpose(),G.isCubeTexture&&G.isRenderTargetTexture===!1&&b.envMapRotation.value.premultiply(yx),b.reflectivity.value=x.reflectivity,b.ior.value=x.ior,b.refractionRatio.value=x.refractionRatio),x.lightMap&&(b.lightMap.value=x.lightMap,b.lightMapIntensity.value=x.lightMapIntensity,i(x.lightMap,b.lightMapTransform)),x.aoMap&&(b.aoMap.value=x.aoMap,b.aoMapIntensity.value=x.aoMapIntensity,i(x.aoMap,b.aoMapTransform))}function f(b,x){b.diffuse.value.copy(x.color),b.opacity.value=x.opacity,x.map&&(b.map.value=x.map,i(x.map,b.mapTransform))}function m(b,x){b.dashSize.value=x.dashSize,b.totalSize.value=x.dashSize+x.gapSize,b.scale.value=x.scale}function h(b,x,I,G){b.diffuse.value.copy(x.color),b.opacity.value=x.opacity,b.size.value=x.size*I,b.scale.value=G*.5,x.map&&(b.map.value=x.map,i(x.map,b.uvTransform)),x.alphaMap&&(b.alphaMap.value=x.alphaMap,i(x.alphaMap,b.alphaMapTransform)),x.alphaTest>0&&(b.alphaTest.value=x.alphaTest)}function d(b,x){b.diffuse.value.copy(x.color),b.opacity.value=x.opacity,b.rotation.value=x.rotation,x.map&&(b.map.value=x.map,i(x.map,b.mapTransform)),x.alphaMap&&(b.alphaMap.value=x.alphaMap,i(x.alphaMap,b.alphaMapTransform)),x.alphaTest>0&&(b.alphaTest.value=x.alphaTest)}function g(b,x){b.specular.value.copy(x.specular),b.shininess.value=Math.max(x.shininess,1e-4)}function _(b,x){x.gradientMap&&(b.gradientMap.value=x.gradientMap)}function v(b,x){b.metalness.value=x.metalness,x.metalnessMap&&(b.metalnessMap.value=x.metalnessMap,i(x.metalnessMap,b.metalnessMapTransform)),b.roughness.value=x.roughness,x.roughnessMap&&(b.roughnessMap.value=x.roughnessMap,i(x.roughnessMap,b.roughnessMapTransform)),x.envMap&&(b.envMapIntensity.value=x.envMapIntensity)}function y(b,x,I){b.ior.value=x.ior,x.sheen>0&&(b.sheenColor.value.copy(x.sheenColor).multiplyScalar(x.sheen),b.sheenRoughness.value=x.sheenRoughness,x.sheenColorMap&&(b.sheenColorMap.value=x.sheenColorMap,i(x.sheenColorMap,b.sheenColorMapTransform)),x.sheenRoughnessMap&&(b.sheenRoughnessMap.value=x.sheenRoughnessMap,i(x.sheenRoughnessMap,b.sheenRoughnessMapTransform))),x.clearcoat>0&&(b.clearcoat.value=x.clearcoat,b.clearcoatRoughness.value=x.clearcoatRoughness,x.clearcoatMap&&(b.clearcoatMap.value=x.clearcoatMap,i(x.clearcoatMap,b.clearcoatMapTransform)),x.clearcoatRoughnessMap&&(b.clearcoatRoughnessMap.value=x.clearcoatRoughnessMap,i(x.clearcoatRoughnessMap,b.clearcoatRoughnessMapTransform)),x.clearcoatNormalMap&&(b.clearcoatNormalMap.value=x.clearcoatNormalMap,i(x.clearcoatNormalMap,b.clearcoatNormalMapTransform),b.clearcoatNormalScale.value.copy(x.clearcoatNormalScale),x.side===ii&&b.clearcoatNormalScale.value.negate())),x.dispersion>0&&(b.dispersion.value=x.dispersion),x.retroreflectivity>0&&(b.retroreflectivity.value=x.retroreflectivity),x.iridescence>0&&(b.iridescence.value=x.iridescence,b.iridescenceIOR.value=x.iridescenceIOR,b.iridescenceThicknessMinimum.value=x.iridescenceThicknessRange[0],b.iridescenceThicknessMaximum.value=x.iridescenceThicknessRange[1],x.iridescenceMap&&(b.iridescenceMap.value=x.iridescenceMap,i(x.iridescenceMap,b.iridescenceMapTransform)),x.iridescenceThicknessMap&&(b.iridescenceThicknessMap.value=x.iridescenceThicknessMap,i(x.iridescenceThicknessMap,b.iridescenceThicknessMapTransform))),x.transmission>0&&(b.transmission.value=x.transmission,b.transmissionSamplerMap.value=I.texture,b.transmissionSamplerSize.value.set(I.width,I.height),x.transmissionMap&&(b.transmissionMap.value=x.transmissionMap,i(x.transmissionMap,b.transmissionMapTransform)),b.thickness.value=x.thickness,x.thicknessMap&&(b.thicknessMap.value=x.thicknessMap,i(x.thicknessMap,b.thicknessMapTransform)),b.attenuationDistance.value=x.attenuationDistance,b.attenuationColor.value.copy(x.attenuationColor)),x.anisotropy>0&&(b.anisotropyVector.value.set(x.anisotropy*Math.cos(x.anisotropyRotation),x.anisotropy*Math.sin(x.anisotropyRotation)),x.anisotropyMap&&(b.anisotropyMap.value=x.anisotropyMap,i(x.anisotropyMap,b.anisotropyMapTransform))),b.specularIntensity.value=x.specularIntensity,b.specularColor.value.copy(x.specularColor),x.specularColorMap&&(b.specularColorMap.value=x.specularColorMap,i(x.specularColorMap,b.specularColorMapTransform)),x.specularIntensityMap&&(b.specularIntensityMap.value=x.specularIntensityMap,i(x.specularIntensityMap,b.specularIntensityMapTransform))}function M(b,x){x.matcap&&(b.matcap.value=x.matcap)}function w(b,x){const I=e.get(x).light;b.referencePosition.value.setFromMatrixPosition(I.matrixWorld),b.nearDistance.value=I.shadow.camera.near,b.farDistance.value=I.shadow.camera.far}return{refreshFogUniforms:s,refreshMaterialUniforms:l}}function IR(r,e,i,s){let l={},c={},f=[];const m=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function h(R,D){const U=D.program;s.uniformBlockBinding(R,U)}function d(R,D){let U=l[R.id];U===void 0&&(b(R),U=g(R),l[R.id]=U,R.addEventListener("dispose",I));const P=D.program;s.updateUBOMapping(R,P);const T=e.render.frame;c[R.id]!==T&&(v(R),c[R.id]=T)}function g(R){const D=_();R.__bindingPointIndex=D;const U=r.createBuffer(),P=R.__size,T=R.usage;return r.bindBuffer(r.UNIFORM_BUFFER,U),r.bufferData(r.UNIFORM_BUFFER,P,T),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,D,U),U}function _(){for(let R=0;R<m;R++)if(f.indexOf(R)===-1)return f.push(R),R;return Ct("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function v(R){const D=l[R.id],U=R.uniforms,P=R.__cache;r.bindBuffer(r.UNIFORM_BUFFER,D);for(let T=0,N=U.length;T<N;T++){const z=U[T];if(Array.isArray(z))for(let q=0,$=z.length;q<$;q++)y(z[q],T,q,P);else y(z,T,0,P)}r.bindBuffer(r.UNIFORM_BUFFER,null)}function y(R,D,U,P){if(w(R,D,U,P)===!0){const T=R.__offset,N=R.value;if(Array.isArray(N)){let z=0;for(let q=0;q<N.length;q++){const $=N[q],j=x($);M($,R.__data,z),typeof $!="number"&&typeof $!="boolean"&&!$.isMatrix3&&!ArrayBuffer.isView($)&&(z+=j.storage/Float32Array.BYTES_PER_ELEMENT)}}else M(N,R.__data,0);r.bufferSubData(r.UNIFORM_BUFFER,T,R.__data)}}function M(R,D,U){typeof R=="number"||typeof R=="boolean"?D[0]=R:R.isMatrix3?(D[0]=R.elements[0],D[1]=R.elements[1],D[2]=R.elements[2],D[3]=0,D[4]=R.elements[3],D[5]=R.elements[4],D[6]=R.elements[5],D[7]=0,D[8]=R.elements[6],D[9]=R.elements[7],D[10]=R.elements[8],D[11]=0):ArrayBuffer.isView(R)?D.set(new R.constructor(R.buffer,R.byteOffset,D.length)):R.toArray(D,U)}function w(R,D,U,P){const T=R.value,N=D+"_"+U;if(P[N]===void 0)return typeof T=="number"||typeof T=="boolean"?P[N]=T:ArrayBuffer.isView(T)?P[N]=T.slice():P[N]=T.clone(),!0;{const z=P[N];if(typeof T=="number"||typeof T=="boolean"){if(z!==T)return P[N]=T,!0}else{if(ArrayBuffer.isView(T))return!0;if(z.equals(T)===!1)return z.copy(T),!0}}return!1}function b(R){const D=R.uniforms;let U=0;const P=16;for(let N=0,z=D.length;N<z;N++){const q=Array.isArray(D[N])?D[N]:[D[N]];for(let $=0,j=q.length;$<j;$++){const X=q[$],te=Array.isArray(X.value)?X.value:[X.value];for(let F=0,V=te.length;F<V;F++){const ue=te[F],K=x(ue),he=U%P,L=he%K.boundary,ne=he+L;U+=L,ne!==0&&P-ne<K.storage&&(U+=P-ne),X.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),X.__offset=U,U+=K.storage}}}const T=U%P;return T>0&&(U+=P-T),R.__size=U,R.__cache={},this}function x(R){const D={boundary:0,storage:0};return typeof R=="number"||typeof R=="boolean"?(D.boundary=4,D.storage=4):R.isVector2?(D.boundary=8,D.storage=8):R.isVector3||R.isColor?(D.boundary=16,D.storage=12):R.isVector4?(D.boundary=16,D.storage=16):R.isMatrix3?(D.boundary=48,D.storage=48):R.isMatrix4?(D.boundary=64,D.storage=64):R.isTexture?nt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(R)?(D.boundary=16,D.storage=R.byteLength):nt("WebGLRenderer: Unsupported uniform value type.",R),D}function I(R){const D=R.target;D.removeEventListener("dispose",I);const U=f.indexOf(D.__bindingPointIndex);f.splice(U,1),r.deleteBuffer(l[D.id]),delete l[D.id],delete c[D.id]}function G(){for(const R in l)r.deleteBuffer(l[R]);f=[],l={},c={}}return{bind:h,update:d,dispose:G}}const FR=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Zi=null;function BR(){return Zi===null&&(Zi=new yb(FR,16,16,Ws,ta),Zi.name="DFG_LUT",Zi.minFilter=Bn,Zi.magFilter=Bn,Zi.wrapS=wa,Zi.wrapT=wa,Zi.generateMipmaps=!1,Zi.needsUpdate=!0),Zi}class zR{constructor(e={}){const{canvas:i=jM(),context:s=null,depth:l=!0,stencil:c=!1,alpha:f=!1,antialias:m=!1,premultipliedAlpha:h=!0,preserveDrawingBuffer:d=!1,powerPreference:g="default",failIfMajorPerformanceCaveat:_=!1,reversedDepthBuffer:v=!1,outputBufferType:y=gi}=e;this.isWebGLRenderer=!0;let M;if(s!==null){if(typeof WebGLRenderingContext<"u"&&s instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");M=s.getContextAttributes().alpha}else M=f;const w=y,b=new Set([vp,_p,gp]),x=new Set([gi,ea,il,al,pp,mp]),I=new Uint32Array(4),G=new Int32Array(4),R=new ee;let D=null,U=null;const P=[],T=[];let N=null;this.domElement=i,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=$i,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const z=this;let q=!1,$=null,j=null,X=null,te=null;this._outputColorSpace=Ci;let F=0,V=0,ue=null,K=-1,he=null;const L=new nn,ne=new nn;let _e=null;const Ee=new _t(0);let Le=0,Xe=i.width,re=i.height,ve=1,Ae=null,tt=null;const He=new nn(0,0,Xe,re),ct=new nn(0,0,Xe,re);let an=!1;const st=new bp;let yt=!1,Ot=!1;const gt=new tn,Wt=new ee,sn=new nn,Tn={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Yt=!1;function rn(){return ue===null?ve:1}let Z=s;function Pt(A,k){return i.getContext(A,k)}let Nt,O,E,J,le,pe,Te,De,me,ge,Re,Ge,Oe,Ne,Qe,Je,it,Y,Ce,Se,we,Fe,be;try{const A={alpha:!0,depth:l,stencil:c,antialias:m,premultipliedAlpha:h,preserveDrawingBuffer:d,powerPreference:g,failIfMajorPerformanceCaveat:_};if("setAttribute"in i&&i.setAttribute("data-engine",`three.js r${dp}`),i.addEventListener("webglcontextlost",Ht,!1),i.addEventListener("webglcontextrestored",At,!1),i.addEventListener("webglcontextcreationerror",Yn,!1),Z===null){const k="webgl2";if(Z=Pt(k,A),Z===null)throw Pt(k)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ke()}catch(A){throw i.removeEventListener("webglcontextlost",Ht,!1),i.removeEventListener("webglcontextrestored",At,!1),i.removeEventListener("webglcontextcreationerror",Yn,!1),Ct("WebGLRenderer: "+A.message),A}function Ke(){Nt=new B1(Z),Nt.init(),we=new wR(Z,Nt),O=new C1(Z,Nt,e,we),E=new RR(Z,Nt),O.reversedDepthBuffer&&v&&E.buffers.depth.setReversed(!0),j=Z.createFramebuffer(),X=Z.createFramebuffer(),te=Z.createFramebuffer(),J=new G1(Z),le=new hR,pe=new CR(Z,Nt,E,le,O,we,J),Te=new F1(z),De=new kb(Z),Fe=new A1(Z,De),me=new z1(Z,De,J,Fe),ge=new k1(Z,me,De,Fe,J),Y=new V1(Z,O,pe),Qe=new w1(le),Re=new dR(z,Te,Nt,O,Fe,Qe),Ge=new PR(z,le),Oe=new mR,Ne=new yR(Nt),it=new T1(z,Te,E,ge,M,h),Je=new AR(z,ge,O),be=new IR(Z,J,O,E),Ce=new R1(Z,Nt,J),Se=new H1(Z,Nt,J),J.programs=Re.programs,z.capabilities=O,z.extensions=Nt,z.properties=le,z.renderLists=Oe,z.shadowMap=Je,z.state=E,z.info=J}w!==gi&&(N=new W1(w,i.width,i.height,m,l,c));const We=new LR(z,Z);this.xr=We,this.getContext=function(){return Z},this.getContextAttributes=function(){return Z.getContextAttributes()},this.forceContextLoss=function(){const A=Nt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Nt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return ve},this.setPixelRatio=function(A){A!==void 0&&(ve=A,this.setSize(Xe,re,!1))},this.getSize=function(A){return A.set(Xe,re)},this.setSize=function(A,k,fe=!0){if(We.isPresenting){nt("WebGLRenderer: Can't change size while VR device is presenting.");return}Xe=A,re=k,i.width=Math.floor(A*ve),i.height=Math.floor(k*ve),fe===!0&&(i.style.width=A+"px",i.style.height=k+"px"),N!==null&&N.setSize(i.width,i.height),this.setViewport(0,0,A,k)},this.getDrawingBufferSize=function(A){return A.set(Xe*ve,re*ve).floor()},this.setDrawingBufferSize=function(A,k,fe){Xe=A,re=k,ve=fe,i.width=Math.floor(A*fe),i.height=Math.floor(k*fe),this.setViewport(0,0,A,k)},this.setEffects=function(A){if(w===gi){Ct("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let k=0;k<A.length;k++)if(A[k].isOutputPass===!0){nt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}N.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy(L)},this.getViewport=function(A){return A.copy(He)},this.setViewport=function(A,k,fe,ie){A.isVector4?He.set(A.x,A.y,A.z,A.w):He.set(A,k,fe,ie),E.viewport(L.copy(He).multiplyScalar(ve).round())},this.getScissor=function(A){return A.copy(ct)},this.setScissor=function(A,k,fe,ie){A.isVector4?ct.set(A.x,A.y,A.z,A.w):ct.set(A,k,fe,ie),E.scissor(ne.copy(ct).multiplyScalar(ve).round())},this.getScissorTest=function(){return an},this.setScissorTest=function(A){E.setScissorTest(an=A)},this.setOpaqueSort=function(A){Ae=A},this.setTransparentSort=function(A){tt=A},this.getClearColor=function(A){return A.copy(it.getClearColor())},this.setClearColor=function(){it.setClearColor(...arguments)},this.getClearAlpha=function(){return it.getClearAlpha()},this.setClearAlpha=function(){it.setClearAlpha(...arguments)},this.clear=function(A=!0,k=!0,fe=!0){let ie=0;if(A){let ae=!1;if(ue!==null){const Pe=ue.texture.format;ae=b.has(Pe)}if(ae){const Pe=ue.texture.type,Ve=x.has(Pe),Ue=it.getClearColor(),Be=it.getClearAlpha(),ze=Ue.r,lt=Ue.g,mt=Ue.b;Ve?(I[0]=ze,I[1]=lt,I[2]=mt,I[3]=Be,Z.clearBufferuiv(Z.COLOR,0,I)):(G[0]=ze,G[1]=lt,G[2]=mt,G[3]=Be,Z.clearBufferiv(Z.COLOR,0,G))}else ie|=Z.COLOR_BUFFER_BIT}k&&(ie|=Z.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),fe&&(ie|=Z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),ie!==0&&Z.clear(ie)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(A){A.setRenderer(this),$=A},this.dispose=function(){i.removeEventListener("webglcontextlost",Ht,!1),i.removeEventListener("webglcontextrestored",At,!1),i.removeEventListener("webglcontextcreationerror",Yn,!1),it.dispose(),Oe.dispose(),Ne.dispose(),le.dispose(),Te.dispose(),ge.dispose(),Fe.dispose(),be.dispose(),Re.dispose(),We.dispose(),We.removeEventListener("sessionstart",fn),We.removeEventListener("sessionend",Cn),qn.stop()};function Ht(A){A.preventDefault(),L_("WebGLRenderer: Context Lost."),q=!0}function At(){L_("WebGLRenderer: Context Restored."),q=!1;const A=J.autoReset,k=Je.enabled,fe=Je.autoUpdate,ie=Je.needsUpdate,ae=Je.type;Ke(),J.autoReset=A,Je.enabled=k,Je.autoUpdate=fe,Je.needsUpdate=ie,Je.type=ae}function Yn(A){Ct("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function si(A){const k=A.target;k.removeEventListener("dispose",si),Qr(k)}function Qr(A){Jr(A),le.remove(A)}function Jr(A){const k=le.get(A).programs;k!==void 0&&(k.forEach(function(fe){Re.releaseProgram(fe)}),A.isShaderMaterial&&Re.releaseShaderCache(A))}this.renderBufferDirect=function(A,k,fe,ie,ae,Pe){k===null&&(k=Tn);const Ve=ae.isMesh&&ae.matrixWorld.determinantAffine()<0,Ue=Ia(A,k,fe,ie,ae);E.setMaterial(ie,Ve);let Be=fe.index,ze=1;if(ie.wireframe===!0){if(Be=me.getWireframeAttribute(fe),Be===void 0)return;ze=2}const lt=fe.drawRange,mt=fe.attributes.position;let Ye=lt.start*ze,Rt=(lt.start+lt.count)*ze;Pe!==null&&(Ye=Math.max(Ye,Pe.start*ze),Rt=Math.min(Rt,(Pe.start+Pe.count)*ze)),Be!==null?(Ye=Math.max(Ye,0),Rt=Math.min(Rt,Be.count)):mt!=null&&(Ye=Math.max(Ye,0),Rt=Math.min(Rt,mt.count));const Kt=Rt-Ye;if(Kt<0||Kt===1/0)return;Fe.setup(ae,ie,Ue,fe,Be);let qt,dt=Ce;if(Be!==null&&(qt=De.get(Be),dt=Se,dt.setIndex(qt)),ae.isMesh)ie.wireframe===!0?(E.setLineWidth(ie.wireframeLinewidth*rn()),dt.setMode(Z.LINES)):dt.setMode(Z.TRIANGLES);else if(ae.isLine){let hn=ie.linewidth;hn===void 0&&(hn=1),E.setLineWidth(hn*rn()),ae.isLineSegments?dt.setMode(Z.LINES):ae.isLineLoop?dt.setMode(Z.LINE_LOOP):dt.setMode(Z.LINE_STRIP)}else ae.isPoints?dt.setMode(Z.POINTS):ae.isSprite&&dt.setMode(Z.TRIANGLES);if(ae.isBatchedMesh)if(Nt.get("WEBGL_multi_draw"))dt.renderMultiDraw(ae._multiDrawStarts,ae._multiDrawCounts,ae._multiDrawCount);else{const hn=ae._multiDrawStarts,ke=ae._multiDrawCounts,xn=ae._multiDrawCount,ht=Be?De.get(Be).bytesPerElement:1,zn=le.get(ie).currentProgram.getUniforms();for(let ri=0;ri<xn;ri++)zn.setValue(Z,"_gl_DrawID",ri),dt.render(hn[ri]/ht,ke[ri])}else if(ae.isInstancedMesh)dt.renderInstances(Ye,Kt,ae.count);else if(fe.isInstancedBufferGeometry){const hn=fe._maxInstanceCount!==void 0?fe._maxInstanceCount:1/0,ke=Math.min(fe.instanceCount,hn);dt.renderInstances(Ye,Kt,ke)}else dt.render(Ye,Kt)};function $r(A,k,fe,ie){$!==null&&A.isNodeMaterial&&$.setObject(ie,A),yt===!0&&Qe.setState(A,fe,!1),A.transparent===!0&&A.side===Ki&&A.forceSinglePass===!1?(A.side=ii,A.needsUpdate=!0,Pa(A,k,ie),A.side=ks,A.needsUpdate=!0,Pa(A,k,ie),A.side=Ki):Pa(A,k,ie)}this.compile=function(A,k,fe=null){fe===null&&(fe=A),$!==null&&$.renderStart(A,k,fe),U=Ne.get(fe),U.init(k),T.push(U),fe.traverseVisible(function(ae){ae.isLight&&ae.layers.test(k.layers)&&(U.pushLight(ae),ae.castShadow&&U.pushShadow(ae))}),A!==fe&&A.traverseVisible(function(ae){ae.isLight&&ae.layers.test(k.layers)&&(U.pushLight(ae),ae.castShadow&&U.pushShadow(ae))}),U.setupLights(),$!==null&&$.updateLights(U.state.lightsArray),Ot=this.localClippingEnabled,yt=Qe.init(this.clippingPlanes,Ot),yt===!0&&Qe.setGlobalState(this.clippingPlanes,k),$!==null&&Je.render(U.state.shadowsArray,fe,k);const ie=new Set;return A.traverse(function(ae){if(!(ae.isMesh||ae.isPoints||ae.isLine||ae.isSprite))return;const Pe=ae.material;if(Pe)if(Array.isArray(Pe))for(let Ve=0;Ve<Pe.length;Ve++){const Ue=Pe[Ve];$r(Ue,fe,k,ae),ie.add(Ue)}else $r(Pe,fe,k,ae),ie.add(Pe)}),U=T.pop(),$!==null&&$.renderEnd(),ie},this.compileAsync=function(A,k,fe=null){const ie=this.compile(A,k,fe);return new Promise(ae=>{function Pe(){if(ie.forEach(function(Ve){const Be=le.get(Ve).currentProgram;(Be===void 0||Be.isReady())&&ie.delete(Ve)}),ie.size===0){ae(A);return}setTimeout(Pe,10)}Nt.get("KHR_parallel_shader_compile")!==null?Pe():setTimeout(Pe,10)})};let Ys=null;function Gi(A){Ys&&Ys(A)}function fn(){qn.stop()}function Cn(){qn.start()}const qn=new px;qn.setAnimationLoop(Gi),typeof self<"u"&&qn.setContext(self),this.setAnimationLoop=function(A){Ys=A,We.setAnimationLoop(A),A===null?qn.stop():qn.start()},We.addEventListener("sessionstart",fn),We.addEventListener("sessionend",Cn),this.render=function(A,k){if(k!==void 0&&k.isCamera!==!0){Ct("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(q===!0)return;$!==null&&$.renderStart(A,k);const fe=We.enabled===!0&&We.isPresenting===!0,ie=N!==null&&(ue===null||fe)&&N.begin(z,ue);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),We.enabled===!0&&We.isPresenting===!0&&(N===null||N.isCompositing()===!1)&&(We.cameraAutoUpdate===!0&&We.updateCamera(k),k=We.getCamera()),A.isScene===!0&&A.onBeforeRender(z,A,k,ue),U=Ne.get(A,T.length),U.init(k),U.state.textureUnits=pe.getTextureUnits(),T.push(U),gt.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),st.setFromProjectionMatrix(gt,Ji,k.reversedDepth),Ot=this.localClippingEnabled,yt=Qe.init(this.clippingPlanes,Ot),D=Oe.get(A,P.length),D.init(),P.push(D),We.enabled===!0&&We.isPresenting===!0){const Ve=z.xr.getDepthSensingMesh();Ve!==null&&_s(Ve,k,-1/0,z.sortObjects)}_s(A,k,0,z.sortObjects),D.finish(),$!==null&&$.updateLights(U.state.lightsArray),z.sortObjects===!0&&D.sort(Ae,tt),Yt=We.enabled===!1||We.isPresenting===!1||We.hasDepthSensing()===!1,Yt&&it.addToRenderList(D,A),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),yt===!0&&Qe.beginShadows();const ae=U.state.shadowsArray;if(Je.render(ae,A,k),yt===!0&&Qe.endShadows(),(ie&&N.hasRenderPass())===!1){const Ve=D.opaque,Ue=D.transmissive;if(U.setupLights(),k.isArrayCamera){const Be=k.cameras;if(Ue.length>0)for(let ze=0,lt=Be.length;ze<lt;ze++){const mt=Be[ze];fl(Ve,Ue,A,mt)}Yt&&it.render(A);for(let ze=0,lt=Be.length;ze<lt;ze++){const mt=Be[ze];ul(D,A,mt,mt.viewport)}}else Ue.length>0&&fl(Ve,Ue,A,k),Yt&&it.render(A),ul(D,A,k)}ue!==null&&V===0&&(pe.updateMultisampleRenderTarget(ue),pe.updateRenderTargetMipmap(ue)),ie&&N.end(z),A.isScene===!0&&A.onAfterRender(z,A,k),Fe.resetDefaultState(),K=-1,he=null,T.pop(),T.length>0?(U=T[T.length-1],pe.setTextureUnits(U.state.textureUnits),yt===!0&&Qe.setGlobalState(z.clippingPlanes,U.state.camera)):U=null,P.pop(),P.length>0?D=P[P.length-1]:D=null,$!==null&&$.renderEnd()};function _s(A,k,fe,ie){if(A.visible===!1)return;if(A.layers.test(k.layers)){if(A.isGroup)fe=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(k);else if(A.isLightProbeGrid)U.pushLightProbeGrid(A);else if(A.isLight)U.pushLight(A),A.castShadow&&U.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||A.intersectsFrustum(st)){ie&&sn.setFromMatrixPosition(A.matrixWorld).applyMatrix4(gt);const Ve=ge.update(A),Ue=A.material;Ue.visible&&D.push(A,Ve,Ue,fe,sn.z,null,k)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||A.intersectsFrustum(st))){const Ve=ge.update(A),Ue=A.material;if(ie&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),sn.copy(A.boundingSphere.center)):(Ve.boundingSphere===null&&Ve.computeBoundingSphere(),sn.copy(Ve.boundingSphere.center)),sn.applyMatrix4(A.matrixWorld).applyMatrix4(gt)),Array.isArray(Ue)){const Be=Ve.groups;for(let ze=0,lt=Be.length;ze<lt;ze++){const mt=Be[ze],Ye=Ue[mt.materialIndex];Ye&&Ye.visible&&D.push(A,Ve,Ye,fe,sn.z,mt,k)}}else Ue.visible&&D.push(A,Ve,Ue,fe,sn.z,null,k)}}const Pe=A.children;for(let Ve=0,Ue=Pe.length;Ve<Ue;Ve++)_s(Pe[Ve],k,fe,ie)}function ul(A,k,fe,ie){const{opaque:ae,transmissive:Pe,transparent:Ve}=A;U.setupLightsView(fe),yt===!0&&Qe.setGlobalState(z.clippingPlanes,fe),ie&&E.viewport(L.copy(ie)),ae.length>0&&vs(ae,k,fe),Pe.length>0&&vs(Pe,k,fe),Ve.length>0&&vs(Ve,k,fe),E.buffers.depth.setTest(!0),E.buffers.depth.setMask(!0),E.buffers.color.setMask(!0),E.setPolygonOffset(!1)}function fl(A,k,fe,ie){if((fe.isScene===!0?fe.overrideMaterial:null)!==null)return;if(U.state.transmissionRenderTarget[ie.id]===void 0){const Ye=Nt.has("EXT_color_buffer_half_float")||Nt.has("EXT_color_buffer_float");U.state.transmissionRenderTarget[ie.id]=new Hi(1,1,{generateMipmaps:!0,type:Ye?ta:gi,minFilter:Gs,samples:Math.max(4,O.samples),stencilBuffer:c,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Tt.workingColorSpace})}const Pe=U.state.transmissionRenderTarget[ie.id],Ve=ie.viewport||L;Pe.setSize(Ve.z*z.transmissionResolutionScale,Ve.w*z.transmissionResolutionScale);const Ue=z.getRenderTarget(),Be=z.getActiveCubeFace(),ze=z.getActiveMipmapLevel();z.setRenderTarget(Pe),z.getClearColor(Ee),Le=z.getClearAlpha(),Le<1&&z.setClearColor(16777215,.5),z.clear(),Yt&&it.render(fe);const lt=z.toneMapping;z.toneMapping=$i;const mt=ie.viewport;if(ie.viewport!==void 0&&(ie.viewport=void 0),U.setupLightsView(ie),yt===!0&&Qe.setGlobalState(z.clippingPlanes,ie),vs(A,fe,ie),pe.updateMultisampleRenderTarget(Pe),pe.updateRenderTargetMipmap(Pe),Nt.has("WEBGL_multisampled_render_to_texture")===!1){let Ye=!1;for(let Rt=0,Kt=k.length;Rt<Kt;Rt++){const qt=k[Rt],{object:dt,geometry:hn,material:ke,group:xn}=qt;if(ke.side===Ki&&dt.layers.test(ie.layers)){const ht=ke.side;ke.side=ii,ke.needsUpdate=!0,Oa(dt,fe,ie,hn,ke,xn),ke.side=ht,ke.needsUpdate=!0,Ye=!0}}Ye===!0&&(pe.updateMultisampleRenderTarget(Pe),pe.updateRenderTargetMipmap(Pe))}z.setRenderTarget(Ue,Be,ze),z.setClearColor(Ee,Le),mt!==void 0&&(ie.viewport=mt),z.toneMapping=lt}function vs(A,k,fe){const ie=k.isScene===!0?k.overrideMaterial:null;for(let ae=0,Pe=A.length;ae<Pe;ae++){const Ve=A[ae],{object:Ue,geometry:Be,group:ze}=Ve;let lt=Ve.material;lt.allowOverride===!0&&ie!==null&&(lt=ie),Ue.layers.test(fe.layers)&&Oa(Ue,k,fe,Be,lt,ze)}}function Oa(A,k,fe,ie,ae,Pe){$!==null&&ae.isNodeMaterial&&$.setObject(A,ae),A.onBeforeRender(z,k,fe,ie,ae,Pe),A.modelViewMatrix.multiplyMatrices(fe.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),ae.onBeforeRender(z,k,fe,ie,A,Pe),ae.transparent===!0&&ae.side===Ki&&ae.forceSinglePass===!1?(ae.side=ii,ae.needsUpdate=!0,z.renderBufferDirect(fe,k,ie,ae,A,Pe),ae.side=ks,ae.needsUpdate=!0,z.renderBufferDirect(fe,k,ie,ae,A,Pe),ae.side=Ki):z.renderBufferDirect(fe,k,ie,ae,A,Pe),A.onAfterRender(z,k,fe,ie,ae,Pe)}function Pa(A,k,fe){k.isScene!==!0&&(k=Tn);const ie=le.get(A),ae=U.state.lights,Pe=U.state.shadowsArray,Ve=ae.state.version,Ue=Re.getParameters(A,ae.state,Pe,k,fe,U.state.lightProbeGridArray),Be=Re.getProgramCacheKey(Ue);let ze=ie.programs;ie.environment=A.isMeshStandardMaterial||A.isMeshLambertMaterial||A.isMeshPhongMaterial?k.environment:null,ie.fog=k.fog;const lt=A.isMeshStandardMaterial||A.isMeshLambertMaterial&&!A.envMap||A.isMeshPhongMaterial&&!A.envMap;ie.envMap=Te.get(A.envMap||ie.environment,lt),ie.envMapRotation=ie.environment!==null&&A.envMap===null?k.environmentRotation:A.envMapRotation,ze===void 0&&(A.addEventListener("dispose",si),ze=new Map,ie.programs=ze);let mt=ze.get(Be);if(mt!==void 0){if(ie.currentProgram===mt&&ie.lightsStateVersion===Ve)return sa(A,Ue),mt}else Ue.uniforms=Re.getUniforms(A),$!==null&&A.isNodeMaterial&&$.build(A,fe,Ue),A.onBeforeCompile(Ue,z),mt=Re.acquireProgram(Ue,Be),ze.set(Be,mt),ie.uniforms=Ue.uniforms;const Ye=ie.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ye.clippingPlanes=Qe.uniform),sa(A,Ue),ie.needsLights=dl(A),ie.lightsStateVersion=Ve,ie.needsLights&&(Ye.ambientLightColor.value=ae.state.ambient,Ye.lightProbe.value=ae.state.probe,Ye.sunLights.value=ae.state.sun,Ye.sunLightShadows.value=ae.state.sunShadow,Ye.directionalLights.value=ae.state.directional,Ye.directionalLightShadows.value=ae.state.directionalShadow,Ye.spotLights.value=ae.state.spot,Ye.spotLightShadows.value=ae.state.spotShadow,Ye.rectAreaLights.value=ae.state.rectArea,Ye.ltc_1.value=ae.state.rectAreaLTC1,Ye.ltc_2.value=ae.state.rectAreaLTC2,Ye.pointLights.value=ae.state.point,Ye.pointLightShadows.value=ae.state.pointShadow,Ye.hemisphereLights.value=ae.state.hemi,Ye.sunShadowMatrix.value=ae.state.sunShadowMatrix,Ye.sunShadowCascade.value=ae.state.sunShadowCascade,Ye.directionalShadowMatrix.value=ae.state.directionalShadowMatrix,Ye.spotLightMatrix.value=ae.state.spotLightMatrix,Ye.spotLightMap.value=ae.state.spotLightMap,Ye.pointShadowMatrix.value=ae.state.pointShadowMatrix),ie.lightProbeGrid=U.state.lightProbeGridArray.length>0,ie.currentProgram=mt,ie.uniformsList=null,mt}function aa(A){if(A.uniformsList===null){const k=A.currentProgram.getUniforms();A.uniformsList=ru.seqWithValue(k.seq,A.uniforms)}return A.uniformsList}function sa(A,k){const fe=le.get(A);fe.outputColorSpace=k.outputColorSpace,fe.batching=k.batching,fe.batchingColor=k.batchingColor,fe.instancing=k.instancing,fe.instancingColor=k.instancingColor,fe.instancingMorph=k.instancingMorph,fe.skinning=k.skinning,fe.morphTargets=k.morphTargets,fe.morphNormals=k.morphNormals,fe.morphColors=k.morphColors,fe.morphTargetsCount=k.morphTargetsCount,fe.numClippingPlanes=k.numClippingPlanes,fe.numIntersection=k.numClipIntersection,fe.vertexAlphas=k.vertexAlphas,fe.vertexTangents=k.vertexTangents,fe.toneMapping=k.toneMapping}function xs(A,k){if(A.length===0)return null;if(A.length===1)return A[0].texture!==null?A[0]:null;R.setFromMatrixPosition(k.matrixWorld);for(let fe=0,ie=A.length;fe<ie;fe++){const ae=A[fe];if(ae.texture!==null&&ae.boundingBox.containsPoint(R))return ae}return null}function Ia(A,k,fe,ie,ae){k.isScene!==!0&&(k=Tn),pe.resetTextureUnits();const Pe=k.fog,Ve=ie.isMeshStandardMaterial||ie.isMeshLambertMaterial||ie.isMeshPhongMaterial?k.environment:null,Ue=ue===null?z.outputColorSpace:ue.isXRRenderTarget===!0?ue.texture.colorSpace:Tt.workingColorSpace,Be=ie.isMeshStandardMaterial||ie.isMeshLambertMaterial&&!ie.envMap||ie.isMeshPhongMaterial&&!ie.envMap,ze=Te.get(ie.envMap||Ve,Be),lt=ie.vertexColors===!0&&!!fe.attributes.color&&fe.attributes.color.itemSize===4,mt=!!fe.attributes.tangent&&(!!ie.normalMap||ie.anisotropy>0),Ye=!!fe.morphAttributes.position,Rt=!!fe.morphAttributes.normal,Kt=!!fe.morphAttributes.color;let qt=$i;ie.toneMapped&&(ue===null||ue.isXRRenderTarget===!0)&&(qt=z.toneMapping);const dt=fe.morphAttributes.position||fe.morphAttributes.normal||fe.morphAttributes.color,hn=dt!==void 0?dt.length:0,ke=le.get(ie),xn=U.state.lights;if(yt===!0&&(Ot===!0||A!==he)){const Gt=A===he&&ie.id===K;Qe.setState(ie,A,Gt)}let ht=!1;ie.version===ke.__version?(ke.needsLights&&ke.lightsStateVersion!==xn.state.version||ke.outputColorSpace!==Ue||ae.isBatchedMesh&&ke.batching===!1||!ae.isBatchedMesh&&ke.batching===!0||ae.isBatchedMesh&&ke.batchingColor===!0&&ae._colorsTexture===null||ae.isBatchedMesh&&ke.batchingColor===!1&&ae._colorsTexture!==null||ae.isInstancedMesh&&ke.instancing===!1||!ae.isInstancedMesh&&ke.instancing===!0||ae.isSkinnedMesh&&ke.skinning===!1||!ae.isSkinnedMesh&&ke.skinning===!0||ae.isInstancedMesh&&ke.instancingColor===!0&&ae.instanceColor===null||ae.isInstancedMesh&&ke.instancingColor===!1&&ae.instanceColor!==null||ae.isInstancedMesh&&ke.instancingMorph===!0&&ae.morphTexture===null||ae.isInstancedMesh&&ke.instancingMorph===!1&&ae.morphTexture!==null||ke.envMap!==ze||ie.fog===!0&&ke.fog!==Pe||ke.numClippingPlanes!==void 0&&(ke.numClippingPlanes!==Qe.numPlanes||ke.numIntersection!==Qe.numIntersection)||ke.vertexAlphas!==lt||ke.vertexTangents!==mt||ke.morphTargets!==Ye||ke.morphNormals!==Rt||ke.morphColors!==Kt||ke.toneMapping!==qt||ke.morphTargetsCount!==hn||!!ke.lightProbeGrid!=U.state.lightProbeGridArray.length>0)&&(ht=!0):(ht=!0,ke.__version=ie.version);let zn=ke.currentProgram;ht===!0&&(zn=Pa(ie,k,ae),$&&ie.isNodeMaterial&&$.onUpdateProgram(ie,zn,ke));let ri=!1,Hn=!1,Fa=!1;const Ut=zn.getUniforms(),$t=ke.uniforms;if(E.useProgram(zn.program)&&(ri=!0,Hn=!0,Fa=!0),ie.id!==K&&(K=ie.id,Hn=!0),ke.needsLights){const Gt=xs(U.state.lightProbeGridArray,ae);ke.lightProbeGrid!==Gt&&(ke.lightProbeGrid=Gt,Hn=!0)}if(ri||he!==A){E.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),Ut.setValue(Z,"projectionMatrix",A.projectionMatrix),Ut.setValue(Z,"viewMatrix",A.matrixWorldInverse);const Vi=Ut.map.cameraPosition;Vi!==void 0&&Vi.setValue(Z,Wt.setFromMatrixPosition(A.matrixWorld)),O.logarithmicDepthBuffer&&Ut.setValue(Z,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(ie.isMeshPhongMaterial||ie.isMeshToonMaterial||ie.isMeshLambertMaterial||ie.isMeshBasicMaterial||ie.isMeshStandardMaterial||ie.isShaderMaterial)&&Ut.setValue(Z,"isOrthographic",A.isOrthographicCamera===!0),he!==A&&(he=A,Hn=!0,Fa=!0)}if(ke.needsLights&&(xn.state.sunShadowMap.length>0&&Ut.setValue(Z,"sunShadowMap",xn.state.sunShadowMap,pe),xn.state.directionalShadowMap.length>0&&Ut.setValue(Z,"directionalShadowMap",xn.state.directionalShadowMap,pe),xn.state.spotShadowMap.length>0&&Ut.setValue(Z,"spotShadowMap",xn.state.spotShadowMap,pe),xn.state.pointShadowMap.length>0&&Ut.setValue(Z,"pointShadowMap",xn.state.pointShadowMap,pe)),ae.isSkinnedMesh){Ut.setOptional(Z,ae,"bindMatrix"),Ut.setOptional(Z,ae,"bindMatrixInverse");const Gt=ae.skeleton;Gt&&(Gt.boneTexture===null&&Gt.computeBoneTexture(),Ut.setValue(Z,"boneTexture",Gt.boneTexture,pe))}ae.isBatchedMesh&&(Ut.setOptional(Z,ae,"batchingTexture"),Ut.setValue(Z,"batchingTexture",ae._matricesTexture,pe),Ut.setOptional(Z,ae,"batchingIdTexture"),Ut.setValue(Z,"batchingIdTexture",ae._indirectTexture,pe),Ut.setOptional(Z,ae,"batchingColorTexture"),ae._colorsTexture!==null&&Ut.setValue(Z,"batchingColorTexture",ae._colorsTexture,pe));const _i=fe.morphAttributes;if((_i.position!==void 0||_i.normal!==void 0||_i.color!==void 0)&&Y.update(ae,fe,zn),(Hn||ke.receiveShadow!==ae.receiveShadow)&&(ke.receiveShadow=ae.receiveShadow,Ut.setValue(Z,"receiveShadow",ae.receiveShadow)),(ie.isMeshStandardMaterial||ie.isMeshLambertMaterial||ie.isMeshPhongMaterial)&&ie.envMap===null&&k.environment!==null&&($t.envMapIntensity.value=k.environmentIntensity),$t.dfgLUT!==void 0&&($t.dfgLUT.value=BR()),Hn){if(Ut.setValue(Z,"toneMappingExposure",z.toneMappingExposure),ke.needsLights&&dn($t,Fa),Pe&&ie.fog===!0&&Ge.refreshFogUniforms($t,Pe),Ge.refreshMaterialUniforms($t,ie,ve,re,U.state.transmissionRenderTarget[A.id]),ke.needsLights&&ke.lightProbeGrid){const Gt=ke.lightProbeGrid;$t.probesSH.value=Gt.texture,$t.probesMin.value.copy(Gt.boundingBox.min),$t.probesMax.value.copy(Gt.boundingBox.max),$t.probesResolution.value.copy(Gt.resolution)}ru.upload(Z,aa(ke),$t,pe)}if(ie.isShaderMaterial&&ie.uniformsNeedUpdate===!0&&(ru.upload(Z,aa(ke),$t,pe),ie.uniformsNeedUpdate=!1),ie.isSpriteMaterial&&Ut.setValue(Z,"center",ae.center),Ut.setValue(Z,"modelViewMatrix",ae.modelViewMatrix),Ut.setValue(Z,"normalMatrix",ae.normalMatrix),Ut.setValue(Z,"modelMatrix",ae.matrixWorld),ie.uniformsGroups!==void 0){const Gt=ie.uniformsGroups;for(let Vi=0,Di=Gt.length;Vi<Di;Vi++){const vi=Gt[Vi];be.update(vi,zn),be.bind(vi,zn)}}return zn}function dn(A,k){A.ambientLightColor.needsUpdate=k,A.lightProbe.needsUpdate=k,A.sunLights.needsUpdate=k,A.sunLightShadows.needsUpdate=k,A.directionalLights.needsUpdate=k,A.directionalLightShadows.needsUpdate=k,A.pointLights.needsUpdate=k,A.pointLightShadows.needsUpdate=k,A.spotLights.needsUpdate=k,A.spotLightShadows.needsUpdate=k,A.rectAreaLights.needsUpdate=k,A.hemisphereLights.needsUpdate=k}function dl(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return F},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return ue},this.setRenderTargetTextures=function(A,k,fe){const ie=le.get(A);ie.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,ie.__autoAllocateDepthBuffer===!1&&(ie.__useRenderToTexture=!1),le.get(A.texture).__webglTexture=k,le.get(A.depthTexture).__webglTexture=ie.__autoAllocateDepthBuffer?void 0:fe,ie.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,k){const fe=le.get(A);fe.__webglFramebuffer=k,fe.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(A,k=0,fe=0){ue=A,F=k,V=fe;let ie=null,ae=!1,Pe=!1;if(A){const Ue=le.get(A);if(Ue.__useDefaultFramebuffer!==void 0){E.bindFramebuffer(Z.FRAMEBUFFER,Ue.__webglFramebuffer),L.copy(A.viewport),ne.copy(A.scissor),_e=A.scissorTest,E.viewport(L),E.scissor(ne),E.setScissorTest(_e),K=-1;return}else if(Ue.__webglFramebuffer===void 0)pe.setupRenderTarget(A);else if(Ue.__hasExternalTextures)pe.rebindTextures(A,le.get(A.texture).__webglTexture,le.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const lt=A.depthTexture;if(Ue.__boundDepthTexture!==lt){if(lt!==null&&le.has(lt)&&(A.width!==lt.image.width||A.height!==lt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");pe.setupDepthRenderbuffer(A)}}const Be=A.texture;(Be.isData3DTexture||Be.isDataArrayTexture||Be.isCompressedArrayTexture)&&(Pe=!0);const ze=le.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(ze[k])?ie=ze[k][fe]:ie=ze[k],ae=!0):A.samples>0&&pe.useMultisampledRTT(A)===!1?ie=le.get(A).__webglMultisampledFramebuffer:Array.isArray(ze)?ie=ze[fe]:ie=ze,L.copy(A.viewport),ne.copy(A.scissor),_e=A.scissorTest}else L.copy(He).multiplyScalar(ve).floor(),ne.copy(ct).multiplyScalar(ve).floor(),_e=an;if(fe!==0&&(ie=j),E.bindFramebuffer(Z.FRAMEBUFFER,ie)&&E.drawBuffers(A,ie),E.viewport(L),E.scissor(ne),E.setScissorTest(_e),ae){const Ue=le.get(A.texture);Z.framebufferTexture2D(Z.FRAMEBUFFER,Z.COLOR_ATTACHMENT0,Z.TEXTURE_CUBE_MAP_POSITIVE_X+k,Ue.__webglTexture,fe)}else if(Pe){const Ue=k;for(let Be=0;Be<A.textures.length;Be++){const ze=le.get(A.textures[Be]);Z.framebufferTextureLayer(Z.FRAMEBUFFER,Z.COLOR_ATTACHMENT0+Be,ze.__webglTexture,fe,Ue)}}else if(A!==null&&fe!==0){const Ue=le.get(A.texture);Z.framebufferTexture2D(Z.FRAMEBUFFER,Z.COLOR_ATTACHMENT0,Z.TEXTURE_2D,Ue.__webglTexture,fe)}K=-1};function eo(A){const k=le.get(A);return(k.__readFormat!==A.format||k.__readType!==A.type)&&(k.__readFormat=A.format,k.__readType=A.type,k.__formatReadable=O.textureFormatReadable(A.format),k.__typeReadable=O.textureTypeReadable(A.type)),k}this.readRenderTargetPixels=function(A,k,fe,ie,ae,Pe,Ve,Ue=0){if(!(A&&A.isWebGLRenderTarget)){Ct("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Be=le.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ve!==void 0&&(Be=Be[Ve]),Be){E.bindFramebuffer(Z.FRAMEBUFFER,Be);try{const ze=A.textures[Ue],lt=ze.format,mt=ze.type;A.textures.length>1&&Z.readBuffer(Z.COLOR_ATTACHMENT0+Ue);const Ye=eo(ze);if(Ye.__formatReadable===!1){Ct("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ye.__typeReadable===!1){Ct("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=A.width-ie&&fe>=0&&fe<=A.height-ae&&Z.readPixels(k,fe,ie,ae,we.convert(lt),we.convert(mt),Pe)}finally{const ze=ue!==null?le.get(ue).__webglFramebuffer:null;E.bindFramebuffer(Z.FRAMEBUFFER,ze)}}},this.readRenderTargetPixelsAsync=async function(A,k,fe,ie,ae,Pe,Ve,Ue=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Be=le.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ve!==void 0&&(Be=Be[Ve]),Be)if(k>=0&&k<=A.width-ie&&fe>=0&&fe<=A.height-ae){E.bindFramebuffer(Z.FRAMEBUFFER,Be);const ze=A.textures[Ue],lt=ze.format,mt=ze.type;A.textures.length>1&&Z.readBuffer(Z.COLOR_ATTACHMENT0+Ue);const Ye=eo(ze);if(Ye.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ye.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Rt=Z.createBuffer();Z.bindBuffer(Z.PIXEL_PACK_BUFFER,Rt),Z.bufferData(Z.PIXEL_PACK_BUFFER,Pe.byteLength,Z.STREAM_READ),Z.readPixels(k,fe,ie,ae,we.convert(lt),we.convert(mt),0),Z.bindBuffer(Z.PIXEL_PACK_BUFFER,null);const Kt=ue!==null?le.get(ue).__webglFramebuffer:null;E.bindFramebuffer(Z.FRAMEBUFFER,Kt);const qt=Z.fenceSync(Z.SYNC_GPU_COMMANDS_COMPLETE,0);return Z.flush(),await KM(Z,qt,4),Z.bindBuffer(Z.PIXEL_PACK_BUFFER,Rt),Z.getBufferSubData(Z.PIXEL_PACK_BUFFER,0,Pe),Z.bindBuffer(Z.PIXEL_PACK_BUFFER,null),Z.deleteBuffer(Rt),Z.deleteSync(qt),Pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,k=null,fe=0){const ie=Math.pow(2,-fe),ae=Math.floor(A.image.width*ie),Pe=Math.floor(A.image.height*ie),Ve=k!==null?k.x:0,Ue=k!==null?k.y:0;pe.setTexture2D(A,0),Z.copyTexSubImage2D(Z.TEXTURE_2D,fe,0,0,Ve,Ue,ae,Pe),E.unbindTexture()},this.copyTextureToTexture=function(A,k,fe=null,ie=null,ae=0,Pe=0){let Ve,Ue,Be,ze,lt,mt,Ye,Rt,Kt;const qt=A.isCompressedTexture?A.mipmaps[Pe]:A.image;if(fe!==null)Ve=fe.max.x-fe.min.x,Ue=fe.max.y-fe.min.y,Be=fe.isBox3?fe.max.z-fe.min.z:1,ze=fe.min.x,lt=fe.min.y,mt=fe.isBox3?fe.min.z:0;else{const $t=Math.pow(2,-ae);Ve=Math.floor(qt.width*$t),Ue=Math.floor(qt.height*$t),A.isDataArrayTexture?Be=qt.depth:A.isData3DTexture?Be=Math.floor(qt.depth*$t):Be=1,ze=0,lt=0,mt=0}ie!==null?(Ye=ie.x,Rt=ie.y,Kt=ie.z):(Ye=0,Rt=0,Kt=0);const dt=we.convert(k.format),hn=we.convert(k.type);let ke;k.isData3DTexture?(pe.setTexture3D(k,0),ke=Z.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(pe.setTexture2DArray(k,0),ke=Z.TEXTURE_2D_ARRAY):(pe.setTexture2D(k,0),ke=Z.TEXTURE_2D),E.activeTexture(Z.TEXTURE0),E.pixelStorei(Z.UNPACK_FLIP_Y_WEBGL,k.flipY),E.pixelStorei(Z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),E.pixelStorei(Z.UNPACK_ALIGNMENT,k.unpackAlignment);const xn=E.getParameter(Z.UNPACK_ROW_LENGTH),ht=E.getParameter(Z.UNPACK_IMAGE_HEIGHT),zn=E.getParameter(Z.UNPACK_SKIP_PIXELS),ri=E.getParameter(Z.UNPACK_SKIP_ROWS),Hn=E.getParameter(Z.UNPACK_SKIP_IMAGES);E.pixelStorei(Z.UNPACK_ROW_LENGTH,qt.width),E.pixelStorei(Z.UNPACK_IMAGE_HEIGHT,qt.height),E.pixelStorei(Z.UNPACK_SKIP_PIXELS,ze),E.pixelStorei(Z.UNPACK_SKIP_ROWS,lt),E.pixelStorei(Z.UNPACK_SKIP_IMAGES,mt);const Fa=A.isDataArrayTexture||A.isData3DTexture,Ut=k.isDataArrayTexture||k.isData3DTexture;if(A.isDepthTexture){const $t=le.get(A),_i=le.get(k),Gt=le.get($t.__renderTarget),Vi=le.get(_i.__renderTarget);E.bindFramebuffer(Z.READ_FRAMEBUFFER,Gt.__webglFramebuffer),E.bindFramebuffer(Z.DRAW_FRAMEBUFFER,Vi.__webglFramebuffer);for(let Di=0;Di<Be;Di++)Fa&&(Z.framebufferTextureLayer(Z.READ_FRAMEBUFFER,Z.COLOR_ATTACHMENT0,le.get(A).__webglTexture,ae,mt+Di),Z.framebufferTextureLayer(Z.DRAW_FRAMEBUFFER,Z.COLOR_ATTACHMENT0,le.get(k).__webglTexture,Pe,Kt+Di)),Z.blitFramebuffer(ze,lt,Ve,Ue,Ye,Rt,Ve,Ue,Z.DEPTH_BUFFER_BIT,Z.NEAREST);E.bindFramebuffer(Z.READ_FRAMEBUFFER,null),E.bindFramebuffer(Z.DRAW_FRAMEBUFFER,null)}else if(ae!==0||A.isRenderTargetTexture||le.has(A)){const $t=le.get(A),_i=le.get(k);E.bindFramebuffer(Z.READ_FRAMEBUFFER,X),E.bindFramebuffer(Z.DRAW_FRAMEBUFFER,te);for(let Gt=0;Gt<Be;Gt++)Fa?Z.framebufferTextureLayer(Z.READ_FRAMEBUFFER,Z.COLOR_ATTACHMENT0,$t.__webglTexture,ae,mt+Gt):Z.framebufferTexture2D(Z.READ_FRAMEBUFFER,Z.COLOR_ATTACHMENT0,Z.TEXTURE_2D,$t.__webglTexture,ae),Ut?Z.framebufferTextureLayer(Z.DRAW_FRAMEBUFFER,Z.COLOR_ATTACHMENT0,_i.__webglTexture,Pe,Kt+Gt):Z.framebufferTexture2D(Z.DRAW_FRAMEBUFFER,Z.COLOR_ATTACHMENT0,Z.TEXTURE_2D,_i.__webglTexture,Pe),ae!==0?Z.blitFramebuffer(ze,lt,Ve,Ue,Ye,Rt,Ve,Ue,Z.COLOR_BUFFER_BIT,Z.NEAREST):Ut?Z.copyTexSubImage3D(ke,Pe,Ye,Rt,Kt+Gt,ze,lt,Ve,Ue):Z.copyTexSubImage2D(ke,Pe,Ye,Rt,ze,lt,Ve,Ue);E.bindFramebuffer(Z.READ_FRAMEBUFFER,null),E.bindFramebuffer(Z.DRAW_FRAMEBUFFER,null)}else Ut?A.isDataTexture||A.isData3DTexture?Z.texSubImage3D(ke,Pe,Ye,Rt,Kt,Ve,Ue,Be,dt,hn,qt.data):k.isCompressedArrayTexture?Z.compressedTexSubImage3D(ke,Pe,Ye,Rt,Kt,Ve,Ue,Be,dt,qt.data):Z.texSubImage3D(ke,Pe,Ye,Rt,Kt,Ve,Ue,Be,dt,hn,qt):A.isDataTexture?Z.texSubImage2D(Z.TEXTURE_2D,Pe,Ye,Rt,Ve,Ue,dt,hn,qt.data):A.isCompressedTexture?Z.compressedTexSubImage2D(Z.TEXTURE_2D,Pe,Ye,Rt,qt.width,qt.height,dt,qt.data):Z.texSubImage2D(Z.TEXTURE_2D,Pe,Ye,Rt,Ve,Ue,dt,hn,qt);E.pixelStorei(Z.UNPACK_ROW_LENGTH,xn),E.pixelStorei(Z.UNPACK_IMAGE_HEIGHT,ht),E.pixelStorei(Z.UNPACK_SKIP_PIXELS,zn),E.pixelStorei(Z.UNPACK_SKIP_ROWS,ri),E.pixelStorei(Z.UNPACK_SKIP_IMAGES,Hn),Pe===0&&k.generateMipmaps&&Z.generateMipmap(ke),E.unbindTexture()},this.initRenderTarget=function(A){le.get(A).__webglFramebuffer===void 0&&pe.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?pe.setTextureCube(A,0):A.isData3DTexture?pe.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?pe.setTexture2DArray(A,0):pe.setTexture2D(A,0),E.unbindTexture()},this.resetState=function(){F=0,V=0,ue=null,E.reset(),Fe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ji}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const i=this.getContext();i.drawingBufferColorSpace=Tt._getDrawingBufferColorSpace(e),i.unpackColorSpace=Tt._getUnpackColorSpace()}}const Nv={type:"change"},Ap={type:"start"},Mx={type:"end"},Zc=new vu,Uv=new Ca,HR=Math.cos(70*$M.DEG2RAD),yn=new ee,ti=2*Math.PI,zt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ph=1e-6;class GR extends Gb{constructor(e,i=null){super(e,i),this.state=zt.NONE,this.target=new ee,this.cursor=new ee,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Xr.ROTATE,MIDDLE:Xr.DOLLY,RIGHT:Xr.PAN},this.touches={ONE:Vr.ROTATE,TWO:Vr.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new ee,this._lastQuaternion=new ps,this._lastTargetPosition=new ee,this._quat=new ps().setFromUnitVectors(e.up,new ee(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new rv,this._sphericalDelta=new rv,this._scale=1,this._panOffset=new ee,this._rotateStart=new at,this._rotateEnd=new at,this._rotateDelta=new at,this._panStart=new at,this._panEnd=new at,this._panDelta=new at,this._dollyStart=new at,this._dollyEnd=new at,this._dollyDelta=new at,this._dollyDirection=new ee,this._mouse=new at,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=kR.bind(this),this._onPointerDown=VR.bind(this),this._onPointerUp=XR.bind(this),this._onContextMenu=QR.bind(this),this._onMouseWheel=qR.bind(this),this._onKeyDown=ZR.bind(this),this._onTouchStart=jR.bind(this),this._onTouchMove=KR.bind(this),this._onMouseDown=WR.bind(this),this._onMouseMove=YR.bind(this),this._interceptControlDown=JR.bind(this),this._interceptControlUp=$R.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=zt.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents();const e=this.domElement.getRootNode();e.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),e.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Nv),this.update(),this.state=zt.NONE}pan(e,i){this._pan(e,i),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const i=this.object.position;yn.copy(i).sub(this.target),yn.applyQuaternion(this._quat),this._spherical.setFromVector3(yn),this.autoRotate&&this.state===zt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let s=this.minAzimuthAngle,l=this.maxAzimuthAngle;isFinite(s)&&isFinite(l)&&(s<-Math.PI?s+=ti:s>Math.PI&&(s-=ti),l<-Math.PI?l+=ti:l>Math.PI&&(l-=ti),s<=l?this._spherical.theta=Math.max(s,Math.min(l,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(s+l)/2?Math.max(s,this._spherical.theta):Math.min(l,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let c=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const f=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),c=f!=this._spherical.radius}if(yn.setFromSpherical(this._spherical),yn.applyQuaternion(this._quatInverse),i.copy(this.target).add(yn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let f=null;if(this.object.isPerspectiveCamera){const m=yn.length();f=this._clampDistance(m*this._scale);const h=m-f;this.object.position.addScaledVector(this._dollyDirection,h),this.object.updateMatrixWorld(),c=!!h}else if(this.object.isOrthographicCamera){const m=new ee(this._mouse.x,this._mouse.y,0);m.unproject(this.object);const h=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),c=h!==this.object.zoom;const d=new ee(this._mouse.x,this._mouse.y,0);d.unproject(this.object),this.object.position.sub(d).add(m),this.object.updateMatrixWorld(),f=yn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;f!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(f).add(this.object.position):(Zc.origin.copy(this.object.position),Zc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Zc.direction))<HR?this.object.lookAt(this.target):(Uv.setFromNormalAndCoplanarPoint(this.object.up,this.target),Zc.intersectPlane(Uv,this.target))))}else if(this.object.isOrthographicCamera){const f=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),f!==this.object.zoom&&(this.object.updateProjectionMatrix(),c=!0)}return this._scale=1,this._performCursorZoom=!1,c||this._lastPosition.distanceToSquared(this.object.position)>ph||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ph||this._lastTargetPosition.distanceToSquared(this.target)>ph?(this.dispatchEvent(Nv),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?ti/60*this.autoRotateSpeed*e:ti/60/60*this.autoRotateSpeed}_getZoomScale(e){const i=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*i)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,i){yn.setFromMatrixColumn(i,0),yn.multiplyScalar(-e),this._panOffset.add(yn)}_panUp(e,i){this.screenSpacePanning===!0?yn.setFromMatrixColumn(i,1):(yn.setFromMatrixColumn(i,0),yn.crossVectors(this.object.up,yn)),yn.multiplyScalar(e),this._panOffset.add(yn)}_pan(e,i){const s=this.domElement;if(this.object.isPerspectiveCamera){const l=this.object.position;yn.copy(l).sub(this.target);let c=yn.length();c*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*c/s.clientHeight,this.object.matrix),this._panUp(2*i*c/s.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/s.clientWidth,this.object.matrix),this._panUp(i*(this.object.top-this.object.bottom)/this.object.zoom/s.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,i){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const s=this.domElement.getBoundingClientRect(),l=e-s.left,c=i-s.top,f=s.width,m=s.height;this._mouse.x=l/f*2-1,this._mouse.y=-(c/m)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(ti*this._rotateDelta.x/i.clientHeight),this._rotateUp(ti*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let i=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(ti*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),i=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-ti*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),i=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(ti*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),i=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-ti*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),i=!0;break}i&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._rotateStart.set(s,l)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._panStart.set(s,l)}}_handleTouchStartDolly(e){const i=this._getSecondPointerPosition(e),s=e.pageX-i.x,l=e.pageY-i.y,c=Math.sqrt(s*s+l*l);this._dollyStart.set(0,c)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const s=this._getSecondPointerPosition(e),l=.5*(e.pageX+s.x),c=.5*(e.pageY+s.y);this._rotateEnd.set(l,c)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(ti*this._rotateDelta.x/i.clientHeight),this._rotateUp(ti*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._panEnd.set(s,l)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const i=this._getSecondPointerPosition(e),s=e.pageX-i.x,l=e.pageY-i.y,c=Math.sqrt(s*s+l*l);this._dollyEnd.set(0,c),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const f=(e.pageX+i.x)*.5,m=(e.pageY+i.y)*.5;this._updateZoomParameters(f,m)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==e.pointerId){this._pointers.splice(i,1);return}}_isTrackingPointer(e){for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==e.pointerId)return!0;return!1}_trackPointer(e){let i=this._pointerPositions[e.pointerId];i===void 0&&(i=new at,this._pointerPositions[e.pointerId]=i),i.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const i=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[i]}_customWheelEvent(e){const i=e.deltaMode,s={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(i){case 1:s.deltaY*=16;break;case 2:s.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(s.deltaY*=10),s}}function VR(r){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(r.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(r)&&(this._addPointer(r),r.pointerType==="touch"?this._onTouchStart(r):this._onMouseDown(r),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function kR(r){this.enabled!==!1&&(r.pointerType==="touch"?this._onTouchMove(r):this._onMouseMove(r))}function XR(r){switch(this._removePointer(r),this._pointers.length){case 0:this.domElement.releasePointerCapture(r.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Mx),this.state=zt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],i=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:i.x,pageY:i.y});break}}function WR(r){let e;switch(r.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Xr.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(r),this.state=zt.DOLLY;break;case Xr.ROTATE:if(r.ctrlKey||r.metaKey||r.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(r),this.state=zt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(r),this.state=zt.ROTATE}break;case Xr.PAN:if(r.ctrlKey||r.metaKey||r.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(r),this.state=zt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(r),this.state=zt.PAN}break;default:this.state=zt.NONE}this.state!==zt.NONE&&this.dispatchEvent(Ap)}function YR(r){switch(this.state){case zt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(r);break;case zt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(r);break;case zt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(r);break}}function qR(r){this.enabled===!1||this.enableZoom===!1||this.state!==zt.NONE||(r.preventDefault(),this.dispatchEvent(Ap),this._handleMouseWheel(this._customWheelEvent(r)),this.dispatchEvent(Mx))}function ZR(r){this.enabled!==!1&&this._handleKeyDown(r)}function jR(r){switch(this._trackPointer(r),this._pointers.length){case 1:switch(this.touches.ONE){case Vr.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(r),this.state=zt.TOUCH_ROTATE;break;case Vr.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(r),this.state=zt.TOUCH_PAN;break;default:this.state=zt.NONE}break;case 2:switch(this.touches.TWO){case Vr.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(r),this.state=zt.TOUCH_DOLLY_PAN;break;case Vr.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(r),this.state=zt.TOUCH_DOLLY_ROTATE;break;default:this.state=zt.NONE}break;default:this.state=zt.NONE}this.state!==zt.NONE&&this.dispatchEvent(Ap)}function KR(r){switch(this._trackPointer(r),this.state){case zt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(r),this.update();break;case zt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(r),this.update();break;case zt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(r),this.update();break;case zt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(r),this.update();break;default:this.state=zt.NONE}}function QR(r){this.enabled!==!1&&r.preventDefault()}function JR(r){r.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function $R(r){r.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Lv=1e3;function mh(r){const e=Math.round(r*Lv)/Lv;return e===0?0:e}function eC(r,e,i){return`${mh(r)},${mh(e)},${mh(i)}`}function tC(r){let e=1/0,i=1/0,s=1/0,l=-1/0,c=-1/0,f=-1/0;for(let m=0;m<r.length;m+=3){const h=r[m],d=r[m+1],g=r[m+2];h<e&&(e=h),d<i&&(i=d),g<s&&(s=g),h>l&&(l=h),d>c&&(c=d),g>f&&(f=g)}return eC((e+l)/2,(i+c)/2,(s+f)/2)}const nC=[.04,.04,.04],iC=[1,.6,.1],aC=[.98,.8,.09];class sC{renderer;scene;camera;controls;resizeObserver;frame=0;meshGeometry;mesh;edgeGeometry;edgeLines;hasFramed=!1;raycaster=new Bb;segmentRefs=[];edgeRefs=new Set;edgeColors=new Float32Array(0);hoveredRef=null;selectedRefs=new Set;onSelectionChange=null;constructor(e){this.scene=new hb,this.scene.background=new _t(1710618);const{clientWidth:i,clientHeight:s}=e;this.camera=new wi(45,i/s||1,.1,1e4),this.camera.position.set(80,60,80),this.renderer=new zR({antialias:!0}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(i,s),e.appendChild(this.renderer.domElement),this.controls=new GR(this.camera,this.renderer.domElement),this.controls.enableDamping=!0;const l=new iv(16777215,2);l.position.set(1,1.5,1),this.scene.add(l);const c=new iv(16777215,.7);c.position.set(-1,-.5,-1),this.scene.add(c),this.scene.add(new Pb(16777215,.5));const f=new zb(400,40,4473924,2763306);this.scene.add(f),this.scene.add(new Hb(30)),this.meshGeometry=new ai;const m=new Db({color:4886745,metalness:.1,roughness:.6,side:Ki,flatShading:!1});this.mesh=new na(this.meshGeometry,m),this.mesh.visible=!1,this.scene.add(this.mesh),this.edgeGeometry=new ai;const h=new xu({vertexColors:!0});this.edgeLines=new Ep(this.edgeGeometry,h),this.edgeLines.visible=!1,this.scene.add(this.edgeLines),this.raycaster.params.Line={threshold:.5},this.resizeObserver=new ResizeObserver(()=>this.onResize(e)),this.resizeObserver.observe(e),this.animate()}setShape(e){const{mesh:i,edges:s}=e;this.meshGeometry.setAttribute("position",new ni(i.positions,3)),this.meshGeometry.setAttribute("normal",new ni(i.normals,3)),this.meshGeometry.setIndex(new ni(i.indices,1)),this.meshGeometry.attributes.position.needsUpdate=!0,this.meshGeometry.computeBoundingSphere(),this.mesh.visible=!0;const l=rC(s.points,s.edgeGroups);this.segmentRefs=l.segmentRefs,this.edgeRefs=new Set(l.segmentRefs),this.edgeColors=new Float32Array(l.positions.length),this.edgeGeometry.setAttribute("position",new ni(l.positions,3)),this.edgeGeometry.setAttribute("color",new ni(this.edgeColors,3)),this.edgeGeometry.attributes.position.needsUpdate=!0,this.edgeGeometry.computeBoundingSphere(),this.edgeLines.visible=!0;for(const c of[...this.selectedRefs])this.edgeRefs.has(c)||this.selectedRefs.delete(c);this.hoveredRef&&!this.edgeRefs.has(this.hoveredRef)&&(this.hoveredRef=null),this.repaintEdges(),this.hasFramed||(this.frameShape(e.bbox),this.hasFramed=!0)}repaintEdges(){const e=this.edgeColors;for(let s=0;s<this.segmentRefs.length;s++){const l=this.segmentRefs[s],c=this.selectedRefs.has(l)?aC:l===this.hoveredRef?iC:nC,f=s*6;e[f]=c[0],e[f+1]=c[1],e[f+2]=c[2],e[f+3]=c[0],e[f+4]=c[1],e[f+5]=c[2]}const i=this.edgeGeometry.getAttribute("color");i&&(i.needsUpdate=!0)}frameCurrent(e){this.frameShape(e)}clearShape(){this.mesh.visible=!1,this.edgeLines.visible=!1}frameShape(e){const i=new ee(...e.min),s=new ee(...e.max),l=i.clone().add(s).multiplyScalar(.5),c=s.clone().sub(i),m=Math.max(c.x,c.y,c.z,1)*.5/Math.sin(this.camera.fov*Math.PI/360),h=new ee(1,.8,1).normalize();this.camera.position.copy(l.clone().add(h.multiplyScalar(m*1.4))),this.camera.near=m*.01,this.camera.far=m*100,this.camera.updateProjectionMatrix(),this.controls.target.copy(l),this.controls.update()}onResize(e){const{clientWidth:i,clientHeight:s}=e;i===0||s===0||(this.camera.aspect=i/s,this.camera.updateProjectionMatrix(),this.renderer.setSize(i,s))}animate=()=>{this.frame=requestAnimationFrame(this.animate),this.controls.update(),this.renderer.render(this.scene,this.camera)};pickEdge(e,i){if(!this.edgeLines.visible)return null;const s=this.camera.position.distanceTo(this.controls.target);this.raycaster.params.Line={threshold:Math.max(s*.008,.05)},this.raycaster.setFromCamera(new at(e,i),this.camera);const l=this.raycaster.intersectObject(this.edgeLines,!1);if(l.length===0)return null;const c=l[0].index??0,f=Math.floor(c/2);return this.segmentRefs[f]??null}hover(e,i){const s=this.pickEdge(e,i);return s!==this.hoveredRef&&(this.hoveredRef=s,this.repaintEdges()),s}clickSelect(e,i,s){const l=this.pickEdge(e,i);return l?(s||this.selectedRefs.clear(),this.selectedRefs.has(l)?this.selectedRefs.delete(l):this.selectedRefs.add(l),this.repaintEdges(),this.emitSelection(),!0):(!s&&this.selectedRefs.size>0&&(this.selectedRefs.clear(),this.repaintEdges(),this.emitSelection()),!1)}setSelection(e){this.selectedRefs=new Set(e.filter(i=>this.edgeRefs.has(i))),this.repaintEdges()}emitSelection(){this.onSelectionChange?.([...this.selectedRefs])}dispose(){cancelAnimationFrame(this.frame),this.resizeObserver.disconnect(),this.controls.dispose(),this.meshGeometry.dispose(),this.edgeGeometry.dispose(),this.mesh.material.dispose(),this.edgeLines.material.dispose(),this.renderer.dispose(),this.renderer.domElement.remove()}}function rC(r,e){const i=[],s=[];for(let l=0;l<e.length;l+=3){const c=e[l],f=e[l+1],m=Math.floor(f/3),h=tC(r.subarray(c,c+f));for(let d=0;d<m-1;d++){const g=c+d*3,_=c+(d+1)*3;i.push(r[g],r[g+1],r[g+2],r[_],r[_+1],r[_+2]),s.push(h)}}return{positions:new Float32Array(i),segmentRefs:s}}function oC(){const r=jt.useRef(null),e=jt.useRef(null),i=Ze(_=>_.shape),s=Ze(_=>_.setSelectedEdges),l=Ze(_=>_.selectedEdgeRefs),c=jt.useRef(null);jt.useEffect(()=>{if(!r.current)return;const _=new sC(r.current);return e.current=_,_.onSelectionChange=v=>s(v),()=>{_.dispose(),e.current=null}},[s]),jt.useEffect(()=>{const _=e.current;_&&(i?_.setShape(i):_.clearShape())},[i]),jt.useEffect(()=>{e.current?.setSelection(l)},[l]);const f=_=>{const v=r.current.getBoundingClientRect(),y=(_.clientX-v.left)/v.width*2-1,M=-((_.clientY-v.top)/v.height)*2+1;return[y,M]},m=_=>{const v=e.current;if(!v)return;const[y,M]=f(_),w=v.hover(y,M);r.current&&(r.current.style.cursor=w?"pointer":"default")},h=_=>{c.current={x:_.clientX,y:_.clientY}},d=_=>{const v=e.current,y=c.current;if(c.current=null,!v||!y||Math.hypot(_.clientX-y.x,_.clientY-y.y)>4)return;const[w,b]=f(_);v.clickSelect(w,b,_.shiftKey)},g=()=>{i&&e.current&&e.current.frameCurrent(i.bbox)};return H.jsxs("div",{className:"relative h-full w-full",children:[H.jsx("div",{ref:r,className:"h-full w-full",onPointerMove:m,onPointerDown:h,onPointerUp:d}),H.jsx("button",{type:"button",onClick:g,disabled:!i,className:"absolute right-3 top-3 rounded border border-neutral-700 bg-neutral-800/80 px-2 py-1 text-xs text-neutral-200 backdrop-blur transition hover:bg-neutral-700 disabled:opacity-40",children:"Zoom to fit"}),l.length>0&&H.jsxs("div",{className:"absolute left-3 top-3 rounded border border-amber-700 bg-amber-950/70 px-2 py-1 text-xs text-amber-200 backdrop-blur",children:[l.length," edge(s) selected · Esc to clear"]}),i&&H.jsx("div",{className:"absolute bottom-3 left-3 rounded border border-neutral-700 bg-neutral-900/80 px-2 py-1 font-mono text-[11px] text-neutral-300 backdrop-blur",children:lC(i.bbox)})]})}function lC(r){const e=r.max[0]-r.min[0],i=r.max[1]-r.min[1],s=r.max[2]-r.min[2],l=c=>c.toFixed(1);return`${l(e)} × ${l(i)} × ${l(s)}`}function cC({onClose:r}){const e=Ze(c=>c.doc.id),i=Ze(c=>c.insertReference),[s,l]=jt.useState(null);return jt.useEffect(()=>{let c=!1;return(async()=>{const f=await fp(),m=[];for(const h of f){if(h.id===e)continue;const d=await Kc(h.id);if(d)for(const g of d.tabs)m.push({docId:d.id,docName:d.name,tabId:g.id,tabName:g.name})}c||l(m)})(),()=>{c=!0}},[e]),H.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/50",onClick:r,children:H.jsxs("div",{className:"w-96 rounded-lg border border-neutral-700 bg-neutral-900 p-4 shadow-xl",onClick:c=>c.stopPropagation(),children:[H.jsx("h2",{className:"mb-3 text-sm font-semibold text-neutral-100",children:"Insert reference"}),s===null?H.jsx("p",{className:"text-xs text-neutral-500",children:"Loading…"}):s.length===0?H.jsx("p",{className:"text-xs text-neutral-500",children:"No other documents to reference. Save another document first."}):H.jsx("ul",{className:"flex max-h-80 flex-col gap-1 overflow-y-auto",children:s.map(c=>H.jsx("li",{children:H.jsxs("button",{type:"button",onClick:()=>{i(c.docId,c.tabId),r()},className:"flex w-full items-center justify-between rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-left text-xs hover:border-blue-600 hover:bg-neutral-800",children:[H.jsx("span",{className:"truncate text-neutral-200",children:c.tabName}),H.jsx("span",{className:"ml-2 shrink-0 text-neutral-500",children:c.docName})]})},`${c.docId}:${c.tabId}`))}),H.jsx("div",{className:"mt-4 flex justify-end",children:H.jsx("button",{type:"button",onClick:r,className:"rounded bg-neutral-800 px-3 py-1 text-xs text-neutral-300 hover:bg-neutral-700",children:"Cancel"})})]})})}const uC={box:"Box",cylinder:"Cylinder",sketch:"Sketch",extrude:"Extrude",fillet:"Fillet",chamfer:"Chamfer",mirror:"Mirror",linearPattern:"Linear Pattern",circularPattern:"Circular Pattern",linked:"Reference"},fC={new:{text:"new",cls:"bg-neutral-700 text-neutral-200"},add:{text:"+",cls:"bg-green-800 text-green-200"},remove:{text:"−",cls:"bg-red-900 text-red-200"}},dC={text:"✎",cls:"bg-indigo-900 text-indigo-200"},hC={text:"◗",cls:"bg-amber-800 text-amber-100"},pC={text:"⧉",cls:"bg-purple-900 text-purple-200"};function mC(r){return Iv(r)?pC:Pv(r)?fC[r.operation]:_h(r)?hC:dC}function gC(){const r=Ze(R=>R.tree.features),e=Ze(R=>R.selectedId),i=Ze(R=>R.statuses),s=Ze(R=>R.addFeature),l=Ze(R=>R.selectFeature),c=Ze(R=>R.toggleSuppress),f=Ze(R=>R.deleteFeature),m=Ze(R=>R.moveFeature),h=Ze(R=>R.addExtrude),d=Ze(R=>R.addFillet),g=Ze(R=>R.addChamfer),_=Ze(R=>R.addMirror),v=Ze(R=>R.addLinearPattern),y=Ze(R=>R.addCircularPattern),M=Ze(R=>R.selectedEdgeRefs.length),[w,b]=jt.useState(!1),x=r.some(R=>R.type!=="sketch"&&!R.suppressed),I=r.find(R=>R.id===e&&R.type==="sketch"),G=M>0;return H.jsxs("section",{className:"flex min-h-0 flex-1 flex-col",children:[H.jsxs("div",{className:"flex flex-wrap items-center gap-1 border-b border-neutral-800 px-3 py-2",children:[H.jsx("span",{className:"mr-auto text-xs font-medium uppercase tracking-wide text-neutral-500",children:"Features"}),H.jsx("button",{type:"button",onClick:()=>s("box"),className:"rounded bg-neutral-800 px-2 py-1 text-xs hover:bg-neutral-700",children:"+ Box"}),H.jsx("button",{type:"button",onClick:()=>s("cylinder"),className:"rounded bg-neutral-800 px-2 py-1 text-xs hover:bg-neutral-700",children:"+ Cylinder"}),H.jsx("button",{type:"button",disabled:!I,onClick:()=>I&&h(I.id),title:I?"Extrude the selected sketch":"Select a sketch to extrude",className:"rounded bg-blue-700 px-2 py-1 text-xs text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600",children:"↑ Extrude"}),H.jsx("button",{type:"button",disabled:!G,onClick:()=>d(),title:G?`Fillet ${M} selected edge(s)`:"Select edges in the 3D view to fillet",className:"rounded bg-amber-700 px-2 py-1 text-xs text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600",children:"◗ Fillet"}),H.jsx("button",{type:"button",disabled:!G,onClick:()=>g(),title:G?`Chamfer ${M} selected edge(s)`:"Select edges in the 3D view to chamfer",className:"rounded bg-amber-700 px-2 py-1 text-xs text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600",children:"◗ Chamfer"}),H.jsx("button",{type:"button",disabled:!x,onClick:()=>_(),title:x?"Mirror the body":"Need a body first",className:"rounded bg-purple-800 px-2 py-1 text-xs text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600",children:"⧉ Mirror"}),H.jsx("button",{type:"button",disabled:!x,onClick:()=>v(),title:x?"Linear pattern the body":"Need a body first",className:"rounded bg-purple-800 px-2 py-1 text-xs text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600",children:"⧉ Linear"}),H.jsx("button",{type:"button",disabled:!x,onClick:()=>y(),title:x?"Circular pattern the body":"Need a body first",className:"rounded bg-purple-800 px-2 py-1 text-xs text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-600",children:"⧉ Circular"}),H.jsx("button",{type:"button",onClick:()=>b(!0),title:"Insert a read-only reference to another document's Part Studio",className:"rounded bg-teal-800 px-2 py-1 text-xs text-white hover:bg-teal-700",children:"⛓ Ref"})]}),w&&H.jsx(cC,{onClose:()=>b(!1)}),H.jsxs("ul",{className:"min-h-0 flex-1 overflow-y-auto",children:[r.length===0&&H.jsx("li",{className:"px-4 py-6 text-center text-xs text-neutral-600",children:"No features yet. Add a box or cylinder to begin."}),r.map((R,D)=>{const U=i[R.id],P=U?.state==="error",T=R.id===e,N=mC(R);return H.jsxs("li",{onClick:()=>l(R.id),className:`group flex cursor-pointer items-center gap-2 border-b border-neutral-800/60 px-3 py-2 text-sm ${T?"bg-blue-950/40":"hover:bg-neutral-800/50"}`,children:[H.jsx("span",{className:`inline-flex h-4 w-5 items-center justify-center rounded text-[10px] font-bold ${N.cls}`,title:Pv(R)?`Operation: ${R.operation}`:"Sketch",children:N.text}),H.jsxs("span",{className:`mr-auto truncate ${R.suppressed?"text-neutral-600 line-through":""} ${P?"text-red-400":""}`,title:P?U?.message:uC[R.type],children:[R.name,P&&" ⚠"]}),H.jsxs("div",{className:"flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100",children:[H.jsx(jc,{label:"Move up",disabled:D===0,onClick:z=>{z.stopPropagation(),m(R.id,-1)},children:"↑"}),H.jsx(jc,{label:"Move down",disabled:D===r.length-1,onClick:z=>{z.stopPropagation(),m(R.id,1)},children:"↓"}),H.jsx(jc,{label:R.suppressed?"Unsuppress":"Suppress",onClick:z=>{z.stopPropagation(),c(R.id)},children:R.suppressed?"◌":"●"}),H.jsx(jc,{label:"Delete",onClick:z=>{z.stopPropagation(),f(R.id)},children:"✕"})]})]},R.id)})]})]})}function jc({children:r,label:e,disabled:i,onClick:s}){return H.jsx("button",{type:"button",title:e,"aria-label":e,disabled:i,onClick:s,className:"flex h-5 w-5 items-center justify-center rounded text-xs text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100 disabled:opacity-20",children:r})}function _C(){const r=Ze(s=>s.selectedId),e=Ze(s=>s.tree.features.find(l=>l.id===r)),i=Ze(s=>r?s.statuses[r]:void 0);return e?H.jsxs("section",{className:"border-t border-neutral-800 bg-neutral-950/60 p-3",children:[H.jsxs("div",{className:"mb-2 flex items-center justify-between",children:[H.jsx("h2",{className:"text-xs font-medium uppercase tracking-wide text-neutral-500",children:e.name}),i?.state==="error"&&H.jsx("span",{className:"text-[10px] text-red-400",title:i.message,children:"regen failed"})]}),e.type==="sketch"?H.jsx(vC,{feature:e}):_h(e)?H.jsx(xC,{feature:e}):Iv(e)?H.jsx(SC,{feature:e}):H.jsx(yC,{feature:e}),_h(e)&&i?.state==="ok"&&i.message&&H.jsx("p",{className:"mt-3 text-[11px] text-neutral-500",children:i.message}),i?.state==="error"&&i.message&&H.jsx("p",{className:"mt-3 rounded border border-red-900 bg-red-950/40 p-2 text-[11px] text-red-300",children:i.message})]}):null}function vC({feature:r}){const e=Mn(c=>c.editExisting),{points:i,entities:s,constraints:l}=r.sketch;return H.jsxs("div",{className:"flex flex-col gap-2 text-xs text-neutral-400",children:[H.jsxs("div",{children:["Plane: ",r.planeId]}),H.jsxs("div",{children:[s.length," entities · ",i.length," points · ",l.length," ","constraints"]}),H.jsx("button",{type:"button",onClick:()=>e(r.id,r.sketch),className:"mt-1 rounded bg-neutral-800 px-2 py-1.5 text-neutral-200 hover:bg-neutral-700",children:"Edit sketch"})]})}function xC({feature:r}){const e=Ze(s=>s.updateParams),i=r.type==="fillet";return H.jsxs("div",{className:"flex flex-col gap-2",children:[H.jsxs("div",{className:"text-xs text-neutral-400",children:[r.edgeRefs.length," edge(s) referenced"]}),H.jsx(Ua,{children:i?"Fillet":"Chamfer"}),i?H.jsx(zi,{label:"radius",value:r.params.radius,min:.001,onChange:s=>e(r.id,{radius:s})}):H.jsx(zi,{label:"distance",value:r.params.distance,min:.001,onChange:s=>e(r.id,{distance:s})})]})}function SC({feature:r}){const e=Ze(l=>l.updateParams),i=Ze(l=>l.updateFeature),s=l=>i(r.id,{params:{...r.params,...l}});return r.type==="mirror"?H.jsxs("div",{className:"flex flex-col gap-2",children:[H.jsx(Ua,{children:"Mirror plane"}),H.jsx(gh,{options:["XY","XZ","YZ"],value:r.params.plane,onChange:l=>s({plane:l})}),H.jsxs("label",{className:"flex items-center justify-between gap-2 text-sm",children:[H.jsx("span",{className:"w-24 text-neutral-400",children:"keep original"}),H.jsx("input",{type:"checkbox",checked:r.params.keepOriginal,onChange:l=>e(r.id,{keepOriginal:l.target.checked}),className:"h-4 w-4 accent-blue-600"})]})]}):r.type==="linearPattern"?H.jsxs("div",{className:"flex flex-col gap-2",children:[H.jsx(Ua,{children:"Linear pattern"}),H.jsx(gh,{options:["x","y","z"],value:r.params.axis,onChange:l=>s({axis:l})}),H.jsx(zi,{label:"count",value:r.params.count,min:2,onChange:l=>e(r.id,{count:Math.round(l)})}),H.jsx(zi,{label:"spacing",value:r.params.spacing,onChange:l=>e(r.id,{spacing:l})})]}):H.jsxs("div",{className:"flex flex-col gap-2",children:[H.jsx(Ua,{children:"Circular pattern"}),H.jsx(gh,{options:["x","y","z"],value:r.params.axis,onChange:l=>s({axis:l})}),H.jsx(zi,{label:"count",value:r.params.count,min:2,onChange:l=>e(r.id,{count:Math.round(l)})}),H.jsx(zi,{label:"angle°",value:r.params.angle,onChange:l=>e(r.id,{angle:l})})]})}function gh({options:r,value:e,onChange:i}){return H.jsx("div",{className:"flex overflow-hidden rounded border border-neutral-700",children:r.map(s=>H.jsx("button",{type:"button",onClick:()=>i(s),className:`flex-1 px-2 py-1 text-xs uppercase transition ${e===s?"bg-blue-600 text-white":"bg-neutral-800 text-neutral-300 hover:bg-neutral-700"}`,children:s},s))})}function yC({feature:r}){return H.jsxs(H.Fragment,{children:[H.jsx(EC,{feature:r}),H.jsx("div",{className:"my-3 h-px bg-neutral-800"}),r.type==="extrude"?H.jsx(bC,{feature:r}):r.type==="linked"?H.jsx(MC,{feature:r}):H.jsxs(H.Fragment,{children:[H.jsx(TC,{feature:r}),H.jsx("div",{className:"my-3 h-px bg-neutral-800"}),H.jsx(AC,{feature:r})]})]})}function MC({feature:r}){const e=Ze(i=>i.updateReference);return H.jsxs("div",{className:"flex flex-col gap-2",children:[H.jsx(Ua,{children:"Linked reference"}),H.jsxs("div",{className:"text-xs text-neutral-400",children:["from ",r.sourceLabel]}),H.jsxs("div",{className:"text-[11px] text-neutral-500",children:[r.cachedTree.features.length," feature(s) cached · read-only, no live sync"]}),H.jsx("button",{type:"button",onClick:()=>e(r.id),className:"mt-1 rounded bg-neutral-800 px-2 py-1.5 text-neutral-200 hover:bg-neutral-700",children:"Update reference"})]})}function bC({feature:r}){const e=Ze(i=>i.updateParams);return H.jsxs("div",{className:"flex flex-col gap-2",children:[H.jsx(Ua,{children:"Extrude"}),H.jsx(zi,{label:"distance",value:r.params.distance,min:.001,onChange:i=>e(r.id,{distance:i})}),H.jsxs("label",{className:"flex items-center justify-between gap-2 text-sm",children:[H.jsx("span",{className:"w-14 text-neutral-400",children:"flip"}),H.jsx("input",{type:"checkbox",checked:r.params.flip,onChange:i=>e(r.id,{flip:i.target.checked}),className:"h-4 w-4 accent-blue-600"})]})]})}function EC({feature:r}){const e=Ze(s=>s.setOperation),i=["new","add","remove"];return H.jsxs("div",{className:"flex items-center gap-2",children:[H.jsx("span",{className:"w-16 text-xs text-neutral-400",children:"Operation"}),H.jsx("div",{className:"flex overflow-hidden rounded border border-neutral-700",children:i.map(s=>H.jsx("button",{type:"button",onClick:()=>e(r.id,s),className:`px-2 py-1 text-xs capitalize transition ${r.operation===s?"bg-blue-600 text-white":"bg-neutral-800 text-neutral-300 hover:bg-neutral-700"}`,children:s},s))})]})}function TC({feature:r}){const e=Ze(s=>s.updateParams);if(r.type==="box"){const s=r;return H.jsxs("div",{className:"flex flex-col gap-2",children:[H.jsx(Ua,{children:"Dimensions"}),["dx","dy","dz"].map(l=>H.jsx(zi,{label:l,value:s.params[l],min:.001,onChange:c=>e(r.id,{[l]:c})},l))]})}const i=r;return H.jsxs("div",{className:"flex flex-col gap-2",children:[H.jsx(Ua,{children:"Dimensions"}),H.jsx(zi,{label:"radius",value:i.params.radius,min:.001,onChange:s=>e(r.id,{radius:s})}),H.jsx(zi,{label:"height",value:i.params.height,min:.001,onChange:s=>e(r.id,{height:s})})]})}function AC({feature:r}){const e=Ze(i=>i.updateFeature);return H.jsxs("div",{className:"flex flex-col gap-2",children:[H.jsx(Ua,{children:"Position"}),["x","y","z"].map(i=>H.jsx(zi,{label:i,value:r.position[i],onChange:s=>e(r.id,{position:{...r.position,[i]:s}})},i))]})}function Ua({children:r}){return H.jsx("span",{className:"text-[11px] font-medium uppercase tracking-wide text-neutral-500",children:r})}function zi({label:r,value:e,min:i,onChange:s}){return H.jsxs("label",{className:"flex items-center justify-between gap-2 text-sm",children:[H.jsx("span",{className:"w-14 text-neutral-400",children:r}),H.jsx("input",{type:"number",step:"any",min:i,value:e,onChange:l=>{const c=Number(l.target.value);Number.isFinite(c)&&s(c)},className:"w-full rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-right text-neutral-100 outline-none focus:border-blue-500"})]})}const RC=[{id:"XY",label:"Top (XY)"},{id:"XZ",label:"Front (XZ)"},{id:"YZ",label:"Right (YZ)"}];function CC(){const r=Mn(e=>e.enterSketch);return H.jsxs("section",{className:"border-t border-neutral-800 p-3",children:[H.jsx("h2",{className:"mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500",children:"New sketch"}),H.jsx("div",{className:"flex gap-1",children:RC.map(e=>H.jsx("button",{type:"button",onClick:()=>r(e.id),className:"flex-1 rounded bg-neutral-800 px-2 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700",children:e.label},e.id))})]})}function wC(){const r=Ze(M=>M.doc.name),e=Ze(M=>M.lastSavedAt),i=Ze(M=>M.busy),s=Ze(M=>M.renameDoc),l=Ze(M=>M.newDoc),c=Ze(M=>M.loadDoc),f=Ze(M=>M.exportModel),m=Ze(M=>M.undo),h=Ze(M=>M.redo),d=Ze(M=>M.canUndo),g=Ze(M=>M.canRedo),[_,v]=jt.useState(null),y=async()=>{v(_?null:await fp())};return H.jsxs("div",{className:"flex items-center gap-2 border-b border-neutral-800 bg-neutral-950 px-3 py-2 text-sm",children:[H.jsx("input",{value:r,onChange:M=>s(M.target.value),className:"w-48 rounded border border-transparent bg-transparent px-2 py-1 text-neutral-100 hover:border-neutral-700 focus:border-blue-500 focus:outline-none","aria-label":"Document name"}),H.jsx("span",{className:"text-[11px] text-neutral-500",children:i?"…":e?"saved":"unsaved"}),H.jsxs("div",{className:"ml-auto flex items-center gap-1",children:[H.jsx("button",{type:"button",onClick:m,disabled:!d,title:"Undo (Ctrl/Cmd+Z)",className:"rounded bg-neutral-800 px-2 py-1 text-xs hover:bg-neutral-700 disabled:opacity-30",children:"↶"}),H.jsx("button",{type:"button",onClick:h,disabled:!g,title:"Redo (Ctrl/Cmd+Shift+Z)",className:"rounded bg-neutral-800 px-2 py-1 text-xs hover:bg-neutral-700 disabled:opacity-30",children:"↷"}),H.jsx("div",{className:"mx-1 h-5 w-px bg-neutral-700"}),H.jsx("button",{type:"button",onClick:l,className:"rounded bg-neutral-800 px-2 py-1 text-xs hover:bg-neutral-700",children:"New"}),H.jsxs("div",{className:"relative",children:[H.jsx("button",{type:"button",onClick:()=>{y()},className:"rounded bg-neutral-800 px-2 py-1 text-xs hover:bg-neutral-700",children:"Open ▾"}),_&&H.jsxs("div",{className:"absolute right-0 z-10 mt-1 max-h-72 w-64 overflow-y-auto rounded border border-neutral-700 bg-neutral-900 shadow-lg",children:[_.length===0&&H.jsx("div",{className:"px-3 py-2 text-xs text-neutral-500",children:"No saved documents"}),_.map(M=>H.jsxs("button",{type:"button",onClick:()=>{c(M.id),v(null)},className:"flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-neutral-800",children:[H.jsx("span",{className:"truncate text-neutral-200",children:M.name}),H.jsx("span",{className:"ml-2 shrink-0 text-neutral-500",children:new Date(M.updatedAt).toLocaleDateString()})]},M.id))]})]}),H.jsx("div",{className:"mx-1 h-5 w-px bg-neutral-700"}),H.jsx("button",{type:"button",onClick:()=>{f("step")},className:"rounded bg-neutral-800 px-2 py-1 text-xs hover:bg-neutral-700",children:"Export STEP"}),H.jsx("button",{type:"button",onClick:()=>{f("stl")},className:"rounded bg-neutral-800 px-2 py-1 text-xs hover:bg-neutral-700",children:"Export STL"})]})]})}function DC(){const r=Ze(h=>h.doc.tabs),e=Ze(h=>h.doc.activeTabId),i=Ze(h=>h.setActiveTab),s=Ze(h=>h.addTab),l=Ze(h=>h.renameTab),c=Ze(h=>h.deleteTab),[f,m]=jt.useState(null);return H.jsxs("div",{className:"flex items-center gap-1 border-b border-neutral-800 bg-neutral-950 px-2 py-1",children:[r.map(h=>{const d=h.id===e;return H.jsxs("div",{onClick:()=>i(h.id),onDoubleClick:()=>m(h.id),className:`group flex items-center gap-1 rounded-t px-3 py-1 text-xs ${d?"bg-neutral-800 text-neutral-100":"cursor-pointer bg-neutral-900 text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"}`,children:[f===h.id?H.jsx("input",{autoFocus:!0,defaultValue:h.name,onBlur:g=>{l(h.id,g.target.value.trim()||h.name),m(null)},onKeyDown:g=>{g.key==="Enter"&&g.target.blur(),g.key==="Escape"&&m(null)},onClick:g=>g.stopPropagation(),className:"w-28 rounded border border-blue-500 bg-neutral-900 px-1 text-neutral-100 outline-none"}):H.jsx("span",{className:"max-w-40 truncate",children:h.name}),r.length>1&&f!==h.id&&H.jsx("button",{type:"button",title:"Delete Part Studio","aria-label":`Delete ${h.name}`,onClick:g=>{g.stopPropagation(),window.confirm(`Delete "${h.name}"? This removes its feature tree.`)&&c(h.id)},className:"ml-1 text-neutral-600 opacity-0 transition hover:text-red-400 group-hover:opacity-100",children:"✕"})]},h.id)}),H.jsx("button",{type:"button",onClick:s,title:"New Part Studio",className:"rounded px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100",children:"+"})]})}function NC(){const r=Ze(h=>h.doc),e=Ze(h=>h.viewingVersionId),i=Ze(h=>h.createVersion),s=Ze(h=>h.openVersion),l=Ze(h=>h.exitVersionView),c=Ze(h=>h.restoreVersion),f=r.tabs.find(h=>h.id===r.activeTabId)??r.tabs[0],m=jy(f.history).slice().reverse();return H.jsxs("section",{className:"border-t border-neutral-800 p-3",children:[H.jsxs("div",{className:"mb-2 flex items-center justify-between",children:[H.jsx("h2",{className:"text-[11px] font-medium uppercase tracking-wide text-neutral-500",children:"Versions"}),H.jsx("button",{type:"button",onClick:()=>i(),className:"rounded bg-neutral-800 px-2 py-1 text-[11px] text-neutral-200 hover:bg-neutral-700",children:"+ Create version"})]}),e&&H.jsxs("div",{className:"mb-2 flex items-center justify-between rounded border border-amber-700 bg-amber-950/60 px-2 py-1 text-[11px] text-amber-200",children:[H.jsx("span",{children:"Viewing a past version (read-only)"}),H.jsx("button",{type:"button",onClick:l,className:"rounded bg-amber-800 px-1.5 py-0.5 text-amber-100 hover:bg-amber-700",children:"Exit"})]}),m.length===0?H.jsx("p",{className:"text-[11px] text-neutral-600",children:"No versions yet. Create one to snapshot the current state."}):H.jsx("ul",{className:"flex flex-col gap-1",children:m.map(h=>{const d=h.id===e;return H.jsxs("li",{className:`flex items-center gap-2 rounded border px-2 py-1 text-xs ${d?"border-amber-700 bg-amber-950/40":"border-neutral-800 bg-neutral-900"}`,children:[H.jsxs("div",{className:"mr-auto min-w-0",children:[H.jsx("div",{className:"truncate text-neutral-200",children:h.name}),H.jsx("div",{className:"text-[10px] text-neutral-500",children:new Date(h.createdAt).toLocaleString()})]}),H.jsx("button",{type:"button",onClick:()=>s(h.id),className:"rounded px-1.5 py-0.5 text-[11px] text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100",title:"Open read-only",children:"Open"}),H.jsx("button",{type:"button",onClick:()=>c(h.id),className:"rounded px-1.5 py-0.5 text-[11px] text-blue-400 hover:bg-neutral-800 hover:text-blue-300",title:"Restore (non-destructive fork)",children:"Restore"})]},h.id)})})]})}function UC(){const r=Mn(D=>D.sketch),e=Mn(D=>D.tool),i=Mn(D=>D.selectedPoints),s=Mn(D=>D.selectedEntities),l=Mn(D=>D.clickAt),c=Mn(D=>D.dragPoint),f=Mn(D=>D.selectPoint),m=Mn(D=>D.selectEntity),h=jt.useRef(null),[d,g]=jt.useState({w:800,h:600}),[_,v]=jt.useState({scale:8,px:0,py:0}),y=jt.useRef(null),M=jt.useRef(null);jt.useEffect(()=>{const D=h.current;if(!D)return;const U=new ResizeObserver(()=>{const P=D.getBoundingClientRect();g({w:P.width,h:P.height})});return U.observe(D),()=>U.disconnect()},[]);const w=jt.useCallback((D,U)=>{const P=d.w/2+(D-_.px)*_.scale,T=d.h/2-(U-_.py)*_.scale;return[P,T]},[d,_]),b=jt.useCallback((D,U)=>{const P=(D-d.w/2)/_.scale+_.px,T=-(U-d.h/2)/_.scale+_.py;return[P,T]},[d,_]),x=jt.useCallback(D=>{const U=h.current.getBoundingClientRect();return b(D.clientX-U.left,D.clientY-U.top)},[b]);jt.useEffect(()=>{const D=P=>{if(y.current){const[T,N]=x(P);c(y.current.pointId,T,N)}else if(M.current){const T=P.clientX-M.current.x,N=P.clientY-M.current.y;v(z=>({...z,px:M.current.px-T/z.scale,py:M.current.py+N/z.scale}))}},U=()=>{y.current=null,M.current=null};return window.addEventListener("mousemove",D),window.addEventListener("mouseup",U),()=>{window.removeEventListener("mousemove",D),window.removeEventListener("mouseup",U)}},[c,x]);const I=D=>{const U=h.current.getBoundingClientRect(),[P,T]=b(D.clientX-U.left,D.clientY-U.top),N=D.deltaY<0?1.1:1/1.1;v(z=>{const q=Math.max(.5,Math.min(200,z.scale*N)),$=D.clientX-U.left,j=D.clientY-U.top,X=P-($-d.w/2)/q,te=T+(j-d.h/2)/q;return{scale:q,px:X,py:te}})},G=(D,U)=>{if(!r)return null;const P=8/_.scale;let T=null,N=P;for(const z of r.points){const q=Math.hypot(z.u-D,z.v-U);q<N&&(N=q,T=z.id)}return T},R=D=>{if(D.button===1||D.button===0&&D.altKey){M.current={x:D.clientX,y:D.clientY,px:_.px,py:_.py},D.preventDefault();return}if(D.button!==0||!r)return;const[U,P]=x(D),T=G(U,P);e==="select"?T?(f(T,D.shiftKey),y.current={pointId:T}):l(U,P,null):l(U,P,T)};return r?H.jsxs("svg",{ref:h,className:"h-full w-full cursor-crosshair select-none bg-neutral-900",onMouseDown:R,onWheel:I,children:[H.jsx(LC,{size:d,view:_,toScreen:w}),H.jsx(OC,{sketch:r,toScreen:w,selectedPoints:i,selectedEntities:s,onEntityClick:(D,U)=>{e==="select"&&m(D,U)}})]}):null}function LC({size:r,view:e,toScreen:i}){let s=1;for(;s*e.scale<40;)s*=5;for(;s*e.scale>200;)s/=5;const[l,c]=[e.px-r.w/2/e.scale,e.py+r.h/2/e.scale],[f,m]=[e.px+r.w/2/e.scale,e.py-r.h/2/e.scale],h=[],d=Math.floor(l/s)*s;for(let _=d;_<=f;_+=s){const[v]=i(_,0),y=Math.abs(_)<1e-9;h.push(H.jsx("line",{x1:v,y1:0,x2:v,y2:r.h,stroke:y?"#3b6ea5":"#2a2a2a",strokeWidth:y?1.5:1},`u${_}`))}const g=Math.floor(m/s)*s;for(let _=g;_<=c;_+=s){const[,v]=i(0,_),y=Math.abs(_)<1e-9;h.push(H.jsx("line",{x1:0,y1:v,x2:r.w,y2:v,stroke:y?"#a53b3b":"#2a2a2a",strokeWidth:y?1.5:1},`v${_}`))}return H.jsx("g",{children:h})}function OC({sketch:r,toScreen:e,selectedPoints:i,selectedEntities:s,onEntityClick:l}){const c=f=>r.points.find(m=>m.id===f);return H.jsxs("g",{children:[r.entities.map(f=>{const m=s.includes(f.id),h=m?"#facc15":"#d4d4d4",d=m?2.5:1.75,g=w=>{w.stopPropagation(),l(f.id,w.shiftKey)};if(f.type==="line"){const w=f,b=c(w.p1),x=c(w.p2);if(!b||!x)return null;const[I,G]=e(b.u,b.v),[R,D]=e(x.u,x.v);return H.jsx("line",{x1:I,y1:G,x2:R,y2:D,stroke:h,strokeWidth:d,className:"cursor-pointer",onMouseDown:g},f.id)}if(f.type==="circle"){const w=f,b=c(w.center);if(!b)return null;const[x,I]=e(b.u,b.v),[G]=e(b.u+w.radius,b.v),R=Math.abs(G-x);return H.jsx("circle",{cx:x,cy:I,r:R,fill:"none",stroke:h,strokeWidth:d,className:"cursor-pointer",onMouseDown:g},f.id)}const _=f,v=c(_.center),y=c(_.start),M=c(_.end);return!v||!y||!M?null:H.jsx(PC,{center:v,start:y,end:M,toScreen:e,stroke:h,strokeWidth:d,onMouseDown:g},f.id)}),r.points.map(f=>{const[m,h]=e(f.u,f.v),d=i.includes(f.id);return H.jsx("circle",{cx:m,cy:h,r:d?5:3.5,fill:f.fixed?"#6b7280":d?"#facc15":"#4a90d9",stroke:"#111",strokeWidth:1},f.id)})]})}function PC({center:r,start:e,end:i,toScreen:s,stroke:l,strokeWidth:c,onMouseDown:f}){const m=Math.hypot(e.u-r.u,e.v-r.v),[h,d]=s(e.u,e.v),[g,_]=s(i.u,i.v),[v]=s(r.u,r.v),[y]=s(r.u+m,r.v),M=Math.abs(y-v),w=Math.atan2(e.v-r.v,e.u-r.u);let x=Math.atan2(i.v-r.v,i.u-r.u)-w;for(;x<=0;)x+=2*Math.PI;const I=x>Math.PI?1:0,R=`M ${h} ${d} A ${M} ${M} 0 ${I} 0 ${g} ${_}`;return H.jsx("path",{d:R,fill:"none",stroke:l,strokeWidth:c,className:"cursor-pointer",onMouseDown:f})}const IC=[{id:"select",label:"Select",hint:"Select / drag points (V)"},{id:"line",label:"Line",hint:"Click to chain line segments"},{id:"circle",label:"Circle",hint:"Click center, then radius"},{id:"arc",label:"Arc",hint:"Click center, start, end"}],FC=[{type:"coincident",label:"Coincident"},{type:"horizontal",label:"Horizontal"},{type:"vertical",label:"Vertical"},{type:"parallel",label:"Parallel"},{type:"perpendicular",label:"Perpendicular"},{type:"equalLength",label:"Equal"}],BC=[{type:"distance",label:"Distance",prompt:"Distance value:"},{type:"angle",label:"Angle",prompt:"Angle (degrees):"},{type:"radius",label:"Radius",prompt:"Radius value:"}];function zC(){const r=Mn(M=>M.tool),e=Mn(M=>M.setTool),i=Mn(M=>M.exitSketch),s=Mn(M=>M.finish),l=Mn(M=>M.addConstraint),c=Mn(M=>M.deleteSelected),f=Mn(M=>M.lastSolve),m=Mn(M=>M.sketch?.planeId),h=Ze(M=>M.addSketchFeature),d=Ze(M=>M.updateSketch),[g,_]=jt.useState(null),v=()=>{const M=s();M&&(M.editingFeatureId?d(M.editingFeatureId,M.sketch):h(M.sketch))},y=(M,w)=>{let b;if(w){const I=window.prompt(w);if(I===null)return;if(b=Number(I),!Number.isFinite(b)){_("Invalid number");return}}const x=l(M,b);_(x??`Applied ${M}`)};return H.jsxs("div",{className:"flex flex-col gap-2 border-b border-neutral-800 bg-neutral-900 p-2",children:[H.jsxs("div",{className:"flex items-center gap-1",children:[H.jsxs("span",{className:"mr-2 text-xs font-semibold text-neutral-400",children:["Sketch · ",m]}),IC.map(M=>H.jsx("button",{type:"button",title:M.hint,onClick:()=>e(M.id),className:`rounded px-2 py-1 text-xs transition ${r===M.id?"bg-blue-600 text-white":"bg-neutral-800 text-neutral-300 hover:bg-neutral-700"}`,children:M.label},M.id)),H.jsx("div",{className:"mx-1 h-5 w-px bg-neutral-700"}),H.jsx("button",{type:"button",onClick:c,className:"rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-300 hover:bg-red-900",children:"Delete"}),H.jsx("button",{type:"button",onClick:i,className:"ml-auto rounded bg-neutral-800 px-3 py-1 text-xs text-neutral-300 hover:bg-neutral-700",children:"Cancel"}),H.jsx("button",{type:"button",onClick:v,className:"rounded bg-green-700 px-3 py-1 text-xs font-medium text-white hover:bg-green-600",children:"✓ Finish sketch"})]}),H.jsxs("div",{className:"flex flex-wrap items-center gap-1",children:[H.jsx("span",{className:"mr-1 text-[11px] uppercase tracking-wide text-neutral-500",children:"Constrain"}),FC.map(M=>H.jsx("button",{type:"button",onClick:()=>y(M.type),className:"rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-700",children:M.label},M.type)),H.jsx("div",{className:"mx-1 h-5 w-px bg-neutral-700"}),BC.map(M=>H.jsxs("button",{type:"button",onClick:()=>y(M.type,M.prompt),className:"rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-700",children:[M.label,"…"]},M.type))]}),H.jsxs("div",{className:"flex items-center justify-between text-[11px]",children:[H.jsx("span",{className:"text-neutral-500",children:g}),f&&H.jsx("span",{className:f.converged?"text-green-500":"text-yellow-500",title:`max residual ${f.residual.toExponential(2)}`,children:f.converged?"solved":"under/over-constrained"})]})]})}function HC(){const r=Ze(f=>f.ready),e=Ze(f=>f.busy),i=Ze(f=>f.error),s=Ze(f=>f.initKernel),l=Ze(f=>f.restoreLast),c=Mn(f=>f.sketch!==null);return jt.useEffect(()=>{s().then(()=>l())},[s,l]),jt.useEffect(()=>{const f=m=>{if(c)return;const h=m.target;if(h&&(h.tagName==="INPUT"||h.tagName==="TEXTAREA"))return;const d=Ze.getState();if(m.key==="Escape"){d.viewingVersionId!==null?d.exitVersionView():d.selectedEdgeRefs.length>0&&d.setSelectedEdges([]);return}if(m.key==="Delete"||m.key==="Backspace"){d.selectedId&&(m.preventDefault(),d.deleteFeature(d.selectedId));return}if(!(m.metaKey||m.ctrlKey))return;const _=m.key.toLowerCase();_==="z"&&!m.shiftKey?(m.preventDefault(),d.undo()):(_==="z"&&m.shiftKey||_==="y")&&(m.preventDefault(),d.redo())};return window.addEventListener("keydown",f),()=>window.removeEventListener("keydown",f)},[c]),H.jsx("div",{className:"flex h-full w-full flex-col",children:c?H.jsxs(H.Fragment,{children:[H.jsx(zC,{}),H.jsx("div",{className:"min-h-0 flex-1",children:H.jsx(UC,{})})]}):H.jsxs(H.Fragment,{children:[H.jsx(wC,{}),H.jsx(DC,{}),H.jsxs("div",{className:"flex min-h-0 flex-1",children:[H.jsxs("aside",{className:"flex w-80 flex-col border-r border-neutral-800 bg-neutral-900",children:[H.jsxs("header",{className:"flex items-center justify-between border-b border-neutral-800 px-4 py-3",children:[H.jsx("h1",{className:"text-lg font-semibold tracking-tight",children:"myCAD"}),H.jsxs("div",{className:"flex items-center gap-2 text-xs",children:[H.jsx("span",{className:`inline-block h-2 w-2 rounded-full ${e?"bg-yellow-500":r?"bg-green-500":"bg-neutral-600"}`}),H.jsx("span",{className:"text-neutral-400",children:e?"Working…":r?"Ready":"Offline"})]})]}),H.jsxs("div",{className:"min-h-0 flex-1 overflow-y-auto",children:[H.jsx(gC,{}),H.jsx(_C,{}),H.jsx(CC,{}),H.jsx(NC,{})]}),i&&H.jsx("div",{className:"m-3 rounded border border-red-800 bg-red-950/50 p-2 text-xs text-red-300",children:i})]}),H.jsx("main",{className:"relative flex-1",children:H.jsx(oC,{})})]})]})})}Py.createRoot(document.getElementById("root")).render(H.jsx(jt.StrictMode,{children:H.jsx(HC,{})}));
