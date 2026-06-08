import{_ as r}from"./plugin-vue_export-helper.21dcd24c.js";import{r as d,o as l,c as s,a as e,d as a,b as i,e as u}from"./app.7e2cd597.js";const t={},v=i("\u539F\u6587\u94FE\u63A5\uFF1A"),c={href:"https://juejin.cn/column/7616994432275267627",target:"_blank",rel:"noopener noreferrer"},o=i("\u6398\u91D1"),m=u(`<h2 id="_10-1-rag-\u539F\u7406\u4E0E\u5178\u578B\u67B6\u6784" tabindex="-1"><a class="header-anchor" href="#_10-1-rag-\u539F\u7406\u4E0E\u5178\u578B\u67B6\u6784" aria-hidden="true">#</a> 10.1 RAG \u539F\u7406\u4E0E\u5178\u578B\u67B6\u6784</h2><p>\u5728\u5B66\u4E60\u5B9E\u64CD\u524D\uFF0C\u6211\u4EEC\u5148\u641E\u61C2 RAG \u7684\u6838\u5FC3\u903B\u8F91\u2014\u2014\u5B83\u672C\u8D28\u662F\u201C\u68C0\u7D22\u201D\u4E0E\u201C\u751F\u6210\u201D\u7684\u7ED3\u5408\u4F53\uFF0C\u6838\u5FC3\u76EE\u6807\u662F\u8BA9 LLM \u7684\u56DE\u7B54\u201C\u6709\u4F9D\u636E\u3001\u4E0D\u80E1\u7F16\u3001\u53EF\u8FFD\u6EAF\u201D\u3002\u76F8\u6BD4\u7EAF LLM \u751F\u6210\uFF0CRAG \u80FD\u7075\u6D3B\u63A5\u5165\u6700\u65B0\u6587\u6863\u3001\u79C1\u6709\u6570\u636E\uFF08\u5982\u516C\u53F8\u5185\u90E8\u6587\u6863\uFF09\uFF0C\u65E0\u9700\u91CD\u65B0\u8BAD\u7EC3\u6A21\u578B\uFF0C\u6027\u4EF7\u6BD4\u6781\u9AD8\u3002</p><h3 id="_10-1-1-rag-\u6838\u5FC3\u539F\u7406-\u4E00\u53E5\u8BDD\u8BB2\u900F" tabindex="-1"><a class="header-anchor" href="#_10-1-1-rag-\u6838\u5FC3\u539F\u7406-\u4E00\u53E5\u8BDD\u8BB2\u900F" aria-hidden="true">#</a> 10.1.1 RAG \u6838\u5FC3\u539F\u7406\uFF08\u4E00\u53E5\u8BDD\u8BB2\u900F\uFF09</h3><p>\u5F53\u7528\u6237\u53D1\u8D77\u67E5\u8BE2\u65F6\uFF0CRAG \u7CFB\u7EDF\u5148\u4ECE\u79C1\u6709\u6587\u6863\u5E93\u4E2D\u68C0\u7D22\u51FA\u4E0E\u67E5\u8BE2\u6700\u76F8\u5173\u7684\u5185\u5BB9\uFF08\u57FA\u4E8E\u5411\u91CF\u5D4C\u5165\u548C\u5411\u91CF\u6570\u636E\u5E93\uFF09\uFF0C\u518D\u5C06\u201C\u7528\u6237\u67E5\u8BE2 + \u68C0\u7D22\u5230\u7684\u76F8\u5173\u6587\u6863\u201D\u4E00\u8D77\u8F93\u5165 LLM\uFF0C\u8BA9 LLM \u57FA\u4E8E\u68C0\u7D22\u5230\u7684\u5185\u5BB9\u751F\u6210\u56DE\u7B54\u2014\u2014\u5168\u7A0B\u4E0D\u4F9D\u8D56 LLM \u81EA\u8EAB\u7684\u8BAD\u7EC3\u6570\u636E\uFF0C\u6240\u6709\u56DE\u7B54\u90FD\u6709\u660E\u786E\u7684\u6587\u6863\u4F9D\u636E\u3002</p><h3 id="_10-1-2-rag-\u5178\u578B\u67B6\u6784-langchain-\u5B9E\u6218\u7248" tabindex="-1"><a class="header-anchor" href="#_10-1-2-rag-\u5178\u578B\u67B6\u6784-langchain-\u5B9E\u6218\u7248" aria-hidden="true">#</a> 10.1.2 RAG \u5178\u578B\u67B6\u6784\uFF08LangChain \u5B9E\u6218\u7248\uFF09</h3><p>LangChain \u5C01\u88C5\u4E86 RAG \u7684\u6838\u5FC3\u6D41\u7A0B\uFF0C\u65E0\u9700\u4ECE\u96F6\u642D\u5EFA\uFF0C\u5176\u5178\u578B\u67B6\u6784\u5206\u4E3A \u79BB\u7EBF\u51C6\u5907\u9636\u6BB5 \u548C \u5728\u7EBF\u63A8\u7406\u9636\u6BB5\uFF0C\u4E24\u4E2A\u9636\u6BB5\u65E0\u7F1D\u8854\u63A5\uFF0C\u65B0\u624B\u53EF\u76F4\u63A5\u590D\u7528\u6846\u67B6\u3002</p><h4 id="_1-\u79BB\u7EBF\u51C6\u5907\u9636\u6BB5-\u4E00\u6B21\u6027\u64CD\u4F5C" tabindex="-1"><a class="header-anchor" href="#_1-\u79BB\u7EBF\u51C6\u5907\u9636\u6BB5-\u4E00\u6B21\u6027\u64CD\u4F5C" aria-hidden="true">#</a> 1. \u79BB\u7EBF\u51C6\u5907\u9636\u6BB5\uFF08\u4E00\u6B21\u6027\u64CD\u4F5C\uFF09</h4><p>\u6838\u5FC3\u662F\u201C\u5C06\u79C1\u6709\u6587\u6863\u8F6C\u5316\u4E3A\u53EF\u68C0\u7D22\u7684\u5411\u91CF\u6570\u636E\u201D\uFF0C\u5BF9\u5E94\u524D\u4E24\u7AE0\u7684\u77E5\u8BC6\uFF0C\u6D41\u7A0B\u5982\u4E0B\uFF1A</p><ul><li>\u6587\u6863\u52A0\u8F7D\uFF1A\u52A0\u8F7D\u79C1\u6709\u6587\u6863\uFF08\u5982\u516C\u53F8\u5E74\u62A5\u3001PDF\u3001Markdown\uFF09\uFF0C\u652F\u6301\u591A\u683C\u5F0F\uFF1B</li></ul><p>\u6587\u6863\u52A0\u8F7D\uFF1A\u52A0\u8F7D\u79C1\u6709\u6587\u6863\uFF08\u5982\u516C\u53F8\u5E74\u62A5\u3001PDF\u3001Markdown\uFF09\uFF0C\u652F\u6301\u591A\u683C\u5F0F\uFF1B</p><ul><li>\u6587\u672C\u9884\u5904\u7406\u4E0E\u5206\u5757\uFF1A\u6E05\u6D17\u65E0\u6548\u5185\u5BB9\u3001\u5206\u5272\u957F\u6587\u672C\uFF08\u9002\u914D\u5D4C\u5165\u6A21\u578B\u548C LLM \u8F93\u5165\u9650\u5236\uFF09\uFF1B</li></ul><p>\u6587\u672C\u9884\u5904\u7406\u4E0E\u5206\u5757\uFF1A\u6E05\u6D17\u65E0\u6548\u5185\u5BB9\u3001\u5206\u5272\u957F\u6587\u672C\uFF08\u9002\u914D\u5D4C\u5165\u6A21\u578B\u548C LLM \u8F93\u5165\u9650\u5236\uFF09\uFF1B</p><ul><li>\u5411\u91CF\u5D4C\u5165\u751F\u6210\uFF1A\u5C06\u6BCF\u4E2A\u6587\u672C\u5757\u8F6C\u4E3A\u5D4C\u5165\u5411\u91CF\uFF1B</li></ul><p>\u5411\u91CF\u5D4C\u5165\u751F\u6210\uFF1A\u5C06\u6BCF\u4E2A\u6587\u672C\u5757\u8F6C\u4E3A\u5D4C\u5165\u5411\u91CF\uFF1B</p><ul><li>\u5411\u91CF\u5B58\u50A8\uFF1A\u5C06\u5D4C\u5165\u5411\u91CF\u548C\u539F\u59CB\u6587\u672C\u5B58\u5165\u5411\u91CF\u6570\u636E\u5E93\uFF08\u5982 Chroma\u3001Pinecone\uFF09\uFF0C\u6784\u5EFA\u79C1\u6709\u6587\u6863\u5E93\u3002</li></ul><p>\u5411\u91CF\u5B58\u50A8\uFF1A\u5C06\u5D4C\u5165\u5411\u91CF\u548C\u539F\u59CB\u6587\u672C\u5B58\u5165\u5411\u91CF\u6570\u636E\u5E93\uFF08\u5982 Chroma\u3001Pinecone\uFF09\uFF0C\u6784\u5EFA\u79C1\u6709\u6587\u6863\u5E93\u3002</p><h4 id="_2-\u5728\u7EBF\u63A8\u7406\u9636\u6BB5-\u7528\u6237\u4EA4\u4E92\u65F6\u5B9E\u65F6\u6267\u884C" tabindex="-1"><a class="header-anchor" href="#_2-\u5728\u7EBF\u63A8\u7406\u9636\u6BB5-\u7528\u6237\u4EA4\u4E92\u65F6\u5B9E\u65F6\u6267\u884C" aria-hidden="true">#</a> 2. \u5728\u7EBF\u63A8\u7406\u9636\u6BB5\uFF08\u7528\u6237\u4EA4\u4E92\u65F6\u5B9E\u65F6\u6267\u884C\uFF09</h4><p>\u6838\u5FC3\u662F\u201C\u68C0\u7D22 + \u751F\u6210\u201D\u7684\u8054\u52A8\uFF0C\u6D41\u7A0B\u5982\u4E0B\uFF1A</p><ul><li>\u7528\u6237\u67E5\u8BE2\uFF1A\u7528\u6237\u8F93\u5165\u95EE\u9898\uFF08\u5982\u201C2023\u5E74\u516C\u53F8\u8425\u6536\u662F\u591A\u5C11\uFF1F\u201D\uFF09\uFF1B</li></ul><p>\u7528\u6237\u67E5\u8BE2\uFF1A\u7528\u6237\u8F93\u5165\u95EE\u9898\uFF08\u5982\u201C2023\u5E74\u516C\u53F8\u8425\u6536\u662F\u591A\u5C11\uFF1F\u201D\uFF09\uFF1B</p><ul><li>\u67E5\u8BE2\u5D4C\u5165\uFF1A\u5C06\u7528\u6237\u67E5\u8BE2\u8F6C\u4E3A\u5411\u91CF\u5D4C\u5165\uFF1B</li></ul><p>\u67E5\u8BE2\u5D4C\u5165\uFF1A\u5C06\u7528\u6237\u67E5\u8BE2\u8F6C\u4E3A\u5411\u91CF\u5D4C\u5165\uFF1B</p><ul><li>\u8BED\u4E49\u68C0\u7D22\uFF1A\u4ECE\u5411\u91CF\u6570\u636E\u5E93\u4E2D\u68C0\u7D22\u51FA\u4E0E\u67E5\u8BE2\u6700\u76F8\u5173\u7684\u6587\u672C\u5757\uFF1B</li></ul><p>\u8BED\u4E49\u68C0\u7D22\uFF1A\u4ECE\u5411\u91CF\u6570\u636E\u5E93\u4E2D\u68C0\u7D22\u51FA\u4E0E\u67E5\u8BE2\u6700\u76F8\u5173\u7684\u6587\u672C\u5757\uFF1B</p><ul><li>prompt \u6784\u9020\uFF1A\u5C06\u201C\u7528\u6237\u67E5\u8BE2 + \u68C0\u7D22\u5230\u7684\u76F8\u5173\u6587\u672C\u201D\u62FC\u63A5\u6210 prompt\uFF1B</li></ul><p>prompt \u6784\u9020\uFF1A\u5C06\u201C\u7528\u6237\u67E5\u8BE2 + \u68C0\u7D22\u5230\u7684\u76F8\u5173\u6587\u672C\u201D\u62FC\u63A5\u6210 prompt\uFF1B</p><ul><li>LLM \u751F\u6210\uFF1A\u5C06 prompt \u8F93\u5165 LLM\uFF0C\u751F\u6210\u57FA\u4E8E\u68C0\u7D22\u5185\u5BB9\u7684\u56DE\u7B54\uFF0C\u540C\u65F6\u8FD4\u56DE\u56DE\u7B54\u6765\u6E90\u3002</li></ul><p>LLM \u751F\u6210\uFF1A\u5C06 prompt \u8F93\u5165 LLM\uFF0C\u751F\u6210\u57FA\u4E8E\u68C0\u7D22\u5185\u5BB9\u7684\u56DE\u7B54\uFF0C\u540C\u65F6\u8FD4\u56DE\u56DE\u7B54\u6765\u6E90\u3002</p><h4 id="rag-\u67B6\u6784\u56FE\u4F8B-\u6781\u7B80\u6613\u61C2" tabindex="-1"><a class="header-anchor" href="#rag-\u67B6\u6784\u56FE\u4F8B-\u6781\u7B80\u6613\u61C2" aria-hidden="true">#</a> RAG \u67B6\u6784\u56FE\u4F8B\uFF08\u6781\u7B80\u6613\u61C2\uFF09</h4><p>\u4E3A\u4E86\u66F4\u76F4\u89C2\u7406\u89E3\uFF0C\u7528\u6781\u7B80\u6D41\u7A0B\u56FE\u5C55\u793A\u6838\u5FC3\u903B\u8F91\uFF08\u53EF\u76F4\u63A5\u7528\u4E8E\u7B14\u8BB0\uFF09\uFF1A</p><p>\u300C\u79BB\u7EBF\u51C6\u5907\u300D\uFF1A\u79C1\u6709\u6587\u6863 \u2192 \u6587\u672C\u5206\u5757 \u2192 \u751F\u6210\u5D4C\u5165 \u2192 \u5B58\u5165\u5411\u91CF\u6570\u636E\u5E93 \u300C\u5728\u7EBF\u63A8\u7406\u300D\uFF1A\u7528\u6237\u67E5\u8BE2 \u2192 \u751F\u6210\u67E5\u8BE2\u5D4C\u5165 \u2192 \u5411\u91CF\u6570\u636E\u5E93\u68C0\u7D22 \u2192 \u62FC\u63A5 prompt \u2192 LLM \u751F\u6210\u56DE\u7B54</p><h3 id="_10-1-3-rag-\u4E0E\u7EAF-llm-\u5BF9\u6BD4-\u6838\u5FC3\u4F18\u52BF" tabindex="-1"><a class="header-anchor" href="#_10-1-3-rag-\u4E0E\u7EAF-llm-\u5BF9\u6BD4-\u6838\u5FC3\u4F18\u52BF" aria-hidden="true">#</a> 10.1.3 RAG \u4E0E\u7EAF LLM \u5BF9\u6BD4\uFF08\u6838\u5FC3\u4F18\u52BF\uFF09</h3><h3 id="_10-1-4-\u5173\u952E\u63D0\u9192" tabindex="-1"><a class="header-anchor" href="#_10-1-4-\u5173\u952E\u63D0\u9192" aria-hidden="true">#</a> 10.1.4 \u5173\u952E\u63D0\u9192</h3><p>LangChain \u662F RAG \u5F00\u53D1\u7684\u201C\u745E\u58EB\u519B\u5200\u201D\uFF0C\u5B83\u5C01\u88C5\u4E86\u6587\u6863\u52A0\u8F7D\u3001\u5206\u5757\u3001\u5D4C\u5165\u3001\u68C0\u7D22\u3001LLM \u8C03\u7528\u7684\u6240\u6709\u7EC4\u4EF6\uFF0C\u65E0\u9700\u6211\u4EEC\u624B\u52A8\u62FC\u63A5\u6D41\u7A0B\uFF0C\u53EA\u9700\u7EC4\u5408\u7EC4\u4EF6\u5373\u53EF\u5FEB\u901F\u642D\u5EFA RAG \u7CFB\u7EDF\u3002</p><p>\u5F15\u7528\u6765\u6E90\uFF1ALangChain RAG \u5B98\u65B9\u6587\u6863\u3001LangChain RAG \u5B9E\u6218\u6307\u5357\u3002</p><h2 id="_10-2-\u4F7F\u7528-retrievalqachain-\u5FEB\u901F\u642D\u5EFA\u95EE\u7B54\u7CFB\u7EDF" tabindex="-1"><a class="header-anchor" href="#_10-2-\u4F7F\u7528-retrievalqachain-\u5FEB\u901F\u642D\u5EFA\u95EE\u7B54\u7CFB\u7EDF" aria-hidden="true">#</a> 10.2 \u4F7F\u7528 RetrievalQAChain \u5FEB\u901F\u642D\u5EFA\u95EE\u7B54\u7CFB\u7EDF</h2><p>LangChain \u63D0\u4F9B\u4E86 RetrievalQAChain \u7EC4\u4EF6\uFF0C\u5B83\u662F RAG \u7CFB\u7EDF\u7684\u201C\u4E00\u952E\u642D\u5EFA\u5DE5\u5177\u201D\u2014\u2014\u5C01\u88C5\u4E86\u201C\u68C0\u7D22 + \u751F\u6210\u201D\u7684\u5B8C\u6574\u6D41\u7A0B\uFF0C\u53EA\u9700\u4F20\u5165\u5411\u91CF\u6570\u636E\u5E93\uFF08\u68C0\u7D22\u6E90\uFF09\u548C LLM\uFF0C\u4E00\u884C\u4EE3\u7801\u5373\u53EF\u642D\u5EFA\u53EF\u76F4\u63A5\u4F7F\u7528\u7684\u95EE\u7B54\u7CFB\u7EDF\uFF0C\u9002\u5408\u65B0\u624B\u5FEB\u901F\u9A8C\u8BC1\u6548\u679C\u3002</p><h3 id="_10-2-1-\u51C6\u5907\u5DE5\u4F5C-\u5B89\u88C5\u4F9D\u8D56-\u521D\u59CB\u5316\u7EC4\u4EF6" tabindex="-1"><a class="header-anchor" href="#_10-2-1-\u51C6\u5907\u5DE5\u4F5C-\u5B89\u88C5\u4F9D\u8D56-\u521D\u59CB\u5316\u7EC4\u4EF6" aria-hidden="true">#</a> 10.2.1 \u51C6\u5907\u5DE5\u4F5C\uFF1A\u5B89\u88C5\u4F9D\u8D56 + \u521D\u59CB\u5316\u7EC4\u4EF6</h3><h4 id="_1-\u5B89\u88C5\u6838\u5FC3\u4F9D\u8D56" tabindex="-1"><a class="header-anchor" href="#_1-\u5B89\u88C5\u6838\u5FC3\u4F9D\u8D56" aria-hidden="true">#</a> 1. \u5B89\u88C5\u6838\u5FC3\u4F9D\u8D56</h4><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>pip install langchain chromadb sentence-transformers openai python-dotenv
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>\u8BF4\u660E\uFF1A\u672C\u6B21\u4F7F\u7528 OpenAI \u7684 LLM\uFF08gpt-3.5-turbo\uFF09\uFF0C\u4E5F\u53EF\u66FF\u6362\u4E3A\u672C\u5730\u5316 LLM\uFF08\u5982 Llama 3\uFF09\uFF0C\u540E\u7EED\u7AE0\u8282\u4F1A\u8865\u5145\u3002</p><h4 id="_2-\u521D\u59CB\u5316\u6838\u5FC3\u7EC4\u4EF6" tabindex="-1"><a class="header-anchor" href="#_2-\u521D\u59CB\u5316\u6838\u5FC3\u7EC4\u4EF6" aria-hidden="true">#</a> 2. \u521D\u59CB\u5316\u6838\u5FC3\u7EC4\u4EF6</h4><p>\u9700\u63D0\u524D\u51C6\u5907 3 \u4E2A\u6838\u5FC3\u7EC4\u4EF6\uFF1A\u5D4C\u5165\u6A21\u578B\u3001\u5411\u91CF\u6570\u636E\u5E93\uFF08\u542B\u6587\u6863\uFF09\u3001LLM\uFF0C\u4EE3\u7801\u4E2D\u4F1A\u590D\u7528\u524D\u4E24\u7AE0\u7684\u77E5\u8BC6\uFF0C\u7B80\u6D01\u6613\u61C2\u3002</p><h3 id="_10-2-2-\u4E00\u952E\u642D\u5EFA-rag-\u95EE\u7B54\u7CFB\u7EDF-\u4EE3\u7801\u793A\u4F8B" tabindex="-1"><a class="header-anchor" href="#_10-2-2-\u4E00\u952E\u642D\u5EFA-rag-\u95EE\u7B54\u7CFB\u7EDF-\u4EE3\u7801\u793A\u4F8B" aria-hidden="true">#</a> 10.2.2 \u4E00\u952E\u642D\u5EFA RAG \u95EE\u7B54\u7CFB\u7EDF\uFF08\u4EE3\u7801\u793A\u4F8B\uFF09</h3><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from dotenv import load_dotenv
import os

# 1. \u52A0\u8F7D\u73AF\u5883\u53D8\u91CF\uFF08OpenAI API \u5BC6\u94A5\uFF09
# .env \u6587\u4EF6\u5185\u5BB9\uFF1AOPENAI_API_KEY=\u4F60\u7684\u5BC6\u94A5
load_dotenv()

# 2. \u521D\u59CB\u5316\u5D4C\u5165\u6A21\u578B\uFF08\u590D\u7528\u524D\u4E00\u7AE0\u7684\u8F7B\u91CF\u6A21\u578B\uFF09
embeddings = HuggingFaceEmbeddings(model_name=&quot;all-MiniLM-L6-v2&quot;)

# 3. \u521D\u59CB\u5316\u5411\u91CF\u6570\u636E\u5E93\uFF08\u542B\u793A\u4F8B\u6587\u6863\uFF0C\u6A21\u62DF\u79C1\u6709\u6587\u6863\u5E93\uFF09
# \u51C6\u5907\u793A\u4F8B\u6587\u6863\uFF08\u66FF\u6362\u4E3A\u4F60\u7684\u79C1\u6709\u6587\u6863\uFF09
texts = [
    &quot;2023\u5E74\u516C\u53F8\u603B\u8425\u6536100\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F20%&quot;,
    &quot;\u516C\u53F8\u6838\u5FC3\u4E1A\u52A1\u5206\u4E3A\u4E09\u5927\u677F\u5757\uFF1A\u4EBA\u5DE5\u667A\u80FD\u3001\u4E91\u8BA1\u7B97\u3001\u5927\u6570\u636E&quot;,
    &quot;2023\u5E74\u4EBA\u5DE5\u667A\u80FD\u677F\u5757\u8425\u653650\u4EBF\u5143\uFF0C\u5360\u603B\u8425\u6536\u768450%&quot;,
    &quot;\u4E91\u8BA1\u7B97\u677F\u5757\u8425\u653630\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F30%\uFF0C\u662F\u589E\u957F\u6700\u5FEB\u7684\u677F\u5757&quot;,
    &quot;\u5927\u6570\u636E\u677F\u5757\u8425\u653620\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F10%&quot;
]
# \u5B58\u5165 Chroma \u5411\u91CF\u6570\u636E\u5E93
db = Chroma.from_texts(texts=texts, embedding=embeddings, persist_directory=&quot;./rag_db&quot;)
db.persist()

# 4. \u521D\u59CB\u5316 LLM\uFF08OpenAI gpt-3.5-turbo\uFF0C\u6027\u4EF7\u6BD4\u9AD8\uFF09
llm = ChatOpenAI(
    model_name=&quot;gpt-3.5-turbo&quot;,
    temperature=0.1,  # \u6E29\u5EA6\u8D8A\u4F4E\uFF0C\u56DE\u7B54\u8D8A\u7CBE\u51C6\uFF0C\u907F\u514D\u5E7B\u89C9
    openai_api_key=os.getenv(&quot;OPENAI_API_KEY&quot;)
)

# 5. \u4E00\u952E\u642D\u5EFA RAG \u95EE\u7B54\u94FE\uFF08RetrievalQAChain\uFF09
rag_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type=&quot;stuff&quot;,  # \u6838\u5FC3\u53C2\u6570\uFF1A\u5C06\u68C0\u7D22\u5230\u7684\u6587\u672C\u5168\u90E8\u4F20\u5165 LLM
    retriever=db.as_retriever(k=3),  # \u68C0\u7D22\u524D3\u4E2A\u6700\u76F8\u4F3C\u7684\u6587\u672C\u5757
    return_source_documents=True  # \u5173\u952E\uFF1A\u8FD4\u56DE\u56DE\u7B54\u7684\u6765\u6E90\u6587\u6863\uFF0C\u4FBF\u4E8E\u8FFD\u6EAF
)

# 6. \u6D4B\u8BD5\u95EE\u7B54\u7CFB\u7EDF
query = &quot;2023\u5E74\u516C\u53F8\u4E91\u8BA1\u7B97\u677F\u5757\u8425\u6536\u662F\u591A\u5C11\uFF1F\u540C\u6BD4\u589E\u957F\u591A\u5C11\uFF1F&quot;
result = rag_chain({&quot;query&quot;: query})

# \u8F93\u51FA\u7ED3\u679C\uFF08\u542B\u56DE\u7B54\u548C\u6765\u6E90\uFF09
print(&quot;\u56DE\u7B54\uFF1A&quot;, result[&quot;result&quot;])
print(&quot;\\n\u6765\u6E90\u6587\u6863\uFF1A&quot;)
for doc in result[&quot;source_documents&quot;]:
    print(&quot;-&quot;, doc.page_content)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-2-3-\u6838\u5FC3\u53C2\u6570\u89E3\u6790-\u907F\u5751\u91CD\u70B9" tabindex="-1"><a class="header-anchor" href="#_10-2-3-\u6838\u5FC3\u53C2\u6570\u89E3\u6790-\u907F\u5751\u91CD\u70B9" aria-hidden="true">#</a> 10.2.3 \u6838\u5FC3\u53C2\u6570\u89E3\u6790\uFF08\u907F\u5751\u91CD\u70B9\uFF09</h3><p>RetrievalQA.from_chain_type \u662F\u6838\u5FC3\u65B9\u6CD5\uFF0C\u51E0\u4E2A\u5173\u952E\u53C2\u6570\u76F4\u63A5\u5F71\u54CD RAG \u6548\u679C\uFF0C\u5FC5\u987B\u638C\u63E1\uFF1A</p><ul><li>chain_type\uFF1A\u68C0\u7D22\u5230\u7684\u6587\u672C\u4E0E\u67E5\u8BE2\u7684\u62FC\u63A5\u65B9\u5F0F\uFF0C\u65B0\u624B\u4F18\u5148\u9009stuff\uFF08\u7B80\u5355\u9AD8\u6548\uFF09\uFF0C\u5176\u4ED6\u53EF\u9009\uFF1A</li></ul><p>stuff\uFF1A\u5C06\u6240\u6709\u68C0\u7D22\u5230\u7684\u6587\u672C\u5168\u90E8\u62FC\u63A5\u8FDB prompt\uFF0C\u9002\u5408\u77ED\u6587\u672C\u3001\u68C0\u7D22\u7ED3\u679C\u5C11\u7684\u573A\u666F\uFF1B</p><p>map_reduce\uFF1A\u5148\u5355\u72EC\u5904\u7406\u6BCF\u4E2A\u68C0\u7D22\u6587\u672C\uFF0C\u518D\u6C47\u603B\u751F\u6210\u56DE\u7B54\uFF0C\u9002\u5408\u957F\u6587\u672C\u3001\u591A\u68C0\u7D22\u7ED3\u679C\uFF1B</p><p>refine\uFF1A\u9010\u6B65\u4F18\u5316\u56DE\u7B54\uFF0C\u5148\u57FA\u4E8E\u7B2C\u4E00\u4E2A\u6587\u672C\u751F\u6210\u521D\u6B65\u56DE\u7B54\uFF0C\u518D\u7ED3\u5408\u540E\u7EED\u6587\u672C\u4F18\u5316\uFF0C\u7CBE\u5EA6\u9AD8\u4F46\u901F\u5EA6\u6162\u3002</p><p>chain_type\uFF1A\u68C0\u7D22\u5230\u7684\u6587\u672C\u4E0E\u67E5\u8BE2\u7684\u62FC\u63A5\u65B9\u5F0F\uFF0C\u65B0\u624B\u4F18\u5148\u9009stuff\uFF08\u7B80\u5355\u9AD8\u6548\uFF09\uFF0C\u5176\u4ED6\u53EF\u9009\uFF1A</p><ul><li>stuff\uFF1A\u5C06\u6240\u6709\u68C0\u7D22\u5230\u7684\u6587\u672C\u5168\u90E8\u62FC\u63A5\u8FDB prompt\uFF0C\u9002\u5408\u77ED\u6587\u672C\u3001\u68C0\u7D22\u7ED3\u679C\u5C11\u7684\u573A\u666F\uFF1B</li></ul><p>stuff\uFF1A\u5C06\u6240\u6709\u68C0\u7D22\u5230\u7684\u6587\u672C\u5168\u90E8\u62FC\u63A5\u8FDB prompt\uFF0C\u9002\u5408\u77ED\u6587\u672C\u3001\u68C0\u7D22\u7ED3\u679C\u5C11\u7684\u573A\u666F\uFF1B</p><ul><li>map_reduce\uFF1A\u5148\u5355\u72EC\u5904\u7406\u6BCF\u4E2A\u68C0\u7D22\u6587\u672C\uFF0C\u518D\u6C47\u603B\u751F\u6210\u56DE\u7B54\uFF0C\u9002\u5408\u957F\u6587\u672C\u3001\u591A\u68C0\u7D22\u7ED3\u679C\uFF1B</li></ul><p>map_reduce\uFF1A\u5148\u5355\u72EC\u5904\u7406\u6BCF\u4E2A\u68C0\u7D22\u6587\u672C\uFF0C\u518D\u6C47\u603B\u751F\u6210\u56DE\u7B54\uFF0C\u9002\u5408\u957F\u6587\u672C\u3001\u591A\u68C0\u7D22\u7ED3\u679C\uFF1B</p><ul><li>refine\uFF1A\u9010\u6B65\u4F18\u5316\u56DE\u7B54\uFF0C\u5148\u57FA\u4E8E\u7B2C\u4E00\u4E2A\u6587\u672C\u751F\u6210\u521D\u6B65\u56DE\u7B54\uFF0C\u518D\u7ED3\u5408\u540E\u7EED\u6587\u672C\u4F18\u5316\uFF0C\u7CBE\u5EA6\u9AD8\u4F46\u901F\u5EA6\u6162\u3002</li></ul><p>refine\uFF1A\u9010\u6B65\u4F18\u5316\u56DE\u7B54\uFF0C\u5148\u57FA\u4E8E\u7B2C\u4E00\u4E2A\u6587\u672C\u751F\u6210\u521D\u6B65\u56DE\u7B54\uFF0C\u518D\u7ED3\u5408\u540E\u7EED\u6587\u672C\u4F18\u5316\uFF0C\u7CBE\u5EA6\u9AD8\u4F46\u901F\u5EA6\u6162\u3002</p><ul><li>retriever\uFF1A\u68C0\u7D22\u5668\uFF0C\u7531\u5411\u91CF\u6570\u636E\u5E93\u8C03\u7528 as_retriever()\u751F\u6210\uFF0Ck=3 \u8868\u793A\u68C0\u7D22\u524D3\u4E2A\u6700\u76F8\u4F3C\u7684\u6587\u672C\u5757\uFF1B</li></ul><p>retriever\uFF1A\u68C0\u7D22\u5668\uFF0C\u7531\u5411\u91CF\u6570\u636E\u5E93\u8C03\u7528 as_retriever()\u751F\u6210\uFF0Ck=3 \u8868\u793A\u68C0\u7D22\u524D3\u4E2A\u6700\u76F8\u4F3C\u7684\u6587\u672C\u5757\uFF1B</p><ul><li>return_source_documents\uFF1A\u662F\u5426\u8FD4\u56DE\u6765\u6E90\u6587\u6863\uFF0C\u5EFA\u8BAE\u8BBE\u4E3A True\uFF0C\u4FBF\u4E8E\u9A8C\u8BC1\u56DE\u7B54\u7684\u51C6\u786E\u6027\u3001\u8FFD\u6EAF\u4F9D\u636E\u3002</li></ul><p>return_source_documents\uFF1A\u662F\u5426\u8FD4\u56DE\u6765\u6E90\u6587\u6863\uFF0C\u5EFA\u8BAE\u8BBE\u4E3A True\uFF0C\u4FBF\u4E8E\u9A8C\u8BC1\u56DE\u7B54\u7684\u51C6\u786E\u6027\u3001\u8FFD\u6EAF\u4F9D\u636E\u3002</p><h3 id="_10-2-4-\u8FD0\u884C\u7ED3\u679C\u793A\u4F8B-\u76F4\u89C2\u53C2\u8003" tabindex="-1"><a class="header-anchor" href="#_10-2-4-\u8FD0\u884C\u7ED3\u679C\u793A\u4F8B-\u76F4\u89C2\u53C2\u8003" aria-hidden="true">#</a> 10.2.4 \u8FD0\u884C\u7ED3\u679C\u793A\u4F8B\uFF08\u76F4\u89C2\u53C2\u8003\uFF09</h3><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>\u56DE\u7B54\uFF1A 2023\u5E74\u516C\u53F8\u4E91\u8BA1\u7B97\u677F\u5757\u8425\u653630\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F30%\u3002

\u6765\u6E90\u6587\u6863\uFF1A
- \u4E91\u8BA1\u7B97\u677F\u5757\u8425\u653630\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F30%\uFF0C\u662F\u589E\u957F\u6700\u5FEB\u7684\u677F\u5757
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-2-5-\u5173\u952E\u63D0\u9192" tabindex="-1"><a class="header-anchor" href="#_10-2-5-\u5173\u952E\u63D0\u9192" aria-hidden="true">#</a> 10.2.5 \u5173\u952E\u63D0\u9192</h3><ul><li>LLM \u66FF\u6362\uFF1A\u82E5\u4E0D\u60F3\u7528 OpenAI\uFF0C\u53EF\u66FF\u6362\u4E3A\u672C\u5730\u5316 LLM\uFF08\u5982 Llama 3\uFF09\uFF0C\u53EA\u9700\u4FEE\u6539 llm \u7684\u521D\u59CB\u5316\u4EE3\u7801\uFF1B</li></ul><p>LLM \u66FF\u6362\uFF1A\u82E5\u4E0D\u60F3\u7528 OpenAI\uFF0C\u53EF\u66FF\u6362\u4E3A\u672C\u5730\u5316 LLM\uFF08\u5982 Llama 3\uFF09\uFF0C\u53EA\u9700\u4FEE\u6539 llm \u7684\u521D\u59CB\u5316\u4EE3\u7801\uFF1B</p><ul><li>\u6587\u6863\u66FF\u6362\uFF1A\u5C06\u793A\u4F8B texts \u66FF\u6362\u4E3A\u4F60\u7684\u79C1\u6709\u6587\u6863\uFF08\u5982\u516C\u53F8\u5E74\u62A5\u3001\u6280\u672F\u6587\u6863\uFF09\uFF0C\u5373\u53EF\u5B9E\u73B0\u9488\u5BF9\u79C1\u6709\u6570\u636E\u7684\u95EE\u7B54\uFF1B</li></ul><p>\u6587\u6863\u66FF\u6362\uFF1A\u5C06\u793A\u4F8B texts \u66FF\u6362\u4E3A\u4F60\u7684\u79C1\u6709\u6587\u6863\uFF08\u5982\u516C\u53F8\u5E74\u62A5\u3001\u6280\u672F\u6587\u6863\uFF09\uFF0C\u5373\u53EF\u5B9E\u73B0\u9488\u5BF9\u79C1\u6709\u6570\u636E\u7684\u95EE\u7B54\uFF1B</p><ul><li>\u5F15\u7528\u6765\u6E90\uFF1ALangChain RetrievalQA \u94FE\u7C7B\u578B\u6587\u6863\u3002</li></ul><p>\u5F15\u7528\u6765\u6E90\uFF1ALangChain RetrievalQA \u94FE\u7C7B\u578B\u6587\u6863\u3002</p><h2 id="_10-3-\u81EA\u5B9A\u4E49\u68C0\u7D22\u5668-retriever-\u903B\u8F91" tabindex="-1"><a class="header-anchor" href="#_10-3-\u81EA\u5B9A\u4E49\u68C0\u7D22\u5668-retriever-\u903B\u8F91" aria-hidden="true">#</a> 10.3 \u81EA\u5B9A\u4E49\u68C0\u7D22\u5668\uFF08Retriever\uFF09\u903B\u8F91</h2><p>\u4E0A\u4E00\u8282\u7528\u7684\u662F\u5411\u91CF\u6570\u636E\u5E93\u9ED8\u8BA4\u7684\u68C0\u7D22\u5668\uFF08db.as_retriever()\uFF09\uFF0C\u4F46\u5728\u5B9E\u9645\u573A\u666F\u4E2D\uFF0C\u9ED8\u8BA4\u68C0\u7D22\u5668\u53EF\u80FD\u65E0\u6CD5\u6EE1\u8DB3\u9700\u6C42\uFF08\u5982\u9700\u8981\u81EA\u5B9A\u4E49\u68C0\u7D22\u7B56\u7565\u3001\u7ED3\u5408\u5143\u6570\u636E\u8FC7\u6EE4\u3001\u8C03\u6574\u76F8\u4F3C\u5EA6\u9608\u503C\uFF09\u3002LangChain \u652F\u6301\u81EA\u5B9A\u4E49\u68C0\u7D22\u5668\uFF0C\u7075\u6D3B\u5EA6\u6781\u9AD8\uFF0C\u53EF\u6839\u636E\u4E1A\u52A1\u9700\u6C42\u5B9A\u5236\u68C0\u7D22\u903B\u8F91\u3002</p><h3 id="_10-3-1-\u81EA\u5B9A\u4E49\u68C0\u7D22\u5668\u7684\u6838\u5FC3\u573A\u666F" tabindex="-1"><a class="header-anchor" href="#_10-3-1-\u81EA\u5B9A\u4E49\u68C0\u7D22\u5668\u7684\u6838\u5FC3\u573A\u666F" aria-hidden="true">#</a> 10.3.1 \u81EA\u5B9A\u4E49\u68C0\u7D22\u5668\u7684\u6838\u5FC3\u573A\u666F</h3><ul><li>\u573A\u666F1\uFF1A\u81EA\u5B9A\u4E49\u68C0\u7D22\u6570\u91CF\uFF08k\u503C\uFF09\u548C\u76F8\u4F3C\u5EA6\u9608\u503C\uFF08\u8FC7\u6EE4\u4F4E\u76F8\u4F3C\u5EA6\u7ED3\u679C\uFF09\uFF1B</li></ul><p>\u573A\u666F1\uFF1A\u81EA\u5B9A\u4E49\u68C0\u7D22\u6570\u91CF\uFF08k\u503C\uFF09\u548C\u76F8\u4F3C\u5EA6\u9608\u503C\uFF08\u8FC7\u6EE4\u4F4E\u76F8\u4F3C\u5EA6\u7ED3\u679C\uFF09\uFF1B</p><ul><li>\u573A\u666F2\uFF1A\u7ED3\u5408\u5143\u6570\u636E\u8FC7\u6EE4\uFF08\u5982\u53EA\u68C0\u7D222023\u5E74\u7684\u6587\u6863\u3001\u53EA\u68C0\u7D22\u67D0\u4E2A\u677F\u5757\u7684\u5185\u5BB9\uFF09\uFF1B</li></ul><p>\u573A\u666F2\uFF1A\u7ED3\u5408\u5143\u6570\u636E\u8FC7\u6EE4\uFF08\u5982\u53EA\u68C0\u7D222023\u5E74\u7684\u6587\u6863\u3001\u53EA\u68C0\u7D22\u67D0\u4E2A\u677F\u5757\u7684\u5185\u5BB9\uFF09\uFF1B</p><ul><li>\u573A\u666F3\uFF1A\u81EA\u5B9A\u4E49\u68C0\u7D22\u7B56\u7565\uFF08\u5982\u5148\u8FC7\u6EE4\u5143\u6570\u636E\uFF0C\u518D\u8FDB\u884C\u8BED\u4E49\u68C0\u7D22\uFF09\uFF1B</li></ul><p>\u573A\u666F3\uFF1A\u81EA\u5B9A\u4E49\u68C0\u7D22\u7B56\u7565\uFF08\u5982\u5148\u8FC7\u6EE4\u5143\u6570\u636E\uFF0C\u518D\u8FDB\u884C\u8BED\u4E49\u68C0\u7D22\uFF09\uFF1B</p><ul><li>\u573A\u666F4\uFF1A\u7EC4\u5408\u591A\u4E2A\u68C0\u7D22\u6E90\uFF08\u5982\u540C\u65F6\u4ECE Chroma \u548C Pinecone \u4E2D\u68C0\u7D22\uFF09\u3002</li></ul><p>\u573A\u666F4\uFF1A\u7EC4\u5408\u591A\u4E2A\u68C0\u7D22\u6E90\uFF08\u5982\u540C\u65F6\u4ECE Chroma \u548C Pinecone \u4E2D\u68C0\u7D22\uFF09\u3002</p><h3 id="_10-3-2-\u81EA\u5B9A\u4E49\u68C0\u7D22\u5668-\u57FA\u7840\u7248-\u8C03\u6574\u53C2\u6570" tabindex="-1"><a class="header-anchor" href="#_10-3-2-\u81EA\u5B9A\u4E49\u68C0\u7D22\u5668-\u57FA\u7840\u7248-\u8C03\u6574\u53C2\u6570" aria-hidden="true">#</a> 10.3.2 \u81EA\u5B9A\u4E49\u68C0\u7D22\u5668\uFF08\u57FA\u7840\u7248\uFF1A\u8C03\u6574\u53C2\u6570\uFF09</h3><p>\u6700\u5E38\u7528\u7684\u81EA\u5B9A\u4E49\u65B9\u5F0F\uFF1A\u8C03\u6574\u68C0\u7D22\u6570\u91CF\u3001\u8BBE\u7F6E\u76F8\u4F3C\u5EA6\u9608\u503C\uFF0C\u8FC7\u6EE4\u4F4E\u8D28\u91CF\u68C0\u7D22\u7ED3\u679C\uFF0C\u907F\u514D\u65E0\u6548\u4FE1\u606F\u5E72\u6270 LLM \u751F\u6210\u3002</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from dotenv import load_dotenv
import os

load_dotenv()

# \u521D\u59CB\u5316\u5D4C\u5165\u6A21\u578B\u3001\u5411\u91CF\u6570\u636E\u5E93\u3001LLM\uFF08\u590D\u7528\u524D\u4E00\u8282\u4EE3\u7801\uFF09
embeddings = HuggingFaceEmbeddings(model_name=&quot;all-MiniLM-L6-v2&quot;)
texts = [
    &quot;2023\u5E74\u516C\u53F8\u603B\u8425\u6536100\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F20%&quot;,
    &quot;\u516C\u53F8\u6838\u5FC3\u4E1A\u52A1\u5206\u4E3A\u4E09\u5927\u677F\u5757\uFF1A\u4EBA\u5DE5\u667A\u80FD\u3001\u4E91\u8BA1\u7B97\u3001\u5927\u6570\u636E&quot;,
    &quot;2023\u5E74\u4EBA\u5DE5\u667A\u80FD\u677F\u5757\u8425\u653650\u4EBF\u5143\uFF0C\u5360\u603B\u8425\u6536\u768450%&quot;,
    &quot;\u4E91\u8BA1\u7B97\u677F\u5757\u8425\u653630\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F30%&quot;,
    &quot;\u5927\u6570\u636E\u677F\u5757\u8425\u653620\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F10%&quot;
]
db = Chroma.from_texts(texts=texts, embedding=embeddings, persist_directory=&quot;./custom_retriever_db&quot;)
llm = ChatOpenAI(model_name=&quot;gpt-3.5-turbo&quot;, temperature=0.1, openai_api_key=os.getenv(&quot;OPENAI_API_KEY&quot;))

# \u81EA\u5B9A\u4E49\u68C0\u7D22\u5668\uFF1A\u8C03\u6574k\u503C + \u8BBE\u7F6E\u76F8\u4F3C\u5EA6\u9608\u503C
custom_retriever = db.as_retriever(
    search_kwargs={
        &quot;k&quot;: 2,  # \u53EA\u68C0\u7D22\u524D2\u4E2A\u6700\u76F8\u4F3C\u7684\u6587\u672C\u5757\uFF08\u51CF\u5C11\u65E0\u6548\u4FE1\u606F\uFF09
        &quot;score_threshold&quot;: 0.7  # \u76F8\u4F3C\u5EA6\u9608\u503C\u22650.7\u624D\u4FDD\u7559\uFF0C\u8FC7\u6EE4\u4F4E\u76F8\u4F3C\u5EA6\u7ED3\u679C
    }
)

# \u642D\u5EFA RAG \u95EE\u7B54\u94FE\uFF0C\u4F7F\u7528\u81EA\u5B9A\u4E49\u68C0\u7D22\u5668
rag_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type=&quot;stuff&quot;,
    retriever=custom_retriever,
    return_source_documents=True
)

# \u6D4B\u8BD5\uFF1A\u67E5\u8BE2\u4E0E\u6587\u6863\u76F8\u5173\u6027\u4F4E\u7684\u95EE\u9898\uFF0C\u9A8C\u8BC1\u9608\u503C\u8FC7\u6EE4\u6548\u679C
query = &quot;2023\u5E74\u516C\u53F8\u5458\u5DE5\u4EBA\u6570\u662F\u591A\u5C11\uFF1F&quot;
result = rag_chain({&quot;query&quot;: query})
print(&quot;\u56DE\u7B54\uFF1A&quot;, result[&quot;result&quot;])
print(&quot;\\n\u6765\u6E90\u6587\u6863\uFF1A&quot;, result[&quot;source_documents&quot;])  # \u65E0\u76F8\u5173\u6587\u6863\uFF0C\u8FD4\u56DE\u7A7A\u5217\u8868
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-3-3-\u81EA\u5B9A\u4E49\u68C0\u7D22\u5668-\u8FDB\u9636\u7248-\u7ED3\u5408\u5143\u6570\u636E\u8FC7\u6EE4" tabindex="-1"><a class="header-anchor" href="#_10-3-3-\u81EA\u5B9A\u4E49\u68C0\u7D22\u5668-\u8FDB\u9636\u7248-\u7ED3\u5408\u5143\u6570\u636E\u8FC7\u6EE4" aria-hidden="true">#</a> 10.3.3 \u81EA\u5B9A\u4E49\u68C0\u7D22\u5668\uFF08\u8FDB\u9636\u7248\uFF1A\u7ED3\u5408\u5143\u6570\u636E\u8FC7\u6EE4\uFF09</h3><p>\u5B9E\u9645\u573A\u666F\u4E2D\uFF0C\u6211\u4EEC\u53EF\u80FD\u9700\u8981\u201C\u53EA\u68C0\u7D22\u67D0\u4E2A\u7279\u5B9A\u6761\u4EF6\u7684\u6587\u6863\u201D\uFF08\u5982\u53EA\u68C0\u7D22\u4E91\u8BA1\u7B97\u677F\u5757\u7684\u5185\u5BB9\uFF09\uFF0C\u6B64\u65F6\u53EF\u5728\u68C0\u7D22\u5668\u4E2D\u7ED3\u5408\u5143\u6570\u636E\u8FC7\u6EE4\uFF0C\u7CBE\u51C6\u5B9A\u4F4D\u6240\u9700\u5185\u5BB9\u3002</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from dotenv import load_dotenv
import os

load_dotenv()

embeddings = HuggingFaceEmbeddings(model_name=&quot;all-MiniLM-L6-v2&quot;)

# \u51C6\u5907\u5E26\u5143\u6570\u636E\u7684\u6587\u6863\uFF08\u6A21\u62DF\u4E0D\u540C\u4E1A\u52A1\u677F\u5757\u7684\u6587\u6863\uFF09
texts = [
    &quot;2023\u5E74\u4EBA\u5DE5\u667A\u80FD\u677F\u5757\u8425\u653650\u4EBF\u5143\uFF0C\u5360\u603B\u8425\u6536\u768450%&quot;,
    &quot;\u4E91\u8BA1\u7B97\u677F\u5757\u8425\u653630\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F30%&quot;,
    &quot;\u5927\u6570\u636E\u677F\u5757\u8425\u653620\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F10%&quot;,
    &quot;2022\u5E74\u4EBA\u5DE5\u667A\u80FD\u677F\u5757\u8425\u653640\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F15%&quot;
]
metadatas = [
    {&quot;business&quot;: &quot;\u4EBA\u5DE5\u667A\u80FD&quot;, &quot;year&quot;: 2023},
    {&quot;business&quot;: &quot;\u4E91\u8BA1\u7B97&quot;, &quot;year&quot;: 2023},
    {&quot;business&quot;: &quot;\u5927\u6570\u636E&quot;, &quot;year&quot;: 2023},
    {&quot;business&quot;: &quot;\u4EBA\u5DE5\u667A\u80FD&quot;, &quot;year&quot;: 2022}
]

# \u5B58\u5165\u5411\u91CF\u6570\u636E\u5E93
db = Chroma.from_texts(
    texts=texts,
    embedding=embeddings,
    metadatas=metadatas,
    persist_directory=&quot;./metadata_retriever_db&quot;
)

llm = ChatOpenAI(model_name=&quot;gpt-3.5-turbo&quot;, temperature=0.1, openai_api_key=os.getenv(&quot;OPENAI_API_KEY&quot;))

# \u81EA\u5B9A\u4E49\u68C0\u7D22\u5668\uFF1A\u7ED3\u5408\u5143\u6570\u636E\u8FC7\u6EE4\uFF08\u53EA\u68C0\u7D222023\u5E74\u4EBA\u5DE5\u667A\u80FD\u677F\u5757\u7684\u6587\u6863\uFF09
custom_retriever = db.as_retriever(
    search_kwargs={
        &quot;k&quot;: 2,
        &quot;score_threshold&quot;: 0.7,
        &quot;filter&quot;: {&quot;$and&quot;: [{&quot;year&quot;: 2023}, {&quot;business&quot;: &quot;\u4EBA\u5DE5\u667A\u80FD&quot;}]}  # \u5143\u6570\u636E\u8FC7\u6EE4\u6761\u4EF6
    }
)

# \u642D\u5EFA RAG \u95EE\u7B54\u94FE
rag_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type=&quot;stuff&quot;,
    retriever=custom_retriever,
    return_source_documents=True
)

# \u6D4B\u8BD5\uFF1A\u67E5\u8BE22023\u5E74\u4EBA\u5DE5\u667A\u80FD\u677F\u5757\u8425\u6536
query = &quot;2023\u5E74\u4EBA\u5DE5\u667A\u80FD\u677F\u5757\u8425\u6536\u662F\u591A\u5C11\uFF1F&quot;
result = rag_chain({&quot;query&quot;: query})
print(&quot;\u56DE\u7B54\uFF1A&quot;, result[&quot;result&quot;])
print(&quot;\\n\u6765\u6E90\u6587\u6863\uFF1A&quot;)
for doc in result[&quot;source_documents&quot;]:
    print(f&quot;- \u5185\u5BB9\uFF1A{doc.page_content}\uFF0C\u5143\u6570\u636E\uFF1A{doc.metadata}&quot;)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-3-4-\u81EA\u5B9A\u4E49\u68C0\u7D22\u5668-\u9AD8\u7EA7\u7248-\u81EA\u5B9A\u4E49\u68C0\u7D22\u903B\u8F91" tabindex="-1"><a class="header-anchor" href="#_10-3-4-\u81EA\u5B9A\u4E49\u68C0\u7D22\u5668-\u9AD8\u7EA7\u7248-\u81EA\u5B9A\u4E49\u68C0\u7D22\u903B\u8F91" aria-hidden="true">#</a> 10.3.4 \u81EA\u5B9A\u4E49\u68C0\u7D22\u5668\uFF08\u9AD8\u7EA7\u7248\uFF1A\u81EA\u5B9A\u4E49\u68C0\u7D22\u903B\u8F91\uFF09</h3><p>\u82E5\u4EE5\u4E0A\u65B9\u5F0F\u4ECD\u65E0\u6CD5\u6EE1\u8DB3\u9700\u6C42\uFF0C\u53EF\u901A\u8FC7 LangChain \u7684 BaseRetriever \u7C7B\uFF0C\u5B8C\u5168\u81EA\u5B9A\u4E49\u68C0\u7D22\u903B\u8F91\uFF08\u5982\u5148\u68C0\u7D22\u3001\u518D\u8FC7\u6EE4\u3001\u518D\u6392\u5E8F\uFF09\uFF0C\u7075\u6D3B\u6027\u62C9\u6EE1\u3002</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.retrievers import BaseRetriever
from langchain.schema import Document
from typing import List
from dotenv import load_dotenv
import os

load_dotenv()

# 1. \u81EA\u5B9A\u4E49\u68C0\u7D22\u5668\u7C7B\uFF0C\u7EE7\u627F BaseRetriever
class MyCustomRetriever(BaseRetriever):
    def __init__(self, vector_db):
        self.vector_db = vector_db  # \u5411\u91CF\u6570\u636E\u5E93

    def _get_relevant_documents(self, query: str) -&gt; List[Document]:
        # \u81EA\u5B9A\u4E49\u68C0\u7D22\u903B\u8F91\uFF1A\u5148\u68C0\u7D22\uFF0C\u518D\u8FC7\u6EE4\uFF0C\u518D\u6392\u5E8F
        # \u6B65\u9AA41\uFF1A\u8BED\u4E49\u68C0\u7D22\uFF08\u524D3\u4E2A\u6700\u76F8\u4F3C\uFF09
        docs = self.vector_db.similarity_search(query, k=3)
        # \u6B65\u9AA42\uFF1A\u8FC7\u6EE4\u6389\u957F\u5EA6\u5C0F\u4E8E10\u7684\u6587\u6863\uFF08\u81EA\u5B9A\u4E49\u8FC7\u6EE4\u89C4\u5219\uFF09
        filtered_docs = [doc for doc in docs if len(doc.page_content) &gt;= 10]
        # \u6B65\u9AA43\uFF1A\u6309\u6587\u6863\u957F\u5EA6\u6392\u5E8F\uFF08\u8D8A\u957F\u8D8A\u4F18\u5148\uFF0C\u53EF\u81EA\u5B9A\u4E49\u6392\u5E8F\u89C4\u5219\uFF09
        filtered_docs.sort(key=lambda x: len(x.page_content), reverse=True)
        return filtered_docs

# 2. \u521D\u59CB\u5316\u7EC4\u4EF6
embeddings = HuggingFaceEmbeddings(model_name=&quot;all-MiniLM-L6-v2&quot;)
texts = [
    &quot;2023\u5E74\u516C\u53F8\u603B\u8425\u6536100\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F20%&quot;,
    &quot;\u4EBA\u5DE5\u667A\u80FD\u677F\u5757\u8425\u653650\u4EBF&quot;,  # \u957F\u5EA6\u5C0F\u4E8E10\uFF0C\u4F1A\u88AB\u8FC7\u6EE4
    &quot;\u4E91\u8BA1\u7B97\u677F\u5757\u8425\u653630\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F30%\uFF0C\u662F\u589E\u957F\u6700\u5FEB\u7684\u677F\u5757&quot;,
    &quot;\u5927\u6570\u636E\u677F\u5757\u8425\u653620\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F10%&quot;
]
db = Chroma.from_texts(texts=texts, embedding=embeddings, persist_directory=&quot;./advanced_retriever_db&quot;)
llm = ChatOpenAI(model_name=&quot;gpt-3.5-turbo&quot;, temperature=0.1, openai_api_key=os.getenv(&quot;OPENAI_API_KEY&quot;))

# 3. \u5B9E\u4F8B\u5316\u81EA\u5B9A\u4E49\u68C0\u7D22\u5668
custom_retriever = MyCustomRetriever(vector_db=db)

# 4. \u642D\u5EFA RAG \u95EE\u7B54\u94FE
rag_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type=&quot;stuff&quot;,
    retriever=custom_retriever,
    return_source_documents=True
)

# \u6D4B\u8BD5
query = &quot;2023\u5E74\u5404\u677F\u5757\u8425\u6536\u60C5\u51B5\uFF1F&quot;
result = rag_chain({&quot;query&quot;: query})
print(&quot;\u56DE\u7B54\uFF1A&quot;, result[&quot;result&quot;])
print(&quot;\\n\u6765\u6E90\u6587\u6863\uFF08\u5DF2\u8FC7\u6EE4\u77ED\u6587\u672C\uFF09\uFF1A&quot;)
for doc in result[&quot;source_documents&quot;]:
    print(&quot;-&quot;, doc.page_content)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-3-5-\u5173\u952E\u63D0\u9192" tabindex="-1"><a class="header-anchor" href="#_10-3-5-\u5173\u952E\u63D0\u9192" aria-hidden="true">#</a> 10.3.5 \u5173\u952E\u63D0\u9192</h3><ul><li>\u81EA\u5B9A\u4E49\u68C0\u7D22\u5668\u7684\u6838\u5FC3\u662F\u201C\u6309\u9700\u8C03\u6574\u68C0\u7D22\u903B\u8F91\u201D\uFF0C\u65E0\u9700\u8FC7\u5EA6\u590D\u6742\uFF0C\u80FD\u89E3\u51B3\u5B9E\u9645\u95EE\u9898\u5373\u53EF\uFF1B</li></ul><p>\u81EA\u5B9A\u4E49\u68C0\u7D22\u5668\u7684\u6838\u5FC3\u662F\u201C\u6309\u9700\u8C03\u6574\u68C0\u7D22\u903B\u8F91\u201D\uFF0C\u65E0\u9700\u8FC7\u5EA6\u590D\u6742\uFF0C\u80FD\u89E3\u51B3\u5B9E\u9645\u95EE\u9898\u5373\u53EF\uFF1B</p><ul><li>\u5143\u6570\u636E\u8FC7\u6EE4\u3001\u76F8\u4F3C\u5EA6\u9608\u503C\u662F\u6700\u5E38\u7528\u7684\u81EA\u5B9A\u4E49\u65B9\u5F0F\uFF0C\u4F18\u5148\u638C\u63E1\uFF1B</li></ul><p>\u5143\u6570\u636E\u8FC7\u6EE4\u3001\u76F8\u4F3C\u5EA6\u9608\u503C\u662F\u6700\u5E38\u7528\u7684\u81EA\u5B9A\u4E49\u65B9\u5F0F\uFF0C\u4F18\u5148\u638C\u63E1\uFF1B</p><ul><li>\u5F15\u7528\u6765\u6E90\uFF1ALangChain \u81EA\u5B9A\u4E49\u68C0\u7D22\u5668\u5B98\u65B9\u6587\u6863\u3002</li></ul><p>\u5F15\u7528\u6765\u6E90\uFF1ALangChain \u81EA\u5B9A\u4E49\u68C0\u7D22\u5668\u5B98\u65B9\u6587\u6863\u3002</p><h2 id="_10-4-\u591A\u8DEF\u53EC\u56DE\u4E0E\u91CD\u6392\u5E8F-re-ranking" tabindex="-1"><a class="header-anchor" href="#_10-4-\u591A\u8DEF\u53EC\u56DE\u4E0E\u91CD\u6392\u5E8F-re-ranking" aria-hidden="true">#</a> 10.4 \u591A\u8DEF\u53EC\u56DE\u4E0E\u91CD\u6392\u5E8F\uFF08Re-ranking\uFF09</h2><p>\u5728\u5927\u89C4\u6A21\u6587\u6863\u573A\u666F\u4E2D\uFF0C\u5355\u4E00\u7684\u8BED\u4E49\u68C0\u7D22\uFF08\u57FA\u4E8E\u5411\u91CF\u5D4C\u5165\uFF09\u53EF\u80FD\u5B58\u5728\u201C\u6F0F\u68C0\u201D\u201C\u68C0\u7D22\u7CBE\u5EA6\u4F4E\u201D\u7684\u95EE\u9898\u3002\u6B64\u65F6\u53EF\u91C7\u7528 \u591A\u8DEF\u53EC\u56DE + \u91CD\u6392\u5E8F \u7B56\u7565\uFF0C\u63D0\u5347\u68C0\u7D22\u6548\u679C\u2014\u2014\u591A\u8DEF\u53EC\u56DE\u4ECE\u591A\u4E2A\u6765\u6E90\u83B7\u53D6\u5019\u9009\u6587\u6863\uFF0C\u91CD\u6392\u5E8F\u5BF9\u5019\u9009\u6587\u6863\u8FDB\u884C\u4E8C\u6B21\u6253\u5206\uFF0C\u7B5B\u9009\u51FA\u6700\u76F8\u5173\u7684\u5185\u5BB9\u3002</p><h3 id="_10-4-1-\u6838\u5FC3\u6982\u5FF5\u89E3\u6790" tabindex="-1"><a class="header-anchor" href="#_10-4-1-\u6838\u5FC3\u6982\u5FF5\u89E3\u6790" aria-hidden="true">#</a> 10.4.1 \u6838\u5FC3\u6982\u5FF5\u89E3\u6790</h3><ul><li>\u591A\u8DEF\u53EC\u56DE\uFF1A\u540C\u65F6\u4F7F\u7528\u591A\u79CD\u68C0\u7D22\u65B9\u5F0F\uFF08\u5982\u5411\u91CF\u8BED\u4E49\u68C0\u7D22 + \u5173\u952E\u8BCD\u68C0\u7D22\uFF09\uFF0C\u4ECE\u4E0D\u540C\u7EF4\u5EA6\u83B7\u53D6\u5019\u9009\u6587\u6863\uFF0C\u907F\u514D\u5355\u4E00\u68C0\u7D22\u7684\u5C40\u9650\u6027\uFF1B</li></ul><p>\u591A\u8DEF\u53EC\u56DE\uFF1A\u540C\u65F6\u4F7F\u7528\u591A\u79CD\u68C0\u7D22\u65B9\u5F0F\uFF08\u5982\u5411\u91CF\u8BED\u4E49\u68C0\u7D22 + \u5173\u952E\u8BCD\u68C0\u7D22\uFF09\uFF0C\u4ECE\u4E0D\u540C\u7EF4\u5EA6\u83B7\u53D6\u5019\u9009\u6587\u6863\uFF0C\u907F\u514D\u5355\u4E00\u68C0\u7D22\u7684\u5C40\u9650\u6027\uFF1B</p><ul><li>\u91CD\u6392\u5E8F\uFF08Re-ranking\uFF09\uFF1A\u5BF9\u591A\u8DEF\u53EC\u56DE\u5F97\u5230\u7684\u5019\u9009\u6587\u6863\uFF0C\u4F7F\u7528\u4E13\u95E8\u7684\u91CD\u6392\u5E8F\u6A21\u578B\uFF08\u5982 Cross-BERT\uFF09\u8FDB\u884C\u4E8C\u6B21\u6253\u5206\uFF0C\u7ED3\u5408\u8BED\u4E49\u76F8\u4F3C\u5EA6\u548C\u5173\u952E\u8BCD\u5339\u914D\u5EA6\uFF0C\u6700\u7EC8\u7B5B\u9009\u51FA\u6700\u76F8\u5173\u7684\u6587\u6863\u3002</li></ul><p>\u91CD\u6392\u5E8F\uFF08Re-ranking\uFF09\uFF1A\u5BF9\u591A\u8DEF\u53EC\u56DE\u5F97\u5230\u7684\u5019\u9009\u6587\u6863\uFF0C\u4F7F\u7528\u4E13\u95E8\u7684\u91CD\u6392\u5E8F\u6A21\u578B\uFF08\u5982 Cross-BERT\uFF09\u8FDB\u884C\u4E8C\u6B21\u6253\u5206\uFF0C\u7ED3\u5408\u8BED\u4E49\u76F8\u4F3C\u5EA6\u548C\u5173\u952E\u8BCD\u5339\u914D\u5EA6\uFF0C\u6700\u7EC8\u7B5B\u9009\u51FA\u6700\u76F8\u5173\u7684\u6587\u6863\u3002</p><p>\u7B80\u5355\u6765\u8BF4\uFF1A\u591A\u8DEF\u53EC\u56DE\u201C\u5E7F\u6492\u7F51\u201D\uFF0C\u91CD\u6392\u5E8F\u201C\u7CBE\u7B5B\u9009\u201D\uFF0C\u4E24\u8005\u7ED3\u5408\u80FD\u5927\u5E45\u63D0\u5347\u68C0\u7D22\u7CBE\u5EA6\uFF0C\u9002\u5408\u5927\u89C4\u6A21\u3001\u590D\u6742\u6587\u6863\u573A\u666F\u3002</p><h3 id="_10-4-2-\u591A\u8DEF\u53EC\u56DE\u5B9E\u6218-\u5411\u91CF\u68C0\u7D22-\u5173\u952E\u8BCD\u68C0\u7D22" tabindex="-1"><a class="header-anchor" href="#_10-4-2-\u591A\u8DEF\u53EC\u56DE\u5B9E\u6218-\u5411\u91CF\u68C0\u7D22-\u5173\u952E\u8BCD\u68C0\u7D22" aria-hidden="true">#</a> 10.4.2 \u591A\u8DEF\u53EC\u56DE\u5B9E\u6218\uFF08\u5411\u91CF\u68C0\u7D22 + \u5173\u952E\u8BCD\u68C0\u7D22\uFF09</h3><p>LangChain \u652F\u6301\u7EC4\u5408\u591A\u4E2A\u68C0\u7D22\u5668\uFF0C\u5B9E\u73B0\u591A\u8DEF\u53EC\u56DE\uFF0C\u4EE5\u4E0B\u793A\u4F8B\u7ED3\u5408\u201C\u5411\u91CF\u8BED\u4E49\u68C0\u7D22\u201D\u548C\u201C\u5173\u952E\u8BCD\u68C0\u7D22\u201D\uFF0C\u83B7\u53D6\u66F4\u5168\u9762\u7684\u5019\u9009\u6587\u6863\u3002</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.retrievers import EnsembleRetriever  # \u7528\u4E8E\u7EC4\u5408\u591A\u4E2A\u68C0\u7D22\u5668
from langchain.retrievers import BM25Retriever  # \u5173\u952E\u8BCD\u68C0\u7D22\u5668
from dotenv import load_dotenv
import os

load_dotenv()

# 1. \u521D\u59CB\u5316\u5D4C\u5165\u6A21\u578B\u548C\u5411\u91CF\u6570\u636E\u5E93\uFF08\u5411\u91CF\u68C0\u7D22\u6E90\uFF09
embeddings = HuggingFaceEmbeddings(model_name=&quot;all-MiniLM-L6-v2&quot;)
texts = [
    &quot;2023\u5E74\u516C\u53F8\u603B\u8425\u6536100\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F20%&quot;,
    &quot;\u516C\u53F8\u6838\u5FC3\u4E1A\u52A1\uFF1A\u4EBA\u5DE5\u667A\u80FD\u3001\u4E91\u8BA1\u7B97\u3001\u5927\u6570\u636E&quot;,
    &quot;\u4EBA\u5DE5\u667A\u80FD\u677F\u5757\u8425\u653650\u4EBF\u5143\uFF0C\u5360\u603B\u8425\u653650%&quot;,
    &quot;\u4E91\u8BA1\u7B97\u677F\u5757\u8425\u653630\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F30%&quot;,
    &quot;\u5927\u6570\u636E\u677F\u5757\u8425\u653620\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F10%&quot;
]
db = Chroma.from_texts(texts=texts, embedding=embeddings, persist_directory=&quot;./multi_retriever_db&quot;)
vector_retriever = db.as_retriever(k=3)  # \u5411\u91CF\u68C0\u7D22\u5668

# 2. \u521D\u59CB\u5316\u5173\u952E\u8BCD\u68C0\u7D22\u5668\uFF08BM25Retriever\uFF0C\u4F20\u7EDF\u5173\u952E\u8BCD\u68C0\u7D22\uFF09
bm25_retriever = BM25Retriever.from_texts(texts=texts)
bm25_retriever.k = 3  # \u5173\u952E\u8BCD\u68C0\u7D22\u524D3\u4E2A\u7ED3\u679C

# 3. \u591A\u8DEF\u53EC\u56DE\uFF1A\u7EC4\u5408\u5411\u91CF\u68C0\u7D22\u5668\u548C\u5173\u952E\u8BCD\u68C0\u7D22\u5668
ensemble_retriever = EnsembleRetriever(
    retrievers=[vector_retriever, bm25_retriever],  # \u591A\u4E2A\u68C0\u7D22\u5668
    weights=[0.7, 0.3]  # \u6743\u91CD\uFF1A\u5411\u91CF\u68C0\u7D22\u536070%\uFF0C\u5173\u952E\u8BCD\u68C0\u7D22\u536030%
)

# 4. \u521D\u59CB\u5316 LLM \u548C RAG \u95EE\u7B54\u94FE
llm = ChatOpenAI(model_name=&quot;gpt-3.5-turbo&quot;, temperature=0.1, openai_api_key=os.getenv(&quot;OPENAI_API_KEY&quot;))
rag_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type=&quot;stuff&quot;,
    retriever=ensemble_retriever,
    return_source_documents=True
)

# \u6D4B\u8BD5\uFF1A\u67E5\u8BE2\u540C\u65F6\u5305\u542B\u5173\u952E\u8BCD\u548C\u8BED\u4E49\u76F8\u5173\u7684\u5185\u5BB9
query = &quot;2023\u5E74\u8425\u6536\u589E\u957F\u60C5\u51B5\uFF1F&quot;
result = rag_chain({&quot;query&quot;: query})
print(&quot;\u56DE\u7B54\uFF1A&quot;, result[&quot;result&quot;])
print(&quot;\\n\u591A\u8DEF\u53EC\u56DE\u7684\u6765\u6E90\u6587\u6863\uFF1A&quot;)
for doc in result[&quot;source_documents&quot;]:
    print(&quot;-&quot;, doc.page_content)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-4-3-\u91CD\u6392\u5E8F-re-ranking-\u5B9E\u6218" tabindex="-1"><a class="header-anchor" href="#_10-4-3-\u91CD\u6392\u5E8F-re-ranking-\u5B9E\u6218" aria-hidden="true">#</a> 10.4.3 \u91CD\u6392\u5E8F\uFF08Re-ranking\uFF09\u5B9E\u6218</h3><p>\u591A\u8DEF\u53EC\u56DE\u5F97\u5230\u5019\u9009\u6587\u6863\u540E\uFF0C\u4F7F\u7528\u91CD\u6392\u5E8F\u6A21\u578B\uFF08\u5982 CrossEncoder\uFF09\u5BF9\u5019\u9009\u6587\u6863\u8FDB\u884C\u4E8C\u6B21\u6253\u5206\uFF0C\u7B5B\u9009\u51FA\u6700\u76F8\u5173\u7684\u5185\u5BB9\uFF0C\u63D0\u5347\u68C0\u7D22\u7CBE\u5EA6\u3002LangChain \u96C6\u6210\u4E86 Sentence-Transformers \u7684\u91CD\u6392\u5E8F\u6A21\u578B\uFF0C\u4F7F\u7528\u7B80\u5355\u3002</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CrossEncoderReranker
from dotenv import load_dotenv
import os

load_dotenv()

# 1. \u521D\u59CB\u5316\u57FA\u7840\u7EC4\u4EF6
embeddings = HuggingFaceEmbeddings(model_name=&quot;all-MiniLM-L6-v2&quot;)
texts = [
    &quot;2023\u5E74\u516C\u53F8\u603B\u8425\u6536100\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F20%&quot;,
    &quot;\u516C\u53F8\u6838\u5FC3\u4E1A\u52A1\uFF1A\u4EBA\u5DE5\u667A\u80FD\u3001\u4E91\u8BA1\u7B97\u3001\u5927\u6570\u636E&quot;,
    &quot;\u4EBA\u5DE5\u667A\u80FD\u677F\u5757\u8425\u653650\u4EBF\u5143\uFF0C\u5360\u603B\u8425\u653650%&quot;,
    &quot;\u4E91\u8BA1\u7B97\u677F\u5757\u8425\u653630\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F30%&quot;,
    &quot;\u5927\u6570\u636E\u677F\u5757\u8425\u653620\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F10%&quot;,
    &quot;2023\u5E74\u516C\u53F8\u7814\u53D1\u6295\u516515\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F25%&quot;  # \u4E0E\u67E5\u8BE2\u76F8\u5173\u6027\u4F4E
]
db = Chroma.from_texts(texts=texts, embedding=embeddings, persist_directory=&quot;./rerank_db&quot;)
vector_retriever = db.as_retriever(k=4)  # \u5148\u83B7\u53D64\u4E2A\u5019\u9009\u6587\u6863

# 2. \u521D\u59CB\u5316\u91CD\u6392\u5E8F\u6A21\u578B\uFF08CrossEncoder\uFF0C\u4E13\u95E8\u7528\u4E8E\u6587\u6863\u91CD\u6392\u5E8F\uFF09
reranker = CrossEncoderReranker(
    model_name=&quot;cross-encoder/ms-marco-MiniLM-L-6-v2&quot;,  # \u8F7B\u91CF\u91CD\u6392\u5E8F\u6A21\u578B
    top_n=3  # \u91CD\u6392\u5E8F\u540E\u4FDD\u7559\u524D3\u4E2A\u6700\u76F8\u5173\u7684\u6587\u6863
)

# 3. \u7ED3\u5408\u68C0\u7D22\u5668\u548C\u91CD\u6392\u5E8F\u6A21\u578B
compression_retriever = ContextualCompressionRetriever(
    base_retriever=vector_retriever,
    base_compressor=reranker
)

# 4. \u642D\u5EFA RAG \u95EE\u7B54\u94FE
llm = ChatOpenAI(model_name=&quot;gpt-3.5-turbo&quot;, temperature=0.1, openai_api_key=os.getenv(&quot;OPENAI_API_KEY&quot;))
rag_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type=&quot;stuff&quot;,
    retriever=compression_retriever,
    return_source_documents=True
)

# \u6D4B\u8BD5\uFF1A\u91CD\u6392\u5E8F\u4F1A\u8FC7\u6EE4\u6389\u76F8\u5173\u6027\u4F4E\u7684\u6587\u6863\uFF08\u5982\u7814\u53D1\u6295\u5165\u76F8\u5173\uFF09
query = &quot;2023\u5E74\u5404\u677F\u5757\u8425\u6536\u60C5\u51B5\uFF1F&quot;
result = rag_chain({&quot;query&quot;: query})
print(&quot;\u56DE\u7B54\uFF1A&quot;, result[&quot;result&quot;])
print(&quot;\\n\u91CD\u6392\u5E8F\u540E\u7684\u6765\u6E90\u6587\u6863\uFF1A&quot;)
for doc in result[&quot;source_documents&quot;]:
    print(&quot;-&quot;, doc.page_content)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-4-4-\u5173\u952E\u63D0\u9192" tabindex="-1"><a class="header-anchor" href="#_10-4-4-\u5173\u952E\u63D0\u9192" aria-hidden="true">#</a> 10.4.4 \u5173\u952E\u63D0\u9192</h3><ul><li>\u591A\u8DEF\u53EC\u56DE\u9002\u5408\u5927\u89C4\u6A21\u6587\u6863\u573A\u666F\uFF0C\u5C0F\u89C4\u6A21\u6587\u6863\uFF08\u5982\u4E2A\u4EBA\u77E5\u8BC6\u5E93\uFF09\u65E0\u9700\u4F7F\u7528\uFF0C\u907F\u514D\u589E\u52A0\u590D\u6742\u5EA6\uFF1B</li></ul><p>\u591A\u8DEF\u53EC\u56DE\u9002\u5408\u5927\u89C4\u6A21\u6587\u6863\u573A\u666F\uFF0C\u5C0F\u89C4\u6A21\u6587\u6863\uFF08\u5982\u4E2A\u4EBA\u77E5\u8BC6\u5E93\uFF09\u65E0\u9700\u4F7F\u7528\uFF0C\u907F\u514D\u589E\u52A0\u590D\u6742\u5EA6\uFF1B</p><ul><li>\u91CD\u6392\u5E8F\u6A21\u578B\u4F1A\u589E\u52A0\u4E00\u5B9A\u7684\u8BA1\u7B97\u6210\u672C\uFF0C\u53EF\u6839\u636E\u7CBE\u5EA6\u9700\u6C42\u9009\u62E9\u662F\u5426\u4F7F\u7528\uFF08\u8F7B\u91CF\u6A21\u578B\u5982 ms-marco-MiniLM-L-6-v2 \u901F\u5EA6\u8F83\u5FEB\uFF09\uFF1B</li></ul><p>\u91CD\u6392\u5E8F\u6A21\u578B\u4F1A\u589E\u52A0\u4E00\u5B9A\u7684\u8BA1\u7B97\u6210\u672C\uFF0C\u53EF\u6839\u636E\u7CBE\u5EA6\u9700\u6C42\u9009\u62E9\u662F\u5426\u4F7F\u7528\uFF08\u8F7B\u91CF\u6A21\u578B\u5982 ms-marco-MiniLM-L-6-v2 \u901F\u5EA6\u8F83\u5FEB\uFF09\uFF1B</p><ul><li>\u5F15\u7528\u6765\u6E90\uFF1ALangChain \u591A\u8DEF\u53EC\u56DE\u6587\u6863\u3001LangChain \u91CD\u6392\u5E8F\u6587\u6863\u3002</li></ul><p>\u5F15\u7528\u6765\u6E90\uFF1ALangChain \u591A\u8DEF\u53EC\u56DE\u6587\u6863\u3001LangChain \u91CD\u6392\u5E8F\u6587\u6863\u3002</p><h2 id="_10-5-\u67E5\u8BE2\u6269\u5C55\u4E0E-hyde-\u6280\u672F" tabindex="-1"><a class="header-anchor" href="#_10-5-\u67E5\u8BE2\u6269\u5C55\u4E0E-hyde-\u6280\u672F" aria-hidden="true">#</a> 10.5 \u67E5\u8BE2\u6269\u5C55\u4E0E HyDE \u6280\u672F</h2><p>\u5728 RAG \u7CFB\u7EDF\u4E2D\uFF0C\u7528\u6237\u7684\u67E5\u8BE2\u5F80\u5F80\u6BD4\u8F83\u7B80\u77ED\u3001\u6A21\u7CCA\uFF08\u5982\u201C\u516C\u53F8\u8425\u6536\u201D\uFF09\uFF0C\u76F4\u63A5\u68C0\u7D22\u53EF\u80FD\u65E0\u6CD5\u7CBE\u51C6\u5339\u914D\u5230\u76F8\u5173\u6587\u6863\u3002\u6B64\u65F6\u53EF\u901A\u8FC7 \u67E5\u8BE2\u6269\u5C55 \u6216 **HyDE\uFF08Hypothetical Document Embeddings\uFF0C\u5047\u8BBE\u6587\u6863\u5D4C\u5165\uFF09**\u6280\u672F\uFF0C\u4F18\u5316\u67E5\u8BE2\u5411\u91CF\uFF0C\u63D0\u5347\u68C0\u7D22\u7CBE\u5EA6\u3002</p><h3 id="_10-5-1-\u67E5\u8BE2\u6269\u5C55-query-expansion" tabindex="-1"><a class="header-anchor" href="#_10-5-1-\u67E5\u8BE2\u6269\u5C55-query-expansion" aria-hidden="true">#</a> 10.5.1 \u67E5\u8BE2\u6269\u5C55\uFF08Query Expansion\uFF09</h3><h4 id="\u6838\u5FC3\u539F\u7406" tabindex="-1"><a class="header-anchor" href="#\u6838\u5FC3\u539F\u7406" aria-hidden="true">#</a> \u6838\u5FC3\u539F\u7406</h4><p>\u67E5\u8BE2\u6269\u5C55\u662F\u901A\u8FC7\u201C\u6269\u5C55\u7528\u6237\u67E5\u8BE2\u7684\u5173\u952E\u8BCD\u201D\uFF0C\u751F\u6210\u591A\u4E2A\u76F8\u4F3C\u7684\u67E5\u8BE2\u8BED\u53E5\uFF0C\u518D\u5C06\u8FD9\u4E9B\u67E5\u8BE2\u8BED\u53E5\u7684\u5D4C\u5165\u5411\u91CF\u8FDB\u884C\u878D\u5408\uFF0C\u6700\u7EC8\u7528\u4E8E\u68C0\u7D22\u2014\u2014\u8BA9\u68C0\u7D22\u66F4\u5168\u9762\uFF0C\u907F\u514D\u56E0\u67E5\u8BE2\u592A\u7B80\u77ED\u5BFC\u81F4\u7684\u6F0F\u68C0\u3002</p><p>\u793A\u4F8B\uFF1A\u7528\u6237\u67E5\u8BE2\u201C\u516C\u53F8\u8425\u6536\u201D\uFF0C\u53EF\u6269\u5C55\u4E3A\u201C2023\u5E74\u516C\u53F8\u603B\u8425\u6536\u201D\u201C\u516C\u53F8\u5404\u677F\u5757\u8425\u6536\u60C5\u51B5\u201D\u201C\u516C\u53F8\u8425\u6536\u540C\u6BD4\u589E\u957F\u6570\u636E\u201D\u3002</p><h4 id="\u4EE3\u7801\u793A\u4F8B-langchain-\u5B9E\u73B0\u67E5\u8BE2\u6269\u5C55" tabindex="-1"><a class="header-anchor" href="#\u4EE3\u7801\u793A\u4F8B-langchain-\u5B9E\u73B0\u67E5\u8BE2\u6269\u5C55" aria-hidden="true">#</a> \u4EE3\u7801\u793A\u4F8B\uFF08LangChain \u5B9E\u73B0\u67E5\u8BE2\u6269\u5C55\uFF09</h4><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.retrievers import QueryExpansionRetriever
from dotenv import load_dotenv
import os

load_dotenv()

# 1. \u521D\u59CB\u5316\u57FA\u7840\u7EC4\u4EF6
embeddings = HuggingFaceEmbeddings(model_name=&quot;all-MiniLM-L6-v2&quot;)
texts = [
    &quot;2023\u5E74\u516C\u53F8\u603B\u8425\u6536100\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F20%&quot;,
    &quot;\u4EBA\u5DE5\u667A\u80FD\u677F\u5757\u8425\u653650\u4EBF\u5143\uFF0C\u5360\u603B\u8425\u653650%&quot;,
    &quot;\u4E91\u8BA1\u7B97\u677F\u5757\u8425\u653630\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F30%&quot;,
    &quot;\u5927\u6570\u636E\u677F\u5757\u8425\u653620\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F10%&quot;
]
db = Chroma.from_texts(texts=texts, embedding=embeddings, persist_directory=&quot;./query_expansion_db&quot;)
vector_retriever = db.as_retriever(k=3)

# 2. \u521D\u59CB\u5316 LLM\uFF08\u7528\u4E8E\u751F\u6210\u6269\u5C55\u67E5\u8BE2\uFF09
llm = ChatOpenAI(model_name=&quot;gpt-3.5-turbo&quot;, temperature=0.1, openai_api_key=os.getenv(&quot;OPENAI_API_KEY&quot;))

# 3. \u521D\u59CB\u5316\u67E5\u8BE2\u6269\u5C55\u68C0\u7D22\u5668
expansion_retriever = QueryExpansionRetriever(
    base_retriever=vector_retriever,
    llm=llm,
    expansion_query=&quot;\u8BF7\u5C06\u7528\u6237\u7684\u67E5\u8BE2\u6269\u5C55\u4E3A3\u4E2A\u66F4\u5177\u4F53\u3001\u66F4\u8BE6\u7EC6\u7684\u76F8\u5173\u67E5\u8BE2\uFF0C\u7528\u4E8E\u68C0\u7D22\u6587\u6863\uFF0C\u65E0\u9700\u591A\u4F59\u89E3\u91CA\uFF0C\u7528\u9017\u53F7\u5206\u9694\u3002&quot;
)

# 4. \u642D\u5EFA RAG \u95EE\u7B54\u94FE
rag_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type=&quot;stuff&quot;,
    retriever=expansion_retriever,
    return_source_documents=True
)

# \u6D4B\u8BD5\uFF1A\u7B80\u77ED\u67E5\u8BE2\uFF0C\u9A8C\u8BC1\u6269\u5C55\u6548\u679C
query = &quot;\u516C\u53F8\u8425\u6536&quot;
result = rag_chain({&quot;query&quot;: query})
print(&quot;\u56DE\u7B54\uFF1A&quot;, result[&quot;result&quot;])
print(&quot;\\n\u6765\u6E90\u6587\u6863\uFF1A&quot;)
for doc in result[&quot;source_documents&quot;]:
    print(&quot;-&quot;, doc.page_content)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-5-2-hyde-\u6280\u672F-\u5047\u8BBE\u6587\u6863\u5D4C\u5165" tabindex="-1"><a class="header-anchor" href="#_10-5-2-hyde-\u6280\u672F-\u5047\u8BBE\u6587\u6863\u5D4C\u5165" aria-hidden="true">#</a> 10.5.2 HyDE \u6280\u672F\uFF08\u5047\u8BBE\u6587\u6863\u5D4C\u5165\uFF09</h3><h4 id="\u6838\u5FC3\u539F\u7406-1" tabindex="-1"><a class="header-anchor" href="#\u6838\u5FC3\u539F\u7406-1" aria-hidden="true">#</a> \u6838\u5FC3\u539F\u7406</h4><p>HyDE \u662F\u6BD4\u67E5\u8BE2\u6269\u5C55\u66F4\u9AD8\u7EA7\u7684\u4F18\u5316\u6280\u672F\uFF0C\u6838\u5FC3\u903B\u8F91\uFF1A</p><ul><li>\u6839\u636E\u7528\u6237\u67E5\u8BE2\uFF0C\u8BA9 LLM \u751F\u6210\u4E00\u4E2A\u201C\u5047\u8BBE\u6027\u7684\u6587\u6863\u201D\uFF08\u5373\u5047\u8BBE\u5B58\u5728\u4E00\u7BC7\u80FD\u5B8C\u7F8E\u56DE\u7B54\u8BE5\u67E5\u8BE2\u7684\u6587\u6863\uFF09\uFF1B</li></ul><p>\u6839\u636E\u7528\u6237\u67E5\u8BE2\uFF0C\u8BA9 LLM \u751F\u6210\u4E00\u4E2A\u201C\u5047\u8BBE\u6027\u7684\u6587\u6863\u201D\uFF08\u5373\u5047\u8BBE\u5B58\u5728\u4E00\u7BC7\u80FD\u5B8C\u7F8E\u56DE\u7B54\u8BE5\u67E5\u8BE2\u7684\u6587\u6863\uFF09\uFF1B</p><ul><li>\u5C06\u8FD9\u4E2A\u201C\u5047\u8BBE\u6027\u6587\u6863\u201D\u751F\u6210\u5D4C\u5165\u5411\u91CF\uFF0C\u7528\u8BE5\u5411\u91CF\u8FDB\u884C\u68C0\u7D22\uFF1B</li></ul><p>\u5C06\u8FD9\u4E2A\u201C\u5047\u8BBE\u6027\u6587\u6863\u201D\u751F\u6210\u5D4C\u5165\u5411\u91CF\uFF0C\u7528\u8BE5\u5411\u91CF\u8FDB\u884C\u68C0\u7D22\uFF1B</p><ul><li>\u7531\u4E8E\u5047\u8BBE\u6027\u6587\u6863\u5305\u542B\u66F4\u4E30\u5BCC\u7684\u8BED\u4E49\u4FE1\u606F\uFF0C\u68C0\u7D22\u7CBE\u5EA6\u4F1A\u6BD4\u76F4\u63A5\u7528\u7528\u6237\u67E5\u8BE2\u5411\u91CF\u66F4\u9AD8\u3002</li></ul><p>\u7531\u4E8E\u5047\u8BBE\u6027\u6587\u6863\u5305\u542B\u66F4\u4E30\u5BCC\u7684\u8BED\u4E49\u4FE1\u606F\uFF0C\u68C0\u7D22\u7CBE\u5EA6\u4F1A\u6BD4\u76F4\u63A5\u7528\u7528\u6237\u67E5\u8BE2\u5411\u91CF\u66F4\u9AD8\u3002</p><p>\u793A\u4F8B\uFF1A\u7528\u6237\u67E5\u8BE2\u201C\u516C\u53F8\u8425\u6536\u201D\uFF0CLLM \u751F\u6210\u5047\u8BBE\u6587\u6863\u201C2023\u5E74\u516C\u53F8\u603B\u8425\u6536100\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F20%\uFF0C\u5176\u4E2D\u4EBA\u5DE5\u667A\u80FD\u677F\u575750\u4EBF\u5143\uFF0C\u4E91\u8BA1\u7B97\u677F\u575730\u4EBF\u5143\uFF0C\u5927\u6570\u636E\u677F\u575720\u4EBF\u5143\u201D\uFF0C\u7528\u8BE5\u6587\u6863\u7684\u5411\u91CF\u68C0\u7D22\uFF0C\u80FD\u66F4\u7CBE\u51C6\u5339\u914D\u5230\u76F8\u5173\u6587\u6863\u3002</p><h4 id="\u4EE3\u7801\u793A\u4F8B-langchain-\u5B9E\u73B0-hyde" tabindex="-1"><a class="header-anchor" href="#\u4EE3\u7801\u793A\u4F8B-langchain-\u5B9E\u73B0-hyde" aria-hidden="true">#</a> \u4EE3\u7801\u793A\u4F8B\uFF08LangChain \u5B9E\u73B0 HyDE\uFF09</h4><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.retrievers import HypotheticalDocumentEmbedder  # HyDE \u68C0\u7D22\u5668
from dotenv import load_dotenv
import os

load_dotenv()

# 1. \u521D\u59CB\u5316\u57FA\u7840\u7EC4\u4EF6
embeddings = HuggingFaceEmbeddings(model_name=&quot;all-MiniLM-L6-v2&quot;)
texts = [
    &quot;2023\u5E74\u516C\u53F8\u603B\u8425\u6536100\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F20%&quot;,
    &quot;\u4EBA\u5DE5\u667A\u80FD\u677F\u5757\u8425\u653650\u4EBF\u5143\uFF0C\u5360\u603B\u8425\u653650%&quot;,
    &quot;\u4E91\u8BA1\u7B97\u677F\u5757\u8425\u653630\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F30%&quot;,
    &quot;\u5927\u6570\u636E\u677F\u5757\u8425\u653620\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F10%&quot;
]
db = Chroma.from_texts(texts=texts, embedding=embeddings, persist_directory=&quot;./hyde_db&quot;)
vector_retriever = db.as_retriever(k=3)

# 2. \u521D\u59CB\u5316 LLM\uFF08\u7528\u4E8E\u751F\u6210\u5047\u8BBE\u6027\u6587\u6863\uFF09
llm = ChatOpenAI(model_name=&quot;gpt-3.5-turbo&quot;, temperature=0.1, openai_api_key=os.getenv(&quot;OPENAI_API_KEY&quot;))

# 3. \u521D\u59CB\u5316 HyDE \u68C0\u7D22\u5668
hyde_retriever = HypotheticalDocumentEmbedder(
    base_retriever=vector_retriever,
    llm=llm,
    prompt=&quot;\u8BF7\u6839\u636E\u7528\u6237\u7684\u67E5\u8BE2\uFF0C\u751F\u6210\u4E00\u7BC7\u80FD\u5B8C\u7F8E\u56DE\u7B54\u8BE5\u67E5\u8BE2\u7684\u5047\u8BBE\u6027\u6587\u6863\uFF0C\u5185\u5BB9\u8BE6\u7EC6\u3001\u5177\u4F53\uFF0C\u65E0\u9700\u591A\u4F59\u89E3\u91CA\u3002&quot;
)

# 4. \u642D\u5EFA RAG \u95EE\u7B54\u94FE
rag_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type=&quot;stuff&quot;,
    retriever=hyde_retriever,
    return_source_documents=True
)

# \u6D4B\u8BD5\uFF1A\u7B80\u77ED\u67E5\u8BE2\uFF0C\u9A8C\u8BC1 HyDE \u6548\u679C
query = &quot;\u516C\u53F8\u8425\u6536&quot;
result = rag_chain({&quot;query&quot;: query})
print(&quot;\u56DE\u7B54\uFF1A&quot;, result[&quot;result&quot;])
print(&quot;\\n\u6765\u6E90\u6587\u6863\uFF1A&quot;)
for doc in result[&quot;source_documents&quot;]:
    print(&quot;-&quot;, doc.page_content)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-5-3-\u5BF9\u6BD4\u4E0E\u9009\u578B\u5EFA\u8BAE" tabindex="-1"><a class="header-anchor" href="#_10-5-3-\u5BF9\u6BD4\u4E0E\u9009\u578B\u5EFA\u8BAE" aria-hidden="true">#</a> 10.5.3 \u5BF9\u6BD4\u4E0E\u9009\u578B\u5EFA\u8BAE</h3><p>\u5F15\u7528\u6765\u6E90\uFF1ALangChain \u67E5\u8BE2\u6269\u5C55\u6587\u6863\u3001LangChain HyDE \u5B98\u65B9\u6587\u6863\u3002</p><h2 id="_10-6-\u5904\u7406\u957F\u6587\u6863-\u5206\u5757\u7B56\u7565\u4F18\u5316" tabindex="-1"><a class="header-anchor" href="#_10-6-\u5904\u7406\u957F\u6587\u6863-\u5206\u5757\u7B56\u7565\u4F18\u5316" aria-hidden="true">#</a> 10.6 \u5904\u7406\u957F\u6587\u6863\uFF1A\u5206\u5757\u7B56\u7565\u4F18\u5316</h2><p>\u5728\u5B9E\u9645 RAG \u573A\u666F\u4E2D\uFF0C\u6211\u4EEC\u7ECF\u5E38\u4F1A\u9047\u5230\u957F\u6587\u6863\uFF08\u5982\u516C\u53F8\u5E74\u62A5\u3001\u6280\u672F\u624B\u518C\uFF0C\u5355\u7BC7\u6587\u6863\u51E0\u4E07\u5B57\uFF09\uFF0C\u76F4\u63A5\u5C06\u957F\u6587\u6863\u751F\u6210\u5D4C\u5165\u4F1A\u5BFC\u81F4\u201C\u8BED\u4E49\u4FE1\u606F\u4E22\u5931\u201D\uFF0C\u68C0\u7D22\u7CBE\u5EA6\u5927\u5E45\u4E0B\u964D\u3002\u6B64\u65F6\uFF0C\u5206\u5757\u7B56\u7565\u4F18\u5316 \u5C31\u6210\u4E3A\u5173\u952E\u2014\u2014\u5C06\u957F\u6587\u6863\u5206\u5272\u4E3A\u5408\u7406\u5927\u5C0F\u7684\u6587\u672C\u5757\uFF0C\u65E2\u4FDD\u7559\u4E0A\u4E0B\u6587\u4FE1\u606F\uFF0C\u53C8\u80FD\u8BA9\u5D4C\u5165\u5411\u91CF\u7CBE\u51C6\u6355\u6349\u8BED\u4E49\u3002</p><h3 id="_10-6-1-\u957F\u6587\u6863\u5206\u5757\u7684\u6838\u5FC3\u75DB\u70B9" tabindex="-1"><a class="header-anchor" href="#_10-6-1-\u957F\u6587\u6863\u5206\u5757\u7684\u6838\u5FC3\u75DB\u70B9" aria-hidden="true">#</a> 10.6.1 \u957F\u6587\u6863\u5206\u5757\u7684\u6838\u5FC3\u75DB\u70B9</h3><ul><li>\u5206\u5757\u8FC7\u5927\uFF1A\u5D4C\u5165\u5411\u91CF\u65E0\u6CD5\u7CBE\u51C6\u6355\u6349\u6587\u672C\u8BED\u4E49\uFF0C\u68C0\u7D22\u65F6\u5BB9\u6613\u5339\u914D\u5230\u65E0\u5173\u5185\u5BB9\uFF1B</li></ul><p>\u5206\u5757\u8FC7\u5927\uFF1A\u5D4C\u5165\u5411\u91CF\u65E0\u6CD5\u7CBE\u51C6\u6355\u6349\u6587\u672C\u8BED\u4E49\uFF0C\u68C0\u7D22\u65F6\u5BB9\u6613\u5339\u914D\u5230\u65E0\u5173\u5185\u5BB9\uFF1B</p><ul><li>\u5206\u5757\u8FC7\u5C0F\uFF1A\u4E0A\u4E0B\u6587\u4FE1\u606F\u4E22\u5931\uFF08\u5982\u4E00\u53E5\u8BDD\u88AB\u5206\u5272\u6210\u4E24\u6BB5\uFF09\uFF0CLLM \u751F\u6210\u56DE\u7B54\u65F6\u65E0\u6CD5\u7406\u89E3\u5B8C\u6574\u903B\u8F91\uFF1B</li></ul><p>\u5206\u5757\u8FC7\u5C0F\uFF1A\u4E0A\u4E0B\u6587\u4FE1\u606F\u4E22\u5931\uFF08\u5982\u4E00\u53E5\u8BDD\u88AB\u5206\u5272\u6210\u4E24\u6BB5\uFF09\uFF0CLLM \u751F\u6210\u56DE\u7B54\u65F6\u65E0\u6CD5\u7406\u89E3\u5B8C\u6574\u903B\u8F91\uFF1B</p><ul><li>\u65E0\u89C4\u5219\u5206\u5757\uFF1A\u5206\u5272\u65F6\u7834\u574F\u6587\u672C\u7ED3\u6784\uFF08\u5982\u6807\u9898\u4E0E\u5185\u5BB9\u5206\u79BB\uFF09\uFF0C\u5BFC\u81F4\u68C0\u7D22\u548C\u751F\u6210\u6548\u679C\u53D8\u5DEE\u3002</li></ul><p>\u65E0\u89C4\u5219\u5206\u5757\uFF1A\u5206\u5272\u65F6\u7834\u574F\u6587\u672C\u7ED3\u6784\uFF08\u5982\u6807\u9898\u4E0E\u5185\u5BB9\u5206\u79BB\uFF09\uFF0C\u5BFC\u81F4\u68C0\u7D22\u548C\u751F\u6210\u6548\u679C\u53D8\u5DEE\u3002</p><h3 id="_10-6-2-langchain-\u5E38\u7528\u5206\u5757\u7B56\u7565-\u5B9E\u6218\u9996\u9009" tabindex="-1"><a class="header-anchor" href="#_10-6-2-langchain-\u5E38\u7528\u5206\u5757\u7B56\u7565-\u5B9E\u6218\u9996\u9009" aria-hidden="true">#</a> 10.6.2 LangChain \u5E38\u7528\u5206\u5757\u7B56\u7565\uFF08\u5B9E\u6218\u9996\u9009\uFF09</h3><p>LangChain \u63D0\u4F9B\u4E86\u591A\u79CD\u5206\u5757\u5668\uFF0C\u5176\u4E2D RecursiveCharacterTextSplitter \u662F\u6700\u5E38\u7528\u3001\u6700\u63A8\u8350\u7684\u5206\u5757\u5668\uFF0C\u652F\u6301\u6309\u5B57\u7B26\u5206\u5272\u3001\u4FDD\u7559\u4E0A\u4E0B\u6587\u91CD\u53E0\uFF0C\u9002\u5408\u5927\u591A\u6570\u957F\u6587\u6863\u573A\u666F\u3002\u4EE5\u4E0B\u8BB2\u89E3\u5176\u6838\u5FC3\u53C2\u6570\u548C\u4F18\u5316\u6280\u5DE7\u3002</p><h4 id="_1-\u57FA\u7840\u5206\u5757-recursivecharactertextsplitter" tabindex="-1"><a class="header-anchor" href="#_1-\u57FA\u7840\u5206\u5757-recursivecharactertextsplitter" aria-hidden="true">#</a> 1. \u57FA\u7840\u5206\u5757\uFF08RecursiveCharacterTextSplitter\uFF09</h4><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain.text_splitter import RecursiveCharacterTextSplitter

# \u6A21\u62DF\u957F\u6587\u6863\uFF08\u516C\u53F8\u5E74\u62A5\u7247\u6BB5\uFF09
long_document = &quot;&quot;&quot;2023\u5E74\u516C\u53F8\u5E74\u5EA6\u62A5\u544A
\u4E00\u3001\u516C\u53F8\u6982\u51B5
\u672C\u516C\u53F8\u6210\u7ACB\u4E8E2010\u5E74\uFF0C\u4E13\u6CE8\u4E8E\u4EBA\u5DE5\u667A\u80FD\u3001\u4E91\u8BA1\u7B97\u3001\u5927\u6570\u636E\u4E09\u5927\u6838\u5FC3\u4E1A\u52A1\uFF0C\u7ECF\u8FC713\u5E74\u7684\u53D1\u5C55\uFF0C\u5DF2\u6210\u4E3A\u884C\u4E1A\u9886\u5148\u7684\u79D1\u6280\u4F01\u4E1A\uFF0C\u5458\u5DE5\u4EBA\u6570\u8D85\u8FC71000\u4EBA\uFF0C\u4E1A\u52A1\u8986\u76D6\u5168\u56FD30\u4E2A\u7701\u5E02\u3002

\u4E8C\u3001\u8D22\u52A1\u6570\u636E
2023\u5E74\u516C\u53F8\u603B\u8425\u6536100\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F20%\uFF0C\u5176\u4E2D\u4EBA\u5DE5\u667A\u80FD\u677F\u5757\u8425\u653650\u4EBF\u5143\uFF0C\u5360\u603B\u8425\u6536\u768450%\uFF0C\u540C\u6BD4\u589E\u957F25%\uFF1B\u4E91\u8BA1\u7B97\u677F\u5757\u8425\u653630\u4EBF\u5143\uFF0C\u5360\u603B\u8425\u6536\u768430%\uFF0C\u540C\u6BD4\u589E\u957F30%\uFF1B\u5927\u6570\u636E\u677F\u5757\u8425\u653620\u4EBF\u5143\uFF0C\u5360\u603B\u8425\u6536\u768420%\uFF0C\u540C\u6BD4\u589E\u957F10%\u3002\u516C\u53F8\u51C0\u5229\u6DA615\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F18%\uFF0C\u7814\u53D1\u6295\u516515\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F25%\uFF0C\u4E3B\u8981\u7528\u4E8E\u4EBA\u5DE5\u667A\u80FD\u7B97\u6CD5\u7814\u53D1\u548C\u4E91\u8BA1\u7B97\u57FA\u7840\u8BBE\u65BD\u5EFA\u8BBE\u3002

\u4E09\u3001\u4E1A\u52A1\u53D1\u5C55
\u4EBA\u5DE5\u667A\u80FD\u677F\u5757\uFF1A\u5168\u5E74\u63A8\u51FA5\u6B3E\u65B0\u4EA7\u54C1\uFF0C\u4E0E10\u5BB6\u5927\u578B\u4F01\u4E1A\u8FBE\u6210\u5408\u4F5C\uFF0C\u5E02\u573A\u4EFD\u989D\u63D0\u5347\u81F315%\uFF1B\u4E91\u8BA1\u7B97\u677F\u5757\uFF1A\u65B0\u589E\u670D\u52A1\u56681000\u53F0\uFF0C\u7B97\u529B\u63D0\u534750%\uFF0C\u670D\u52A1\u5BA2\u6237\u6570\u91CF\u7A81\u7834500\u5BB6\uFF1B\u5927\u6570\u636E\u677F\u5757\uFF1A\u5B8C\u62103\u4E2A\u7701\u7EA7\u5927\u6570\u636E\u9879\u76EE\uFF0C\u6570\u636E\u5904\u7406\u80FD\u529B\u63D0\u534730%\u3002&quot;&quot;&quot;

# \u521D\u59CB\u5316\u5206\u5757\u5668\uFF08\u6838\u5FC3\u53C2\u6570\u4F18\u5316\uFF09
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=200,  # \u6BCF\u4E2A\u6587\u672C\u5757\u7684\u6700\u5927\u957F\u5EA6\uFF08\u6839\u636E\u5D4C\u5165\u6A21\u578B\u8C03\u6574\uFF0C\u4E00\u822C100-300\u5B57\u7B26\uFF09
    chunk_overlap=20,  # \u76F8\u90BB\u6587\u672C\u5757\u7684\u91CD\u53E0\u957F\u5EA6\uFF08\u4FDD\u7559\u4E0A\u4E0B\u6587\uFF0C\u4E00\u822C\u4E3Achunk_size\u768410%-20%\uFF09
    separators=[&quot;\\n\\n&quot;, &quot;\\n&quot;, &quot;\u3002&quot;, &quot;\uFF0C&quot;, &quot; &quot;]  # \u5206\u5272\u7B26\u4F18\u5148\u7EA7\uFF1A\u5148\u6309\u6BB5\u843D\u5206\u5272\uFF0C\u518D\u6309\u53E5\u5B50\uFF0C\u6700\u540E\u6309\u7A7A\u683C
)

# \u5206\u5757
chunks = text_splitter.split_text(long_document)

# \u8F93\u51FA\u5206\u5757\u7ED3\u679C
print(f&quot;\u957F\u6587\u6863\u603B\u957F\u5EA6\uFF1A{len(long_document)}\u5B57\u7B26&quot;)
print(f&quot;\u5206\u5757\u540E\u6570\u91CF\uFF1A{len(chunks)}\u4E2A&quot;)
for i, chunk in enumerate(chunks):
    print(f&quot;\\n\u5757{i+1}\uFF08{len(chunk)}\u5B57\u7B26\uFF09\uFF1A{chunk}&quot;)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-\u8FDB\u9636\u5206\u5757-\u6309\u6587\u6863\u7ED3\u6784\u5206\u5757-\u4FDD\u7559\u6807\u9898\u5C42\u7EA7" tabindex="-1"><a class="header-anchor" href="#_2-\u8FDB\u9636\u5206\u5757-\u6309\u6587\u6863\u7ED3\u6784\u5206\u5757-\u4FDD\u7559\u6807\u9898\u5C42\u7EA7" aria-hidden="true">#</a> 2. \u8FDB\u9636\u5206\u5757\uFF1A\u6309\u6587\u6863\u7ED3\u6784\u5206\u5757\uFF08\u4FDD\u7559\u6807\u9898\u5C42\u7EA7\uFF09</h4><p>\u5BF9\u4E8E\u6709\u660E\u786E\u7ED3\u6784\u7684\u957F\u6587\u6863\uFF08\u5982\u5E74\u62A5\u3001\u624B\u518C\uFF0C\u542B\u6807\u9898\u3001\u5C0F\u6807\u9898\uFF09\uFF0C\u53EF\u4F7F\u7528 MarkdownTextSplitter \u6216 HTMLTextSplitter\uFF0C\u6309\u6587\u6863\u7ED3\u6784\u5206\u5757\uFF0C\u4FDD\u7559\u6807\u9898\u4E0E\u5185\u5BB9\u7684\u5173\u8054\uFF0C\u63D0\u5347\u68C0\u7D22\u7CBE\u5EA6\u3002</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain.text_splitter import MarkdownTextSplitter

# \u6A21\u62DF\u5E26Markdown\u7ED3\u6784\u7684\u957F\u6587\u6863\uFF08\u516C\u53F8\u5E74\u62A5\uFF09
markdown_document = &quot;&quot;&quot;# 2023\u5E74\u516C\u53F8\u5E74\u5EA6\u62A5\u544A

## \u4E00\u3001\u516C\u53F8\u6982\u51B5
\u672C\u516C\u53F8\u6210\u7ACB\u4E8E2010\u5E74\uFF0C\u4E13\u6CE8\u4E8E\u4EBA\u5DE5\u667A\u80FD\u3001\u4E91\u8BA1\u7B97\u3001\u5927\u6570\u636E\u4E09\u5927\u6838\u5FC3\u4E1A\u52A1\uFF0C\u7ECF\u8FC713\u5E74\u7684\u53D1\u5C55\uFF0C\u5DF2\u6210\u4E3A\u884C\u4E1A\u9886\u5148\u7684\u79D1\u6280\u4F01\u4E1A\uFF0C\u5458\u5DE5\u4EBA\u6570\u8D85\u8FC71000\u4EBA\uFF0C\u4E1A\u52A1\u8986\u76D6\u5168\u56FD30\u4E2A\u7701\u5E02\u3002

## \u4E8C\u3001\u8D22\u52A1\u6570\u636E
### 2.1 \u603B\u8425\u6536
2023\u5E74\u516C\u53F8\u603B\u8425\u6536100\u4EBF\u5143\uFF0C\u540C\u6BD4\u589E\u957F20%\u3002

### 2.2 \u5404\u677F\u5757\u8425\u6536
- \u4EBA\u5DE5\u667A\u80FD\u677F\u5757\uFF1A50\u4EBF\u5143\uFF0C\u5360\u603B\u8425\u653650%\uFF0C\u540C\u6BD4\u589E\u957F25%
- \u4E91\u8BA1\u7B97\u677F\u5757\uFF1A30\u4EBF\u5143\uFF0C\u5360\u603B\u8425\u653630%\uFF0C\u540C\u6BD4\u589E\u957F30%
- \u5927\u6570\u636E\u677F\u5757\uFF1A20\u4EBF\u5143\uFF0C\u5360\u603B\u8425\u653620%\uFF0C\u540C\u6BD4\u589E\u957F10%

## \u4E09\u3001\u4E1A\u52A1\u53D1\u5C55
\u4EBA\u5DE5\u667A\u80FD\u677F\u5757\u5168\u5E74\u63A8\u51FA5\u6B3E\u65B0\u4EA7\u54C1\uFF0C\u4E0E10\u5BB6\u5927\u578B\u4F01\u4E1A\u8FBE\u6210\u5408\u4F5C\uFF0C\u5E02\u573A\u4EFD\u989D\u63D0\u5347\u81F315%\u3002&quot;&quot;&quot;

# \u6309Markdown\u7ED3\u6784\u5206\u5757\uFF08\u4FDD\u7559\u6807\u9898\u5C42\u7EA7\uFF09
text_splitter = MarkdownTextSplitter(
    chunk_size=300,
    chunk_overlap=20
)

chunks = text_splitter.split_text(markdown_document)

# \u8F93\u51FA\u5206\u5757\u7ED3\u679C\uFF08\u4FDD\u7559\u6807\u9898\u4E0E\u5185\u5BB9\u5173\u8054\uFF09
for i, chunk in enumerate(chunks):
    print(f&quot;\\n\u5757{i+1}\uFF1A{chunk}&quot;)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-6-3-\u5206\u5757\u7B56\u7565\u4F18\u5316\u6280\u5DE7-\u5B9E\u6218\u907F\u5751" tabindex="-1"><a class="header-anchor" href="#_10-6-3-\u5206\u5757\u7B56\u7565\u4F18\u5316\u6280\u5DE7-\u5B9E\u6218\u907F\u5751" aria-hidden="true">#</a> 10.6.3 \u5206\u5757\u7B56\u7565\u4F18\u5316\u6280\u5DE7\uFF08\u5B9E\u6218\u907F\u5751\uFF09</h3><ul><li>chunk_size \u9009\u62E9\uFF1A\u6839\u636E\u5D4C\u5165\u6A21\u578B\u7684\u8F93\u5165\u9650\u5236\u8C03\u6574\uFF0C\u4E00\u822C\u4E3A 100-300 \u5B57\u7B26\uFF08all-MiniLM-L6-v2 \u652F\u6301\u66F4\u957F\u6587\u672C\uFF0C\u53EF\u8BBE\u4E3A 300-500\uFF09\uFF1B</li></ul><p>chunk_size \u9009\u62E9\uFF1A\u6839\u636E\u5D4C\u5165\u6A21\u578B\u7684\u8F93\u5165\u9650\u5236\u8C03\u6574\uFF0C\u4E00\u822C\u4E3A 100-300 \u5B57\u7B26\uFF08all-MiniLM-L6-v2 \u652F\u6301\u66F4\u957F\u6587\u672C\uFF0C\u53EF\u8BBE\u4E3A 300-500\uFF09\uFF1B</p><ul><li>chunk_overlap \u9009\u62E9\uFF1A\u5EFA\u8BAE\u4E3A chunk_size \u7684 10%-20%\uFF08\u5982 chunk_size=200\uFF0Coverlap=20-40\uFF09\uFF0C\u4FDD\u7559\u4E0A\u4E0B\u6587\u5173\u8054\uFF1B</li></ul><p>chunk_overlap \u9009\u62E9\uFF1A\u5EFA\u8BAE\u4E3A chunk_size \u7684 10%-20%\uFF08\u5982 chunk_size=200\uFF0Coverlap=20-40\uFF09\uFF0C\u4FDD\u7559\u4E0A\u4E0B\u6587\u5173\u8054\uFF1B</p><ul><li>\u5206\u5272\u7B26\u4F18\u5148\u7EA7\uFF1A\u4F18\u5148\u6309\u6BB5\u843D\uFF08\\n\\n\uFF09\u3001\u53E5\u5B50\uFF08\u3002\u3001\uFF0C\uFF09\u5206\u5272\uFF0C\u907F\u514D\u7834\u574F\u6587\u672C\u7ED3\u6784\uFF1B</li></ul><p>\u5206\u5272\u7B26\u4F18\u5148\u7EA7\uFF1A\u4F18\u5148\u6309\u6BB5\u843D\uFF08\\n\\n\uFF09\u3001\u53E5\u5B50\uFF08\u3002\u3001\uFF0C\uFF09\u5206\u5272\uFF0C\u907F\u514D\u7834\u574F\u6587\u672C\u7ED3\u6784\uFF1B</p><ul><li>\u957F\u6587\u6863\u9884\u5904\u7406\uFF1A\u5148\u53BB\u9664\u65E0\u6548\u5185\u5BB9\uFF08\u5982\u7A7A\u767D\u3001\u91CD\u590D\u6BB5\u843D\uFF09\uFF0C\u518D\u5206\u5757\uFF0C\u51CF\u5C11\u65E0\u6548\u5206\u5757\uFF1B</li></ul><p>\u957F\u6587\u6863\u9884\u5904\u7406\uFF1A\u5148\u53BB\u9664\u65E0\u6548\u5185\u5BB9\uFF08\u5982\u7A7A\u767D\u3001\u91CD\u590D\u6BB5\u843D\uFF09\uFF0C\u518D\u5206\u5757\uFF0C\u51CF\u5C11\u65E0\u6548\u5206\u5757\uFF1B</p><ul><li>\u5206\u5757\u540E\u9A8C\u8BC1\uFF1A\u5206\u5757\u540E\u68C0\u67E5\u662F\u5426\u6709\u4E0A\u4E0B\u6587\u65AD\u88C2\u3001\u6807\u9898\u4E0E\u5185\u5BB9\u5206\u79BB\u7684\u60C5\u51B5\uFF0C\u53CA\u65F6\u8C03\u6574\u53C2\u6570\u3002</li></ul><p>\u5206\u5757\u540E\u9A8C\u8BC1\uFF1A\u5206\u5757\u540E\u68C0\u67E5\u662F\u5426\u6709\u4E0A\u4E0B\u6587\u65AD\u88C2\u3001\u6807\u9898\u4E0E\u5185\u5BB9\u5206\u79BB\u7684\u60C5\u51B5\uFF0C\u53CA\u65F6\u8C03\u6574\u53C2\u6570\u3002</p><h3 id="_10-6-4-\u5173\u952E\u63D0\u9192" tabindex="-1"><a class="header-anchor" href="#_10-6-4-\u5173\u952E\u63D0\u9192" aria-hidden="true">#</a> 10.6.4 \u5173\u952E\u63D0\u9192</h3><p>\u5206\u5757\u7B56\u7565\u6CA1\u6709\u201C\u6700\u4F18\u89E3\u201D\uFF0C\u9700\u6839\u636E\u6587\u6863\u7C7B\u578B\uFF08\u5982\u5E74\u62A5\u3001\u6280\u672F\u6587\u6863\uFF09\u3001\u5D4C\u5165\u6A21\u578B\u3001\u68C0\u7D22\u9700\u6C42\u8C03\u6574\uFF0C\u5EFA\u8BAE\u591A\u6D4B\u8BD5\u51E0\u79CD\u53C2\u6570\uFF0C\u9009\u62E9\u68C0\u7D22\u7CBE\u5EA6\u6700\u9AD8\u7684\u5206\u5757\u65B9\u5F0F\u3002</p><p>\u5F15\u7528\u6765\u6E90\uFF1ALangChain \u6587\u672C\u5206\u5757\u5668\u5B98\u65B9\u6587\u6863\u3002</p><h2 id="_10-7-rag-\u6548\u679C\u8BC4\u4F30\u6307\u6807-\u53EC\u56DE\u7387\u3001\u51C6\u786E\u7387" tabindex="-1"><a class="header-anchor" href="#_10-7-rag-\u6548\u679C\u8BC4\u4F30\u6307\u6807-\u53EC\u56DE\u7387\u3001\u51C6\u786E\u7387" aria-hidden="true">#</a> 10.7 RAG \u6548\u679C\u8BC4\u4F30\u6307\u6807\uFF08\u53EC\u56DE\u7387\u3001\u51C6\u786E\u7387\uFF09</h2><p>\u642D\u5EFA RAG \u7CFB\u7EDF\u540E\uFF0C\u5982\u4F55\u5224\u65AD\u5176\u6548\u679C\u597D\u574F\uFF1F\u4E0D\u80FD\u53EA\u9760\u201C\u4E3B\u89C2\u611F\u53D7\u201D\uFF0C\u9700\u8981\u7528\u660E\u786E\u7684\u8BC4\u4F30\u6307\u6807\u91CF\u5316\u6548\u679C\u3002RAG \u7CFB\u7EDF\u7684\u6838\u5FC3\u8BC4\u4F30\u6307\u6807\u7684\u662F \u53EC\u56DE\u7387\uFF08Recall\uFF09 \u548C \u51C6\u786E\u7387\uFF08Precision\uFF09\uFF0C\u6B64\u5916\u8FD8\u6709 F1 \u5206\u6570\u3001BLEU \u5206\u6570\u7B49\u8F85\u52A9\u6307\u6807\uFF0C\u672C\u8282\u91CD\u70B9\u8BB2\u89E3\u6700\u5E38\u7528\u7684\u524D\u4E24\u4E2A\u6307\u6807\u3002</p><h3 id="_10-7-1-\u6838\u5FC3\u8BC4\u4F30\u6307\u6807\u89E3\u6790" tabindex="-1"><a class="header-anchor" href="#_10-7-1-\u6838\u5FC3\u8BC4\u4F30\u6307\u6807\u89E3\u6790" aria-hidden="true">#</a> 10.7.1 \u6838\u5FC3\u8BC4\u4F30\u6307\u6807\u89E3\u6790</h3><p>\u8BC4\u4F30 RAG \u6548\u679C\uFF0C\u6838\u5FC3\u662F\u5224\u65AD\u201C\u68C0\u7D22\u5230\u7684\u6587\u6863\u662F\u5426\u51C6\u786E\u3001\u662F\u5426\u5B8C\u6574\u201D\uFF0C\u56E0\u6B64\u53EC\u56DE\u7387\u548C\u51C6\u786E\u7387\u662F\u6838\u5FC3\u6307\u6807\uFF0C\u7528\u7B80\u5355\u7684\u8BED\u8A00\u89E3\u91CA\uFF1A</p><h4 id="_1-\u53EC\u56DE\u7387-recall" tabindex="-1"><a class="header-anchor" href="#_1-\u53EC\u56DE\u7387-recall" aria-hidden="true">#</a> 1. \u53EC\u56DE\u7387\uFF08Recall\uFF09</h4><p>\u6838\u5FC3\uFF1A\u6240\u6709\u4E0E\u67E5\u8BE2\u76F8\u5173\u7684\u6587\u6863\u4E2D\uFF0C\u88AB\u6210\u529F\u68C0\u7D22\u5230\u7684\u6BD4\u4F8B\uFF0C\u8861\u91CF\u201C\u662F\u5426\u6F0F\u68C0\u201D\u3002</p><p>\u516C\u5F0F\uFF1A\u53EC\u56DE\u7387 = \u68C0\u7D22\u5230\u7684\u76F8\u5173\u6587\u6863\u6570 / \u6240\u6709\u76F8\u5173\u6587\u6863\u603B\u6570</p><p>\u793A\u4F8B\uFF1A\u67E5\u8BE2\u201C2023\u5E74\u5404\u677F\u5757\u8425\u6536\u201D\uFF0C\u6240\u6709\u76F8\u5173\u6587\u6863\u67093\u7BC7\uFF08\u4EBA\u5DE5\u667A\u80FD\u3001\u4E91\u8BA1\u7B97\u3001\u5927\u6570\u636E\uFF09\uFF0C\u68C0\u7D22\u52302\u7BC7\uFF0C\u5219\u53EC\u56DE\u7387 = 2/3 \u2248 66.7%\u3002</p><p>\u8981\u6C42\uFF1A\u53EC\u56DE\u7387\u8D8A\u9AD8\u8D8A\u597D\uFF0C\u907F\u514D\u6F0F\u68C0\u76F8\u5173\u6587\u6863\uFF08\u6F0F\u68C0\u4F1A\u5BFC\u81F4 LLM \u751F\u6210\u7684\u56DE\u7B54\u4E0D\u5B8C\u6574\uFF09\u3002</p><h4 id="_2-\u51C6\u786E\u7387-precision" tabindex="-1"><a class="header-anchor" href="#_2-\u51C6\u786E\u7387-precision" aria-hidden="true">#</a> 2. \u51C6\u786E\u7387\uFF08Precision\uFF09</h4><p>\u6838\u5FC3\uFF1A\u68C0\u7D22\u5230\u7684\u6587\u6863\u4E2D\uFF0C\u771F\u6B63\u4E0E\u67E5\u8BE2\u76F8\u5173\u7684\u6BD4\u4F8B\uFF0C\u8861\u91CF\u201C\u662F\u5426\u8BEF\u68C0\u201D\u3002</p><p>\u516C\u5F0F\uFF1A\u51C6\u786E\u7387 = \u68C0\u7D22\u5230\u7684\u76F8\u5173\u6587\u6863\u6570 / \u68C0\u7D22\u5230\u7684\u6240\u6709\u6587\u6863\u6570</p><p>\u793A\u4F8B\uFF1A\u68C0\u7D22\u52303\u7BC7\u6587\u6863\uFF0C\u5176\u4E2D2\u7BC7\u4E0E\u67E5\u8BE2\u76F8\u5173\uFF0C1\u7BC7\u65E0\u5173\uFF0C\u5219\u51C6\u786E\u7387 = 2/3 \u2248 66.7%\u3002</p><p>\u8981\u6C42\uFF1A\u51C6\u786E\u7387\u8D8A\u9AD8\u8D8A\u597D\uFF0C\u907F\u514D\u8BEF\u68C0\u65E0\u5173\u6587\u6863\uFF08\u8BEF\u68C0\u4F1A\u5E72\u6270 LLM \u751F\u6210\uFF0C\u5BFC\u81F4\u56DE\u7B54\u4E0D\u51C6\u786E\uFF09\u3002</p><h4 id="_3-\u5E73\u8861\u6307\u6807-f1-\u5206\u6570" tabindex="-1"><a class="header-anchor" href="#_3-\u5E73\u8861\u6307\u6807-f1-\u5206\u6570" aria-hidden="true">#</a> 3. \u5E73\u8861\u6307\u6807\uFF1AF1 \u5206\u6570</h4><p>F1 \u5206\u6570\u662F\u53EC\u56DE\u7387\u548C\u51C6\u786E\u7387\u7684\u8C03\u548C\u5E73\u5747\u6570\uFF0C\u7EFC\u5408\u4E24\u8005\u7684\u8868\u73B0\uFF0C\u907F\u514D\u5355\u4E00\u6307\u6807\u7684\u5C40\u9650\u6027\uFF0C\u516C\u5F0F\uFF1A</p><p>F1 = 2 \xD7\uFF08\u51C6\u786E\u7387 \xD7 \u53EC\u56DE\u7387\uFF09/\uFF08\u51C6\u786E\u7387 + \u53EC\u56DE\u7387\uFF09</p><p>F1 \u5206\u6570\u8D8A\u9AD8\uFF0C\u8BF4\u660E RAG \u7CFB\u7EDF\u7684</p>`,189);function b(h,p){const n=d("ExternalLinkIcon");return l(),s("div",null,[e("blockquote",null,[e("p",null,[v,e("a",c,[o,a(n)])])]),m])}var g=r(t,[["render",b],["__file","ai-langchain-rag.html.vue"]]);export{g as default};
