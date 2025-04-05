var T;(function(t){t.STRING="string",t.NUMBER="number",t.INTEGER="integer",t.BOOLEAN="boolean",t.ARRAY="array",t.OBJECT="object"})(T||(T={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var N;(function(t){t.LANGUAGE_UNSPECIFIED="language_unspecified",t.PYTHON="python"})(N||(N={}));var w;(function(t){t.OUTCOME_UNSPECIFIED="outcome_unspecified",t.OUTCOME_OK="outcome_ok",t.OUTCOME_FAILED="outcome_failed",t.OUTCOME_DEADLINE_EXCEEDED="outcome_deadline_exceeded"})(w||(w={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b=["user","model","function","system"];var M;(function(t){t.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",t.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",t.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",t.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",t.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",t.HARM_CATEGORY_CIVIC_INTEGRITY="HARM_CATEGORY_CIVIC_INTEGRITY"})(M||(M={}));var L;(function(t){t.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",t.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",t.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",t.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",t.BLOCK_NONE="BLOCK_NONE"})(L||(L={}));var D;(function(t){t.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",t.NEGLIGIBLE="NEGLIGIBLE",t.LOW="LOW",t.MEDIUM="MEDIUM",t.HIGH="HIGH"})(D||(D={}));var G;(function(t){t.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",t.SAFETY="SAFETY",t.OTHER="OTHER"})(G||(G={}));var O;(function(t){t.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",t.STOP="STOP",t.MAX_TOKENS="MAX_TOKENS",t.SAFETY="SAFETY",t.RECITATION="RECITATION",t.LANGUAGE="LANGUAGE",t.BLOCKLIST="BLOCKLIST",t.PROHIBITED_CONTENT="PROHIBITED_CONTENT",t.SPII="SPII",t.MALFORMED_FUNCTION_CALL="MALFORMED_FUNCTION_CALL",t.OTHER="OTHER"})(O||(O={}));var x;(function(t){t.TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",t.RETRIEVAL_QUERY="RETRIEVAL_QUERY",t.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",t.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",t.CLASSIFICATION="CLASSIFICATION",t.CLUSTERING="CLUSTERING"})(x||(x={}));var U;(function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.AUTO="AUTO",t.ANY="ANY",t.NONE="NONE"})(U||(U={}));var H;(function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.MODE_DYNAMIC="MODE_DYNAMIC"})(H||(H={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class u extends Error{constructor(e){super(`[GoogleGenerativeAI Error]: ${e}`)}}class I extends u{constructor(e,n){super(e),this.response=n}}class q extends u{constructor(e,n,o,s){super(e),this.status=n,this.statusText=o,this.errorDetails=s}}class E extends u{}class P extends u{}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Q="https://generativelanguage.googleapis.com",z="v1beta",Z="0.24.0",tt="genai-js";var _;(function(t){t.GENERATE_CONTENT="generateContent",t.STREAM_GENERATE_CONTENT="streamGenerateContent",t.COUNT_TOKENS="countTokens",t.EMBED_CONTENT="embedContent",t.BATCH_EMBED_CONTENTS="batchEmbedContents"})(_||(_={}));class et{constructor(e,n,o,s,i){this.model=e,this.task=n,this.apiKey=o,this.stream=s,this.requestOptions=i}toString(){var e,n;const o=((e=this.requestOptions)===null||e===void 0?void 0:e.apiVersion)||z;let i=`${((n=this.requestOptions)===null||n===void 0?void 0:n.baseUrl)||Q}/${o}/${this.model}:${this.task}`;return this.stream&&(i+="?alt=sse"),i}}function nt(t){const e=[];return t?.apiClient&&e.push(t.apiClient),e.push(`${tt}/${Z}`),e.join(" ")}async function ot(t){var e;const n=new Headers;n.append("Content-Type","application/json"),n.append("x-goog-api-client",nt(t.requestOptions)),n.append("x-goog-api-key",t.apiKey);let o=(e=t.requestOptions)===null||e===void 0?void 0:e.customHeaders;if(o){if(!(o instanceof Headers))try{o=new Headers(o)}catch(s){throw new E(`unable to convert customHeaders value ${JSON.stringify(o)} to Headers: ${s.message}`)}for(const[s,i]of o.entries()){if(s==="x-goog-api-key")throw new E(`Cannot set reserved header name ${s}`);if(s==="x-goog-api-client")throw new E(`Header name ${s} can only be set using the apiClient field`);n.append(s,i)}}return n}async function st(t,e,n,o,s,i){const r=new et(t,e,n,o,i);return{url:r.toString(),fetchOptions:Object.assign(Object.assign({},ct(i)),{method:"POST",headers:await ot(r),body:s})}}async function m(t,e,n,o,s,i={},r=fetch){const{url:a,fetchOptions:c}=await st(t,e,n,o,s,i);return it(a,c,r)}async function it(t,e,n=fetch){let o;try{o=await n(t,e)}catch(s){rt(s,t)}return o.ok||await at(o,t),o}function rt(t,e){let n=t;throw n.name==="AbortError"?(n=new P(`Request aborted when fetching ${e.toString()}: ${t.message}`),n.stack=t.stack):t instanceof q||t instanceof E||(n=new u(`Error fetching from ${e.toString()}: ${t.message}`),n.stack=t.stack),n}async function at(t,e){let n="",o;try{const s=await t.json();n=s.error.message,s.error.details&&(n+=` ${JSON.stringify(s.error.details)}`,o=s.error.details)}catch{}throw new q(`Error fetching from ${e.toString()}: [${t.status} ${t.statusText}] ${n}`,t.status,t.statusText,o)}function ct(t){const e={};if(t?.signal!==void 0||t?.timeout>=0){const n=new AbortController;t?.timeout>=0&&setTimeout(()=>n.abort(),t.timeout),t?.signal&&t.signal.addEventListener("abort",()=>{n.abort()}),e.signal=n.signal}return e}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function S(t){return t.text=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),A(t.candidates[0]))throw new I(`${g(t)}`,t);return dt(t)}else if(t.promptFeedback)throw new I(`Text not available. ${g(t)}`,t);return""},t.functionCall=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),A(t.candidates[0]))throw new I(`${g(t)}`,t);return console.warn("response.functionCall() is deprecated. Use response.functionCalls() instead."),F(t)[0]}else if(t.promptFeedback)throw new I(`Function call not available. ${g(t)}`,t)},t.functionCalls=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),A(t.candidates[0]))throw new I(`${g(t)}`,t);return F(t)}else if(t.promptFeedback)throw new I(`Function call not available. ${g(t)}`,t)},t}function dt(t){var e,n,o,s;const i=[];if(!((n=(e=t.candidates)===null||e===void 0?void 0:e[0].content)===null||n===void 0)&&n.parts)for(const r of(s=(o=t.candidates)===null||o===void 0?void 0:o[0].content)===null||s===void 0?void 0:s.parts)r.text&&i.push(r.text),r.executableCode&&i.push("\n```"+r.executableCode.language+`
`+r.executableCode.code+"\n```\n"),r.codeExecutionResult&&i.push("\n```\n"+r.codeExecutionResult.output+"\n```\n");return i.length>0?i.join(""):""}function F(t){var e,n,o,s;const i=[];if(!((n=(e=t.candidates)===null||e===void 0?void 0:e[0].content)===null||n===void 0)&&n.parts)for(const r of(s=(o=t.candidates)===null||o===void 0?void 0:o[0].content)===null||s===void 0?void 0:s.parts)r.functionCall&&i.push(r.functionCall);if(i.length>0)return i}const lt=[O.RECITATION,O.SAFETY,O.LANGUAGE];function A(t){return!!t.finishReason&&lt.includes(t.finishReason)}function g(t){var e,n,o;let s="";if((!t.candidates||t.candidates.length===0)&&t.promptFeedback)s+="Response was blocked",!((e=t.promptFeedback)===null||e===void 0)&&e.blockReason&&(s+=` due to ${t.promptFeedback.blockReason}`),!((n=t.promptFeedback)===null||n===void 0)&&n.blockReasonMessage&&(s+=`: ${t.promptFeedback.blockReasonMessage}`);else if(!((o=t.candidates)===null||o===void 0)&&o[0]){const i=t.candidates[0];A(i)&&(s+=`Candidate was blocked due to ${i.finishReason}`,i.finishMessage&&(s+=`: ${i.finishMessage}`))}return s}function R(t){return this instanceof R?(this.v=t,this):new R(t)}function ut(t,e,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var o=n.apply(t,e||[]),s,i=[];return s={},r("next"),r("throw"),r("return"),s[Symbol.asyncIterator]=function(){return this},s;function r(d){o[d]&&(s[d]=function(l){return new Promise(function(f,v){i.push([d,l,f,v])>1||a(d,l)})})}function a(d,l){try{c(o[d](l))}catch(f){p(i[0][3],f)}}function c(d){d.value instanceof R?Promise.resolve(d.value.v).then(h,C):p(i[0][2],d)}function h(d){a("next",d)}function C(d){a("throw",d)}function p(d,l){d(l),i.shift(),i.length&&a(i[0][0],i[0][1])}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;function ft(t){const e=t.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),n=Et(e),[o,s]=n.tee();return{stream:gt(o),response:ht(s)}}async function ht(t){const e=[],n=t.getReader();for(;;){const{done:o,value:s}=await n.read();if(o)return S(Ct(e));e.push(s)}}function gt(t){return ut(this,arguments,function*(){const n=t.getReader();for(;;){const{value:o,done:s}=yield R(n.read());if(s)break;yield yield R(S(o))}})}function Et(t){const e=t.getReader();return new ReadableStream({start(o){let s="";return i();function i(){return e.read().then(({value:r,done:a})=>{if(a){if(s.trim()){o.error(new u("Failed to parse stream"));return}o.close();return}s+=r;let c=s.match($),h;for(;c;){try{h=JSON.parse(c[1])}catch{o.error(new u(`Error parsing JSON response: "${c[1]}"`));return}o.enqueue(h),s=s.substring(c[0].length),c=s.match($)}return i()}).catch(r=>{let a=r;throw a.stack=r.stack,a.name==="AbortError"?a=new P("Request aborted when reading from the stream"):a=new u("Error reading from the stream"),a})}}})}function Ct(t){const e=t[t.length-1],n={promptFeedback:e?.promptFeedback};for(const o of t){if(o.candidates){let s=0;for(const i of o.candidates)if(n.candidates||(n.candidates=[]),n.candidates[s]||(n.candidates[s]={index:s}),n.candidates[s].citationMetadata=i.citationMetadata,n.candidates[s].groundingMetadata=i.groundingMetadata,n.candidates[s].finishReason=i.finishReason,n.candidates[s].finishMessage=i.finishMessage,n.candidates[s].safetyRatings=i.safetyRatings,i.content&&i.content.parts){n.candidates[s].content||(n.candidates[s].content={role:i.content.role||"user",parts:[]});const r={};for(const a of i.content.parts)a.text&&(r.text=a.text),a.functionCall&&(r.functionCall=a.functionCall),a.executableCode&&(r.executableCode=a.executableCode),a.codeExecutionResult&&(r.codeExecutionResult=a.codeExecutionResult),Object.keys(r).length===0&&(r.text=""),n.candidates[s].content.parts.push(r)}s++}o.usageMetadata&&(n.usageMetadata=o.usageMetadata)}return n}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function V(t,e,n,o){const s=await m(e,_.STREAM_GENERATE_CONTENT,t,!0,JSON.stringify(n),o);return ft(s)}async function J(t,e,n,o){const i=await(await m(e,_.GENERATE_CONTENT,t,!1,JSON.stringify(n),o)).json();return{response:S(i)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function W(t){if(t!=null){if(typeof t=="string")return{role:"system",parts:[{text:t}]};if(t.text)return{role:"system",parts:[t]};if(t.parts)return t.role?t:{role:"system",parts:t.parts}}}function y(t){let e=[];if(typeof t=="string")e=[{text:t}];else for(const n of t)typeof n=="string"?e.push({text:n}):e.push(n);return _t(e)}function _t(t){const e={role:"user",parts:[]},n={role:"function",parts:[]};let o=!1,s=!1;for(const i of t)"functionResponse"in i?(n.parts.push(i),s=!0):(e.parts.push(i),o=!0);if(o&&s)throw new u("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");if(!o&&!s)throw new u("No content is provided for sending chat message.");return o?e:n}function pt(t,e){var n;let o={model:e?.model,generationConfig:e?.generationConfig,safetySettings:e?.safetySettings,tools:e?.tools,toolConfig:e?.toolConfig,systemInstruction:e?.systemInstruction,cachedContent:(n=e?.cachedContent)===null||n===void 0?void 0:n.name,contents:[]};const s=t.generateContentRequest!=null;if(t.contents){if(s)throw new E("CountTokensRequest must have one of contents or generateContentRequest, not both.");o.contents=t.contents}else if(s)o=Object.assign(Object.assign({},o),t.generateContentRequest);else{const i=y(t);o.contents=[i]}return{generateContentRequest:o}}function j(t){let e;return t.contents?e=t:e={contents:[y(t)]},t.systemInstruction&&(e.systemInstruction=W(t.systemInstruction)),e}function vt(t){return typeof t=="string"||Array.isArray(t)?{content:y(t)}:t}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const K=["text","inlineData","functionCall","functionResponse","executableCode","codeExecutionResult"],It={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall","executableCode","codeExecutionResult"],system:["text"]};function Ot(t){let e=!1;for(const n of t){const{role:o,parts:s}=n;if(!e&&o!=="user")throw new u(`First content should be with role 'user', got ${o}`);if(!b.includes(o))throw new u(`Each item should include role field. Got ${o} but valid roles are: ${JSON.stringify(b)}`);if(!Array.isArray(s))throw new u("Content should have 'parts' property with an array of Parts");if(s.length===0)throw new u("Each Content should have at least one part");const i={text:0,inlineData:0,functionCall:0,functionResponse:0,fileData:0,executableCode:0,codeExecutionResult:0};for(const a of s)for(const c of K)c in a&&(i[c]+=1);const r=It[o];for(const a of K)if(!r.includes(a)&&i[a]>0)throw new u(`Content with role '${o}' can't contain '${a}' part`);e=!0}}function Y(t){var e;if(t.candidates===void 0||t.candidates.length===0)return!1;const n=(e=t.candidates[0])===null||e===void 0?void 0:e.content;if(n===void 0||n.parts===void 0||n.parts.length===0)return!1;for(const o of n.parts)if(o===void 0||Object.keys(o).length===0||o.text!==void 0&&o.text==="")return!1;return!0}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const B="SILENT_ERROR";class Rt{constructor(e,n,o,s={}){this.model=n,this.params=o,this._requestOptions=s,this._history=[],this._sendPromise=Promise.resolve(),this._apiKey=e,o?.history&&(Ot(o.history),this._history=o.history)}async getHistory(){return await this._sendPromise,this._history}async sendMessage(e,n={}){var o,s,i,r,a,c;await this._sendPromise;const h=y(e),C={safetySettings:(o=this.params)===null||o===void 0?void 0:o.safetySettings,generationConfig:(s=this.params)===null||s===void 0?void 0:s.generationConfig,tools:(i=this.params)===null||i===void 0?void 0:i.tools,toolConfig:(r=this.params)===null||r===void 0?void 0:r.toolConfig,systemInstruction:(a=this.params)===null||a===void 0?void 0:a.systemInstruction,cachedContent:(c=this.params)===null||c===void 0?void 0:c.cachedContent,contents:[...this._history,h]},p=Object.assign(Object.assign({},this._requestOptions),n);let d;return this._sendPromise=this._sendPromise.then(()=>J(this._apiKey,this.model,C,p)).then(l=>{var f;if(Y(l.response)){this._history.push(h);const v=Object.assign({parts:[],role:"model"},(f=l.response.candidates)===null||f===void 0?void 0:f[0].content);this._history.push(v)}else{const v=g(l.response);v&&console.warn(`sendMessage() was unsuccessful. ${v}. Inspect response object for details.`)}d=l}),await this._sendPromise,d}async sendMessageStream(e,n={}){var o,s,i,r,a,c;await this._sendPromise;const h=y(e),C={safetySettings:(o=this.params)===null||o===void 0?void 0:o.safetySettings,generationConfig:(s=this.params)===null||s===void 0?void 0:s.generationConfig,tools:(i=this.params)===null||i===void 0?void 0:i.tools,toolConfig:(r=this.params)===null||r===void 0?void 0:r.toolConfig,systemInstruction:(a=this.params)===null||a===void 0?void 0:a.systemInstruction,cachedContent:(c=this.params)===null||c===void 0?void 0:c.cachedContent,contents:[...this._history,h]},p=Object.assign(Object.assign({},this._requestOptions),n),d=V(this._apiKey,this.model,C,p);return this._sendPromise=this._sendPromise.then(()=>d).catch(l=>{throw new Error(B)}).then(l=>l.response).then(l=>{if(Y(l)){this._history.push(h);const f=Object.assign({},l.candidates[0].content);f.role||(f.role="model"),this._history.push(f)}else{const f=g(l);f&&console.warn(`sendMessageStream() was unsuccessful. ${f}. Inspect response object for details.`)}}).catch(l=>{l.message!==B&&console.error(l)}),d}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yt(t,e,n,o){return(await m(e,_.COUNT_TOKENS,t,!1,JSON.stringify(n),o)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mt(t,e,n,o){return(await m(e,_.EMBED_CONTENT,t,!1,JSON.stringify(n),o)).json()}async function At(t,e,n,o){const s=n.requests.map(r=>Object.assign(Object.assign({},r),{model:e}));return(await m(e,_.BATCH_EMBED_CONTENTS,t,!1,JSON.stringify({requests:s}),o)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class k{constructor(e,n,o={}){this.apiKey=e,this._requestOptions=o,n.model.includes("/")?this.model=n.model:this.model=`models/${n.model}`,this.generationConfig=n.generationConfig||{},this.safetySettings=n.safetySettings||[],this.tools=n.tools,this.toolConfig=n.toolConfig,this.systemInstruction=W(n.systemInstruction),this.cachedContent=n.cachedContent}async generateContent(e,n={}){var o;const s=j(e),i=Object.assign(Object.assign({},this._requestOptions),n);return J(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(o=this.cachedContent)===null||o===void 0?void 0:o.name},s),i)}async generateContentStream(e,n={}){var o;const s=j(e),i=Object.assign(Object.assign({},this._requestOptions),n);return V(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(o=this.cachedContent)===null||o===void 0?void 0:o.name},s),i)}startChat(e){var n;return new Rt(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(n=this.cachedContent)===null||n===void 0?void 0:n.name},e),this._requestOptions)}async countTokens(e,n={}){const o=pt(e,{model:this.model,generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:this.cachedContent}),s=Object.assign(Object.assign({},this._requestOptions),n);return yt(this.apiKey,this.model,o,s)}async embedContent(e,n={}){const o=vt(e),s=Object.assign(Object.assign({},this._requestOptions),n);return mt(this.apiKey,this.model,o,s)}async batchEmbedContents(e,n={}){const o=Object.assign(Object.assign({},this._requestOptions),n);return At(this.apiKey,this.model,e,o)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class St{constructor(e){this.apiKey=e}getGenerativeModel(e,n){if(!e.model)throw new u("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");return new k(this.apiKey,e,n)}getGenerativeModelFromCachedContent(e,n,o){if(!e.name)throw new E("Cached content must contain a `name` field.");if(!e.model)throw new E("Cached content must contain a `model` field.");const s=["model","systemInstruction"];for(const r of s)if(n?.[r]&&e[r]&&n?.[r]!==e[r]){if(r==="model"){const a=n.model.startsWith("models/")?n.model.replace("models/",""):n.model,c=e.model.startsWith("models/")?e.model.replace("models/",""):e.model;if(a===c)continue}throw new E(`Different value for "${r}" specified in modelParams (${n[r]}) and cachedContent (${e[r]})`)}const i=Object.assign(Object.assign({},n),{model:e.model,tools:e.tools,toolConfig:e.toolConfig,systemInstruction:e.systemInstruction,cachedContent:e});return new k(this.apiKey,i,o)}}var Tt={};const X=new St(Tt.VITE_GEMINI_API_KEY);async function Nt(t){try{console.log("Sending text to Gemini:",t);const s=await(await X.getGenerativeModel({model:"gemini-1.5-pro"}).generateContent(["Transcribe the following text for a blind user.",t])).response.text();return console.log("Gemini transcript result:",s),s}catch(e){return console.error("Text transcription error:",e),"Sorry, I couldn't transcribe the text."}}async function wt(t,e=""){try{const o=await(await fetch(t)).blob(),s=await o.arrayBuffer(),i=btoa(String.fromCharCode(...new Uint8Array(s))),r=X.getGenerativeModel({model:"gemini-1.5-pro"}),a={inlineData:{data:i,mimeType:o.type}},c="Describe this image for a blind user.",h=`Alt text: ${e}`;return(await r.generateContent([c,h,a])).response.text()}catch(n){return console.error("Image transcription error:",n),"Sorry, I couldn't transcribe the image."}}chrome.runtime.onMessage.addListener((t,e,n)=>{switch(t.action){case"transcribeText":return Nt(t.textContent).then(o=>n({transcript:o})),!0;case"transcribeImage":return wt(t.imageUrl,t.altText).then(o=>n({transcript:o})),!0;case"speak":return bt(t.text,t.options,n),!0;case"stopSpeech":chrome.tts.stop(),n({success:!0});break}});function bt(t,e={},n){if(!t){n&&n();return}const o={rate:e.rate||1,pitch:e.pitch||1,voiceName:e.voiceName||"",onEvent:s=>{["end","interrupted","error"].includes(s.type)&&n&&n()}};chrome.tts.speak(t,o)}
