import{_ as s}from"./plugin-vue_export-helper.21dcd24c.js";import{r as l,o as a,c as d,a as e,d as r,b as i,e as c}from"./app.c4252332.js";const u={},t=i("\u539F\u6587\u94FE\u63A5\uFF1A"),v={href:"https://juejin.cn/column/7616994432275267627",target:"_blank",rel:"noopener noreferrer"},m=i("\u6398\u91D1"),o=c(`<h2 id="_17-1-\u4E3A\u4EC0\u4E48\u9700\u8981\u7F13\u5B58" tabindex="-1"><a class="header-anchor" href="#_17-1-\u4E3A\u4EC0\u4E48\u9700\u8981\u7F13\u5B58" aria-hidden="true">#</a> 17.1 \u4E3A\u4EC0\u4E48\u9700\u8981\u7F13\u5B58\uFF1F</h2><p>\u5728LangChain\u5E94\u7528\u4E2D\uFF0C\u7F13\u5B58\u5E76\u975E\u201C\u53EF\u9009\u4F18\u5316\u201D\uFF0C\u800C\u662F\u201C\u5FC5\u505A\u4F18\u5316\u201D\u2014\u2014\u5C24\u5176\u662F\u9AD8\u9891\u67E5\u8BE2\u3001\u91CD\u590D\u8BF7\u6C42\u573A\u666F\uFF0C\u7F3A\u5C11\u7F13\u5B58\u4F1A\u5BFC\u81F4\u7CFB\u7EDF\u6027\u80FD\u74F6\u9888\u3001\u6210\u672C\u98D9\u5347\u3002\u6211\u4EEC\u5148\u901A\u8FC7\u4E00\u4E2A\u771F\u5B9E\u573A\u666F\uFF0C\u7406\u89E3\u7F13\u5B58\u7684\u6838\u5FC3\u4EF7\u503C\u3002</p><h3 id="_17-1-1-\u75DB\u70B9\u573A\u666F-\u6CA1\u6709\u7F13\u5B58\u7684\u81F4\u547D\u95EE\u9898" tabindex="-1"><a class="header-anchor" href="#_17-1-1-\u75DB\u70B9\u573A\u666F-\u6CA1\u6709\u7F13\u5B58\u7684\u81F4\u547D\u95EE\u9898" aria-hidden="true">#</a> 17.1.1 \u75DB\u70B9\u573A\u666F\uFF1A\u6CA1\u6709\u7F13\u5B58\u7684\u81F4\u547D\u95EE\u9898</h3><p>\u5047\u8BBE\u4F60\u5F00\u53D1\u4E86\u4E00\u4E2ALangChain\u95EE\u7B54\u63A5\u53E3\uFF0C\u7528\u4E8E\u67E5\u8BE2\u4EA7\u54C1\u6587\u6863\uFF0C\u65E5\u5747\u8C03\u752810\u4E07\u6B21\uFF0C\u5176\u4E2D60%\u662F\u91CD\u590D\u67E5\u8BE2\uFF08\u5982\u201C\u5982\u4F55\u4F7F\u7528\u4EA7\u54C1X\u201D\u201C\u4EA7\u54C1X\u7684\u529F\u80FD\u4ECB\u7ECD\u201D\uFF09\u3002\u82E5\u4E0D\u4F7F\u7528\u7F13\u5B58\uFF0C\u4F1A\u9762\u4E343\u4E2A\u6838\u5FC3\u95EE\u9898[superscript:8]\uFF1A</p><ul><li>\u54CD\u5E94\u5EF6\u8FDF\u9AD8\uFF1A\u6BCF\u6B21\u67E5\u8BE2\u90FD\u8981\u8C03\u7528LLM+\u5411\u91CF\u68C0\u7D22\uFF0C\u5355\u6B21\u54CD\u5E94\u65F6\u95F4\u7EA6500ms\uFF0C\u7528\u6237\u7B49\u5F85\u611F\u660E\u663E\uFF0C\u9AD8\u9891\u5E76\u53D1\u65F6\u751A\u81F3\u4F1A\u8D85\u65F6\u3002</li></ul><p>\u54CD\u5E94\u5EF6\u8FDF\u9AD8\uFF1A\u6BCF\u6B21\u67E5\u8BE2\u90FD\u8981\u8C03\u7528LLM+\u5411\u91CF\u68C0\u7D22\uFF0C\u5355\u6B21\u54CD\u5E94\u65F6\u95F4\u7EA6500ms\uFF0C\u7528\u6237\u7B49\u5F85\u611F\u660E\u663E\uFF0C\u9AD8\u9891\u5E76\u53D1\u65F6\u751A\u81F3\u4F1A\u8D85\u65F6\u3002</p><ul><li>API\u6210\u672C\u98D9\u5347\uFF1A\u91CD\u590D\u67E5\u8BE2\u4F1A\u91CD\u590D\u8C03\u7528LLM\u548C\u5411\u91CF\u6A21\u578BAPI\uFF0C\u65E5\u5747\u989D\u5916\u4EA7\u751F6\u4E07\u6B21\u65E0\u6548\u8C03\u7528\uFF0C\u6BCF\u6708\u6210\u672C\u589E\u52A0\u6570\u5343\u5143\u3002</li></ul><p>API\u6210\u672C\u98D9\u5347\uFF1A\u91CD\u590D\u67E5\u8BE2\u4F1A\u91CD\u590D\u8C03\u7528LLM\u548C\u5411\u91CF\u6A21\u578BAPI\uFF0C\u65E5\u5747\u989D\u5916\u4EA7\u751F6\u4E07\u6B21\u65E0\u6548\u8C03\u7528\uFF0C\u6BCF\u6708\u6210\u672C\u589E\u52A0\u6570\u5343\u5143\u3002</p><ul><li>\u7CFB\u7EDF\u541E\u5410\u91CF\u4F4E\uFF1A\u5927\u91CF\u91CD\u590D\u8BF7\u6C42\u5360\u7528\u670D\u52A1\u5668\u8D44\u6E90\u548CAPI\u8C03\u7528\u914D\u989D\uFF0C\u5BFC\u81F4\u5E76\u53D1\u80FD\u529B\u4E0B\u964D\uFF0C\u9AD8\u5CF0\u65F6\u6BB5\u5BB9\u6613\u51FA\u73B0\u670D\u52A1\u5361\u987F\u3002</li></ul><p>\u7CFB\u7EDF\u541E\u5410\u91CF\u4F4E\uFF1A\u5927\u91CF\u91CD\u590D\u8BF7\u6C42\u5360\u7528\u670D\u52A1\u5668\u8D44\u6E90\u548CAPI\u8C03\u7528\u914D\u989D\uFF0C\u5BFC\u81F4\u5E76\u53D1\u80FD\u529B\u4E0B\u964D\uFF0C\u9AD8\u5CF0\u65F6\u6BB5\u5BB9\u6613\u51FA\u73B0\u670D\u52A1\u5361\u987F\u3002</p><p>\u800C\u6DFB\u52A0\u7F13\u5B58\u540E\uFF0C\u91CD\u590D\u67E5\u8BE2\u53EF\u76F4\u63A5\u4ECE\u7F13\u5B58\u4E2D\u83B7\u53D6\u7ED3\u679C\uFF0C\u54CD\u5E94\u65F6\u95F4\u53EF\u964D\u81F310ms\u4EE5\u5185\uFF0CAPI\u8C03\u7528\u6B21\u6570\u51CF\u5C1160%\uFF0C\u7CFB\u7EDF\u541E\u5410\u91CF\u63D0\u53473-5\u500D[superscript:6]\u2014\u2014\u8FD9\u5C31\u662F\u7F13\u5B58\u7684\u6838\u5FC3\u4EF7\u503C\uFF1A\u4EE5\u7A7A\u95F4\u6362\u65F6\u95F4\uFF0C\u4EE5\u7F13\u5B58\u590D\u7528\u964D\u4F4E\u6210\u672C\u3001\u63D0\u5347\u6027\u80FD\u3002</p><h3 id="_17-1-2-\u7F13\u5B58\u7684\u6838\u5FC3\u9002\u7528\u573A\u666F" tabindex="-1"><a class="header-anchor" href="#_17-1-2-\u7F13\u5B58\u7684\u6838\u5FC3\u9002\u7528\u573A\u666F" aria-hidden="true">#</a> 17.1.2 \u7F13\u5B58\u7684\u6838\u5FC3\u9002\u7528\u573A\u666F</h3><p>LangChain\u4E2D\uFF0C\u7F13\u5B58\u5E76\u975E\u4E07\u80FD\uFF0C\u9700\u9488\u5BF9\u6027\u5E94\u7528\u4E8E\u4EE5\u4E0B\u573A\u666F\uFF0C\u624D\u80FD\u53D1\u6325\u6700\u5927\u4EF7\u503C[superscript:3][superscript:7]\uFF1A</p><ul><li>\u9AD8\u9891\u91CD\u590D\u67E5\u8BE2\uFF1A\u5982\u5BA2\u670D\u95EE\u7B54\u3001\u4EA7\u54C1\u6587\u6863\u67E5\u8BE2\u3001\u56FA\u5B9A\u8BDD\u672F\u751F\u6210\uFF08\u5982\u6B22\u8FCE\u8BED\u3001\u5E38\u89C1\u95EE\u9898\u56DE\u590D\uFF09\u3002</li></ul><p>\u9AD8\u9891\u91CD\u590D\u67E5\u8BE2\uFF1A\u5982\u5BA2\u670D\u95EE\u7B54\u3001\u4EA7\u54C1\u6587\u6863\u67E5\u8BE2\u3001\u56FA\u5B9A\u8BDD\u672F\u751F\u6210\uFF08\u5982\u6B22\u8FCE\u8BED\u3001\u5E38\u89C1\u95EE\u9898\u56DE\u590D\uFF09\u3002</p><ul><li>\u8BA1\u7B97\u6210\u672C\u9AD8\u7684\u64CD\u4F5C\uFF1A\u5982\u5411\u91CF\u5D4C\u5165\u751F\u6210\uFF08\u5C24\u5176\u662F\u8C03\u7528API\u751F\u6210\u5D4C\u5165\uFF09\u3001\u590D\u6742\u94FE\u6267\u884C\uFF08\u591A\u5DE5\u5177\u8C03\u7528+LLM\u751F\u6210\uFF09\u3002</li></ul><p>\u8BA1\u7B97\u6210\u672C\u9AD8\u7684\u64CD\u4F5C\uFF1A\u5982\u5411\u91CF\u5D4C\u5165\u751F\u6210\uFF08\u5C24\u5176\u662F\u8C03\u7528API\u751F\u6210\u5D4C\u5165\uFF09\u3001\u590D\u6742\u94FE\u6267\u884C\uFF08\u591A\u5DE5\u5177\u8C03\u7528+LLM\u751F\u6210\uFF09\u3002</p><ul><li>\u54CD\u5E94\u65F6\u95F4\u654F\u611F\u573A\u666F\uFF1A\u5982\u7528\u6237\u4EA4\u4E92\u7C7B\u5E94\u7528\uFF08\u804A\u5929\u673A\u5668\u4EBA\u3001\u5B9E\u65F6\u95EE\u7B54\uFF09\uFF0C\u8981\u6C42\u54CD\u5E94\u65F6\u95F4\u5728100ms\u4EE5\u5185\u3002</li></ul><p>\u54CD\u5E94\u65F6\u95F4\u654F\u611F\u573A\u666F\uFF1A\u5982\u7528\u6237\u4EA4\u4E92\u7C7B\u5E94\u7528\uFF08\u804A\u5929\u673A\u5668\u4EBA\u3001\u5B9E\u65F6\u95EE\u7B54\uFF09\uFF0C\u8981\u6C42\u54CD\u5E94\u65F6\u95F4\u5728100ms\u4EE5\u5185\u3002</p><ul><li>API\u8C03\u7528\u53D7\u9650\u573A\u666F\uFF1A\u5982LLM/\u5411\u91CF\u6A21\u578BAPI\u6709\u8C03\u7528\u9891\u7387\u9650\u5236\uFF0C\u9700\u901A\u8FC7\u7F13\u5B58\u51CF\u5C11\u8C03\u7528\u6B21\u6570\uFF0C\u907F\u514D\u9650\u6D41\u3002</li></ul><p>API\u8C03\u7528\u53D7\u9650\u573A\u666F\uFF1A\u5982LLM/\u5411\u91CF\u6A21\u578BAPI\u6709\u8C03\u7528\u9891\u7387\u9650\u5236\uFF0C\u9700\u901A\u8FC7\u7F13\u5B58\u51CF\u5C11\u8C03\u7528\u6B21\u6570\uFF0C\u907F\u514D\u9650\u6D41\u3002</p><h3 id="_17-1-3-\u56FE\u4F8B-\u7F13\u5B58\u7684\u5DE5\u4F5C\u6D41\u7A0B" tabindex="-1"><a class="header-anchor" href="#_17-1-3-\u56FE\u4F8B-\u7F13\u5B58\u7684\u5DE5\u4F5C\u6D41\u7A0B" aria-hidden="true">#</a> 17.1.3 \u56FE\u4F8B\uFF1A\u7F13\u5B58\u7684\u5DE5\u4F5C\u6D41\u7A0B</h3><p>LangChain\u4E2D\u7F13\u5B58\u7684\u6838\u5FC3\u5DE5\u4F5C\u6D41\u7A0B\u53EF\u7B80\u5316\u4E3A3\u6B65\uFF0C\u6E05\u6670\u6613\u61C2\uFF1A</p><p>\u4EE3\u7801\u6765\u6E90\uFF1A\u57FA\u4E8E\u6398\u91D1LangChain\u7F13\u5B58\u5B9E\u6218\u793A\u4F8B\u7B80\u5316[superscript:2]\uFF0C\u8FD0\u884C\u6548\u679C\uFF1A\u7B2C\u4E00\u6B21\u8C03\u7528\u8017\u65F6\u7EA6500ms\uFF0C\u7B2C\u4E8C\u6B21\u8C03\u7528\u8017\u65F6\u4E0D\u8DB310ms\uFF0C\u4E14\u4E24\u6B21\u8FD4\u56DE\u7ED3\u679C\u5B8C\u5168\u4E00\u81F4\u3002</p><p>\u6838\u5FC3\u7279\u70B9\uFF1A\u65E0\u9700\u914D\u7F6E\u989D\u5916\u4F9D\u8D56\uFF0C\u5F00\u7BB1\u5373\u7528\uFF0C\u9002\u5408\u5FEB\u901F\u6D4B\u8BD5\u7F13\u5B58\u6548\u679C\uFF1B\u4F46\u4E0D\u652F\u6301\u6301\u4E45\u5316\uFF0C\u751F\u4EA7\u73AF\u5883\u5355\u72EC\u4F7F\u7528\u98CE\u9669\u8F83\u9AD8\uFF08\u5982\u5E94\u7528\u91CD\u542F\u540E\u7F13\u5B58\u5931\u6548\uFF0C\u5BFC\u81F4\u77AC\u65F6\u9AD8\u8D1F\u8F7D\uFF09\u3002</p><h3 id="_17-2-2-sqlitecache-\u78C1\u76D8\u4E0A\u7684\u6301\u4E45\u5316\u7F13\u5B58" tabindex="-1"><a class="header-anchor" href="#_17-2-2-sqlitecache-\u78C1\u76D8\u4E0A\u7684\u6301\u4E45\u5316\u7F13\u5B58" aria-hidden="true">#</a> 17.2.2 SQLiteCache\uFF1A\u78C1\u76D8\u4E0A\u7684\u6301\u4E45\u5316\u7F13\u5B58</h3><p>SQLiteCache\u5C06\u7F13\u5B58\u6570\u636E\u5B58\u50A8\u5728\u672C\u5730SQLite\u6570\u636E\u5E93\u6587\u4EF6\u4E2D\uFF0C\u4F18\u70B9\u662F\u652F\u6301\u6301\u4E45\u5316\uFF08\u5E94\u7528\u91CD\u542F\u540E\u7F13\u5B58\u4F9D\u7136\u5B58\u5728\uFF09\uFF0C\u65E0\u9700\u989D\u5916\u90E8\u7F72\u6570\u636E\u5E93\uFF0C\u9002\u5408\u751F\u4EA7\u73AF\u5883\u4E2D\u9700\u8981\u957F\u671F\u7F13\u5B58\u7684\u573A\u666F[superscript:6]\u3002</p><p>\u4EE3\u7801\u793A\u4F8B\uFF08\u7B80\u77ED\u53EF\u76F4\u63A5\u8FD0\u884C\uFF09\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain.globals import set_llm_cache
from langchain_community.cache import SQLiteCache
from langchain_openai import ChatOpenAI

# 1. \u521D\u59CB\u5316SQLite\u7F13\u5B58\uFF08\u7F13\u5B58\u6587\u4EF6\u5B58\u50A8\u5728\u5F53\u524D\u76EE\u5F55\uFF0C\u540D\u79F0\u4E3A.langchain.db\uFF09
set_llm_cache(SQLiteCache(database_path=&quot;.langchain.db&quot;))

# 2. \u521D\u59CB\u5316LLM
llm = ChatOpenAI(model=&quot;gpt-3.5-turbo&quot;, api_key=&quot;\u4F60\u7684API Key&quot;)

# 3. \u7B2C\u4E00\u6B21\u8C03\u7528\uFF1A\u65E0\u7F13\u5B58\uFF0C\u8C03\u7528LLM\u5E76\u5199\u5165SQLite
print(&quot;\u7B2C\u4E00\u6B21\u8C03\u7528\uFF08\u65E0\u7F13\u5B58\uFF09\uFF1A&quot;)
response1 = llm.invoke(&quot;\u4ECB\u7ECDLangChain\u7684SQLiteCache&quot;)
print(response1.content[:50], &quot;...\\n&quot;)

# 4. \u91CD\u542F\u5E94\u7528\u540E\uFF08\u6A21\u62DF\uFF09\uFF0C\u7B2C\u4E8C\u6B21\u8C03\u7528\uFF1A\u4ECESQLite\u8BFB\u53D6\u7F13\u5B58
print(&quot;\u7B2C\u4E8C\u6B21\u8C03\u7528\uFF08\u6709\u7F13\u5B58\uFF09\uFF1A&quot;)
response2 = llm.invoke(&quot;\u4ECB\u7ECDLangChain\u7684SQLiteCache&quot;)
print(response2.content[:50], &quot;...&quot;)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u4EE3\u7801\u6765\u6E90\uFF1A\u6398\u91D1LangChain\u7F13\u5B58\u5B8C\u6574\u6307\u5357[superscript:6]\uFF0C\u5173\u952E\u8BF4\u660E\uFF1A\u8FD0\u884C\u540E\u4F1A\u5728\u5F53\u524D\u76EE\u5F55\u751F\u6210.langchain.db\u6587\u4EF6\uFF0C\u5373\u4F7F\u5173\u95ED\u5E94\u7528\u3001\u91CD\u542F\u670D\u52A1\uFF0C\u518D\u6B21\u8C03\u7528\u76F8\u540C\u8BF7\u6C42\uFF0C\u4F9D\u7136\u80FD\u4ECE\u7F13\u5B58\u4E2D\u83B7\u53D6\u7ED3\u679C\u3002</p><p>\u6838\u5FC3\u7279\u70B9\uFF1A\u6301\u4E45\u5316\u5B58\u50A8\uFF0C\u7F13\u5B58\u547D\u4E2D\u7387\u7A33\u5B9A\uFF1B\u8BFB\u5199\u901F\u5EA6\u7565\u4F4E\u4E8E\u5185\u5B58\u7F13\u5B58\uFF0C\u4F46\u8DB3\u591F\u6EE1\u8DB3\u5927\u591A\u6570\u751F\u4EA7\u573A\u666F\uFF0C\u65E0\u9700\u989D\u5916\u7EF4\u62A4\u6570\u636E\u5E93\uFF0C\u6027\u4EF7\u6BD4\u6781\u9AD8\u3002</p><h3 id="_17-2-3-\u4E24\u79CD\u7F13\u5B58\u5BF9\u6BD4-\u6E05\u6670\u6613\u61C2" tabindex="-1"><a class="header-anchor" href="#_17-2-3-\u4E24\u79CD\u7F13\u5B58\u5BF9\u6BD4-\u6E05\u6670\u6613\u61C2" aria-hidden="true">#</a> 17.2.3 \u4E24\u79CD\u7F13\u5B58\u5BF9\u6BD4\uFF08\u6E05\u6670\u6613\u61C2\uFF09</h3><h2 id="_17-3-\u57FA\u4E8E\u8F93\u5165\u54C8\u5E0C\u7684\u7F13\u5B58\u952E\u8BBE\u8BA1" tabindex="-1"><a class="header-anchor" href="#_17-3-\u57FA\u4E8E\u8F93\u5165\u54C8\u5E0C\u7684\u7F13\u5B58\u952E\u8BBE\u8BA1" aria-hidden="true">#</a> 17.3 \u57FA\u4E8E\u8F93\u5165\u54C8\u5E0C\u7684\u7F13\u5B58\u952E\u8BBE\u8BA1</h2><p>\u7F13\u5B58\u7684\u6838\u5FC3\u662F\u201C\u952E-\u503C\u5BF9\u201D\u5B58\u50A8\uFF1A**\u952E\uFF08Key\uFF09**\u662F\u8BF7\u6C42\u7684\u552F\u4E00\u6807\u8BC6\uFF0C**\u503C\uFF08Value\uFF09**\u662F\u8BF7\u6C42\u7684\u7ED3\u679C\u3002LangChain\u9ED8\u8BA4\u4F7F\u7528\u201C\u8F93\u5165\u54C8\u5E0C\u201D\u4F5C\u4E3A\u7F13\u5B58\u952E\uFF0C\u786E\u4FDD\u76F8\u540C\u8F93\u5165\u5BF9\u5E94\u76F8\u540C\u7684\u952E\uFF0C\u4ECE\u800C\u5B9E\u73B0\u7F13\u5B58\u590D\u7528[superscript:7]\u3002</p><p>\u7B80\u5355\u6765\u8BF4\uFF1A\u5C06\u7528\u6237\u8F93\u5165\u3001Prompt\u6A21\u677F\u3001LLM\u914D\u7F6E\u7B49\u5173\u952E\u4FE1\u606F\uFF0C\u901A\u8FC7\u54C8\u5E0C\u7B97\u6CD5\uFF08\u5982SHA-256\uFF09\u751F\u6210\u4E00\u4E2A\u552F\u4E00\u7684\u5B57\u7B26\u4E32\uFF0C\u4F5C\u4E3A\u7F13\u5B58\u952E\u2014\u2014\u53EA\u8981\u8F93\u5165\u4E0D\u53D8\uFF0C\u54C8\u5E0C\u503C\u5C31\u4E0D\u53D8\uFF0C\u5C31\u80FD\u547D\u4E2D\u7F13\u5B58[superscript:3]\u3002</p><h3 id="_17-3-1-\u9ED8\u8BA4\u7F13\u5B58\u952E\u7684\u751F\u6210\u903B\u8F91" tabindex="-1"><a class="header-anchor" href="#_17-3-1-\u9ED8\u8BA4\u7F13\u5B58\u952E\u7684\u751F\u6210\u903B\u8F91" aria-hidden="true">#</a> 17.3.1 \u9ED8\u8BA4\u7F13\u5B58\u952E\u7684\u751F\u6210\u903B\u8F91</h3><p>LangChain\u9ED8\u8BA4\u7684\u7F13\u5B58\u952E\u751F\u6210\u903B\u8F91\u7684\u6838\u5FC3\u7684\u662F\u201C\u5168\u8F93\u5165\u54C8\u5E0C\u201D\uFF0C\u5305\u542B3\u4E2A\u5173\u952E\u8981\u7D20\uFF08\u786E\u4FDD\u552F\u4E00\u6027\uFF09[superscript:7]\uFF1A</p><ul><li>\u7528\u6237\u8F93\u5165\uFF08\u5982\u95EE\u7B54\u4E2D\u7684\u95EE\u9898\u3001\u751F\u6210\u4EFB\u52A1\u4E2D\u7684\u6587\u672C\uFF09\uFF1B</li></ul><p>\u7528\u6237\u8F93\u5165\uFF08\u5982\u95EE\u7B54\u4E2D\u7684\u95EE\u9898\u3001\u751F\u6210\u4EFB\u52A1\u4E2D\u7684\u6587\u672C\uFF09\uFF1B</p><ul><li>Prompt\u6A21\u677F\uFF08\u82E5\u4F7F\u7528PromptTemplate\uFF0C\u4F1A\u5305\u542B\u6A21\u677F\u5185\u5BB9\uFF09\uFF1B</li></ul><p>Prompt\u6A21\u677F\uFF08\u82E5\u4F7F\u7528PromptTemplate\uFF0C\u4F1A\u5305\u542B\u6A21\u677F\u5185\u5BB9\uFF09\uFF1B</p><ul><li>LLM/\u94FE\u7684\u914D\u7F6E\uFF08\u5982\u6A21\u578B\u540D\u79F0\u3001\u6E29\u5EA6\u503Ctemperature\u3001\u6700\u5927Token\u6570\uFF09\u3002</li></ul><p>LLM/\u94FE\u7684\u914D\u7F6E\uFF08\u5982\u6A21\u578B\u540D\u79F0\u3001\u6E29\u5EA6\u503Ctemperature\u3001\u6700\u5927Token\u6570\uFF09\u3002</p><p>\u56FE\u4F8B\uFF1A\u9ED8\u8BA4\u7F13\u5B58\u952E\u751F\u6210\u6D41\u7A0B</p><h3 id="_17-3-2-\u81EA\u5B9A\u4E49\u7F13\u5B58\u952E-\u9002\u914D\u590D\u6742\u573A\u666F" tabindex="-1"><a class="header-anchor" href="#_17-3-2-\u81EA\u5B9A\u4E49\u7F13\u5B58\u952E-\u9002\u914D\u590D\u6742\u573A\u666F" aria-hidden="true">#</a> 17.3.2 \u81EA\u5B9A\u4E49\u7F13\u5B58\u952E\uFF08\u9002\u914D\u590D\u6742\u573A\u666F\uFF09</h3><p>\u9ED8\u8BA4\u7F13\u5B58\u952E\u9002\u5408\u7B80\u5355\u573A\u666F\uFF0C\u4F46\u5728\u590D\u6742\u573A\u666F\uFF08\u5982\u591A\u8F6E\u5BF9\u8BDD\u3001\u5E26\u5143\u6570\u636E\u7684\u8BF7\u6C42\uFF09\u4E2D\uFF0C\u53EF\u80FD\u9700\u8981\u81EA\u5B9A\u4E49\u7F13\u5B58\u952E\uFF0C\u907F\u514D\u201C\u8F93\u5165\u76F8\u4F3C\u4F46\u9700\u6C42\u4E0D\u540C\u201D\u5BFC\u81F4\u7684\u7F13\u5B58\u8BEF\u547D\u4E2D[superscript:7]\u3002</p><p>\u4EE3\u7801\u793A\u4F8B\uFF08\u81EA\u5B9A\u4E49\u7F13\u5B58\u952E\uFF0C\u7B80\u77ED\u53EF\u8FD0\u884C\uFF09\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain.globals import set_llm_cache
from langchain.cache import InMemoryCache
from langchain_openai import ChatOpenAI
import hashlib

# 1. \u81EA\u5B9A\u4E49\u7F13\u5B58\u7C7B\uFF08\u91CD\u5199\u7F13\u5B58\u952E\u751F\u6210\u903B\u8F91\uFF09
class CustomCache(InMemoryCache):
    def _key(self, prompt, llm):
        # \u81EA\u5B9A\u4E49\u7F13\u5B58\u952E\uFF1A\u7ED3\u5408prompt\u548C\u7528\u6237ID\uFF08\u907F\u514D\u591A\u7528\u6237\u7F13\u5B58\u51B2\u7A81\uFF09
        user_id = &quot;user_123&quot;  # \u5B9E\u9645\u573A\u666F\u4ECE\u8BF7\u6C42\u4E2D\u83B7\u53D6
        key_str = f&quot;{user_id}:{prompt}:{llm.model_name}&quot;
        # \u751F\u6210SHA-256\u54C8\u5E0C\u503C\u4F5C\u4E3A\u7F13\u5B58\u952E
        return hashlib.sha256(key_str.encode()).hexdigest()

# 2. \u542F\u7528\u81EA\u5B9A\u4E49\u7F13\u5B58
set_llm_cache(CustomCache())

# 3. \u6D4B\u8BD5\uFF1A\u4E0D\u540C\u7528\u6237ID\u5373\u4F7F\u8F93\u5165\u76F8\u540C\uFF0C\u7F13\u5B58\u952E\u4E5F\u4E0D\u540C
llm = ChatOpenAI(model=&quot;gpt-3.5-turbo&quot;, api_key=&quot;\u4F60\u7684API Key&quot;)
response1 = llm.invoke(&quot;\u4ECB\u7ECDLangChain\u7F13\u5B58\u952E\u8BBE\u8BA1&quot;)  # \u65E0\u7F13\u5B58\uFF0C\u8C03\u7528LLM
response2 = llm.invoke(&quot;\u4ECB\u7ECDLangChain\u7F13\u5B58\u952E\u8BBE\u8BA1&quot;)  # \u6709\u7F13\u5B58\uFF0C\u76F4\u63A5\u8FD4\u56DE
print(&quot;\u7F13\u5B58\u952E\u662F\u5426\u76F8\u540C\uFF08\u540C\u4E00\u7528\u6237\uFF09\uFF1A&quot;, response1 == response2)  # True
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u4EE3\u7801\u8BF4\u660E\uFF1A\u81EA\u5B9A\u4E49\u7F13\u5B58\u952E\u7ED3\u5408\u4E86\u7528\u6237ID\u3001\u8F93\u5165prompt\u548CLLM\u6A21\u578B\u540D\u79F0\uFF0C\u907F\u514D\u591A\u7528\u6237\u573A\u666F\u4E0B\u7684\u7F13\u5B58\u51B2\u7A81\uFF08\u5982\u7528\u6237A\u548C\u7528\u6237B\u8F93\u5165\u76F8\u540C\uFF0C\u4F46\u9700\u6C42\u4E0D\u540C\uFF0C\u4E0D\u4F1A\u547D\u4E2D\u5BF9\u65B9\u7684\u7F13\u5B58\uFF09[superscript:7]\u3002</p><h3 id="_17-3-3-\u7F13\u5B58\u952E\u8BBE\u8BA1\u6700\u4F73\u5B9E\u8DF5" tabindex="-1"><a class="header-anchor" href="#_17-3-3-\u7F13\u5B58\u952E\u8BBE\u8BA1\u6700\u4F73\u5B9E\u8DF5" aria-hidden="true">#</a> 17.3.3 \u7F13\u5B58\u952E\u8BBE\u8BA1\u6700\u4F73\u5B9E\u8DF5</h3><ul><li>\u552F\u4E00\u6027\u4F18\u5148\uFF1A\u7F13\u5B58\u952E\u5FC5\u987B\u80FD\u552F\u4E00\u6807\u8BC6\u4E00\u4E2A\u8BF7\u6C42\uFF0C\u907F\u514D\u4E0D\u540C\u8BF7\u6C42\u5171\u7528\u4E00\u4E2A\u952E\uFF08\u7F13\u5B58\u8BEF\u547D\u4E2D\uFF09\u3002</li></ul><p>\u552F\u4E00\u6027\u4F18\u5148\uFF1A\u7F13\u5B58\u952E\u5FC5\u987B\u80FD\u552F\u4E00\u6807\u8BC6\u4E00\u4E2A\u8BF7\u6C42\uFF0C\u907F\u514D\u4E0D\u540C\u8BF7\u6C42\u5171\u7528\u4E00\u4E2A\u952E\uFF08\u7F13\u5B58\u8BEF\u547D\u4E2D\uFF09\u3002</p><ul><li>\u7B80\u6D01\u9AD8\u6548\uFF1A\u54C8\u5E0C\u7B97\u6CD5\u4F18\u5148\u9009\u62E9SHA-256\uFF0C\u751F\u6210\u7684\u952E\u957F\u5EA6\u56FA\u5B9A\u3001\u8BA1\u7B97\u9AD8\u6548\uFF0C\u907F\u514D\u590D\u6742\u903B\u8F91\u5F71\u54CD\u7F13\u5B58\u8BFB\u5199\u901F\u5EA6\u3002</li></ul><p>\u7B80\u6D01\u9AD8\u6548\uFF1A\u54C8\u5E0C\u7B97\u6CD5\u4F18\u5148\u9009\u62E9SHA-256\uFF0C\u751F\u6210\u7684\u952E\u957F\u5EA6\u56FA\u5B9A\u3001\u8BA1\u7B97\u9AD8\u6548\uFF0C\u907F\u514D\u590D\u6742\u903B\u8F91\u5F71\u54CD\u7F13\u5B58\u8BFB\u5199\u901F\u5EA6\u3002</p><ul><li>\u9002\u914D\u591A\u573A\u666F\uFF1A\u591A\u7528\u6237\u573A\u666F\u52A0\u5165\u7528\u6237ID\uFF0C\u591A\u6A21\u578B\u573A\u666F\u52A0\u5165\u6A21\u578B\u540D\u79F0\uFF0C\u591A\u6A21\u677F\u573A\u666F\u52A0\u5165\u6A21\u677FID[superscript:7]\u3002</li></ul><p>\u9002\u914D\u591A\u573A\u666F\uFF1A\u591A\u7528\u6237\u573A\u666F\u52A0\u5165\u7528\u6237ID\uFF0C\u591A\u6A21\u578B\u573A\u666F\u52A0\u5165\u6A21\u578B\u540D\u79F0\uFF0C\u591A\u6A21\u677F\u573A\u666F\u52A0\u5165\u6A21\u677FID[superscript:7]\u3002</p><ul><li>\u907F\u514D\u5197\u4F59\uFF1A\u65E0\u9700\u5C06\u65E0\u5173\u4FE1\u606F\uFF08\u5982\u8BF7\u6C42\u65F6\u95F4\u3001\u968F\u673A\u6570\uFF09\u52A0\u5165\u7F13\u5B58\u952E\uFF0C\u5426\u5219\u4F1A\u5BFC\u81F4\u7F13\u5B58\u547D\u4E2D\u7387\u6781\u4F4E\u3002</li></ul><p>\u907F\u514D\u5197\u4F59\uFF1A\u65E0\u9700\u5C06\u65E0\u5173\u4FE1\u606F\uFF08\u5982\u8BF7\u6C42\u65F6\u95F4\u3001\u968F\u673A\u6570\uFF09\u52A0\u5165\u7F13\u5B58\u952E\uFF0C\u5426\u5219\u4F1A\u5BFC\u81F4\u7F13\u5B58\u547D\u4E2D\u7387\u6781\u4F4E\u3002</p><h2 id="_17-4-\u7F13\u5B58\u5931\u6548\u7B56\u7565" tabindex="-1"><a class="header-anchor" href="#_17-4-\u7F13\u5B58\u5931\u6548\u7B56\u7565" aria-hidden="true">#</a> 17.4 \u7F13\u5B58\u5931\u6548\u7B56\u7565</h2><p>\u7F13\u5B58\u5E76\u975E\u201C\u4E00\u5B58\u4E86\u4E4B\u201D\u2014\u2014\u5982\u679C\u7F13\u5B58\u7684\u5185\u5BB9\u53D1\u751F\u53D8\u5316\uFF08\u5982\u4EA7\u54C1\u6587\u6863\u66F4\u65B0\u3001LLM\u6A21\u578B\u5347\u7EA7\uFF09\uFF0C\u7EE7\u7EED\u4F7F\u7528\u65E7\u7F13\u5B58\u4F1A\u5BFC\u81F4\u7ED3\u679C\u8FC7\u65F6\uFF0C\u5F71\u54CD\u5E94\u7528\u51C6\u786E\u6027[superscript:3]\u3002\u7F13\u5B58\u5931\u6548\u7B56\u7565\u7684\u6838\u5FC3\uFF0C\u5C31\u662F\u201C\u5728\u5408\u9002\u7684\u65F6\u673A\u5220\u9664/\u66F4\u65B0\u65E7\u7F13\u5B58\u201D\uFF0C\u5E73\u8861\u7F13\u5B58\u547D\u4E2D\u7387\u548C\u7ED3\u679C\u51C6\u786E\u6027\u3002</p><p>LangChain\u9ED8\u8BA4\u4E0D\u8BBE\u7F6E\u7F13\u5B58\u8FC7\u671F\u65F6\u95F4\uFF08\u7F13\u5B58\u6C38\u4E45\u6709\u6548\uFF09\uFF0C\u9700\u624B\u52A8\u914D\u7F6E\u5931\u6548\u7B56\u7565\uFF0C\u4EE5\u4E0B\u662F3\u79CD\u6700\u5E38\u7528\u3001\u6700\u6613\u843D\u5730\u7684\u7B56\u7565\u3002</p><h3 id="_17-4-1-\u7B56\u75651-\u65F6\u95F4\u8FC7\u671F\u7B56\u7565-ttl" tabindex="-1"><a class="header-anchor" href="#_17-4-1-\u7B56\u75651-\u65F6\u95F4\u8FC7\u671F\u7B56\u7565-ttl" aria-hidden="true">#</a> 17.4.1 \u7B56\u75651\uFF1A\u65F6\u95F4\u8FC7\u671F\u7B56\u7565\uFF08TTL\uFF09</h3><p>\u6700\u5E38\u7528\u7684\u5931\u6548\u7B56\u7565\uFF1A\u4E3A\u7F13\u5B58\u8BBE\u7F6E\u201C\u5B58\u6D3B\u65F6\u95F4\uFF08TTL\uFF0CTime To Live\uFF09\u201D\uFF0C\u8D85\u8FC7\u65F6\u95F4\u540E\u81EA\u52A8\u5931\u6548\uFF0C\u9002\u7528\u4E8E\u5185\u5BB9\u66F4\u65B0\u9891\u7387\u56FA\u5B9A\u7684\u573A\u666F\uFF08\u5982\u4EA7\u54C1\u6587\u6863\u6BCF\u5929\u66F4\u65B01\u6B21\uFF09[superscript:3]\u3002</p><p>\u4EE3\u7801\u793A\u4F8B\uFF08\u8BBE\u7F6ETTL\u7F13\u5B58\uFF0C\u7B80\u77ED\u53EF\u8FD0\u884C\uFF09\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain.globals import set_llm_cache
from langchain.cache import InMemoryCache
from langchain_openai import ChatOpenAI
import time

# 1. \u5E26TTL\u7684\u5185\u5B58\u7F13\u5B58\u7C7B
class TTLInMemoryCache(InMemoryCache):
    def __init__(self, ttl=3600):  # TTL\u9ED8\u8BA41\u5C0F\u65F6\uFF083600\u79D2\uFF09
        super().__init__()
        self.ttl = ttl  # \u7F13\u5B58\u5B58\u6D3B\u65F6\u95F4
    
    def set(self, key, value):
        # \u5B58\u50A8\u7F13\u5B58\u65F6\uFF0C\u8BB0\u5F55\u5F53\u524D\u65F6\u95F4
        self.cache[key] = (value, time.time())
    
    def get(self, key):
        # \u83B7\u53D6\u7F13\u5B58\u65F6\uFF0C\u5224\u65AD\u662F\u5426\u8FC7\u671F
        if key in self.cache:
            value, timestamp = self.cache[key]
            if time.time() - timestamp &lt; self.ttl:
                return value  # \u672A\u8FC7\u671F\uFF0C\u8FD4\u56DE\u7F13\u5B58
            else:
                del self.cache[key]  # \u5DF2\u8FC7\u671F\uFF0C\u5220\u9664\u7F13\u5B58
        return None

# 2. \u542F\u7528TTL\u7F13\u5B58\uFF08\u8BBE\u7F6E\u7F13\u5B58\u5B58\u6D3B\u65F6\u95F4\u4E3A10\u79D2\uFF0C\u65B9\u4FBF\u6D4B\u8BD5\uFF09
set_llm_cache(TTLInMemoryCache(ttl=10))

# 3. \u6D4B\u8BD5\u7F13\u5B58\u8FC7\u671F
llm = ChatOpenAI(model=&quot;gpt-3.5-turbo&quot;, api_key=&quot;\u4F60\u7684API Key&quot;)
response1 = llm.invoke(&quot;\u6D4B\u8BD5TTL\u7F13\u5B58\u5931\u6548&quot;)  # \u65E0\u7F13\u5B58\uFF0C\u8C03\u7528LLM
print(&quot;\u7B2C\u4E00\u6B21\u8C03\u7528\uFF1A&quot;, response1.content[:30])

time.sleep(11)  # \u7B49\u5F8511\u79D2\uFF0C\u7F13\u5B58\u8FC7\u671F
response2 = llm.invoke(&quot;\u6D4B\u8BD5TTL\u7F13\u5B58\u5931\u6548&quot;)  # \u7F13\u5B58\u8FC7\u671F\uFF0C\u91CD\u65B0\u8C03\u7528LLM
print(&quot;\u7F13\u5B58\u8FC7\u671F\u540E\u8C03\u7528\uFF1A&quot;, response2.content[:30])
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u4EE3\u7801\u8BF4\u660E\uFF1A\u7F13\u5B58\u5B58\u6D3B\u65F6\u95F4\u8BBE\u7F6E\u4E3A10\u79D2\uFF0C10\u79D2\u5185\u8C03\u7528\u4F1A\u547D\u4E2D\u7F13\u5B58\uFF0C10\u79D2\u540E\u7F13\u5B58\u81EA\u52A8\u5931\u6548\uFF0C\u91CD\u65B0\u8C03\u7528LLM\u751F\u6210\u65B0\u7ED3\u679C\u5E76\u7F13\u5B58[superscript:3]\u3002</p><h3 id="_17-4-2-\u7B56\u75652-\u4E3B\u52A8\u5931\u6548\u7B56\u7565-\u624B\u52A8\u5220\u9664" tabindex="-1"><a class="header-anchor" href="#_17-4-2-\u7B56\u75652-\u4E3B\u52A8\u5931\u6548\u7B56\u7565-\u624B\u52A8\u5220\u9664" aria-hidden="true">#</a> 17.4.2 \u7B56\u75652\uFF1A\u4E3B\u52A8\u5931\u6548\u7B56\u7565\uFF08\u624B\u52A8\u5220\u9664\uFF09</h3><p>\u9002\u7528\u4E8E\u5185\u5BB9\u66F4\u65B0\u4E0D\u786E\u5B9A\u7684\u573A\u666F\uFF08\u5982\u4EA7\u54C1\u6587\u6863\u968F\u65F6\u53EF\u80FD\u66F4\u65B0\uFF09\uFF1A\u5F53\u5185\u5BB9\u53D1\u751F\u53D8\u5316\u65F6\uFF0C\u624B\u52A8\u5220\u9664\u5BF9\u5E94\u7684\u7F13\u5B58\u952E\uFF0C\u786E\u4FDD\u4E0B\u6B21\u8BF7\u6C42\u80FD\u83B7\u53D6\u6700\u65B0\u7ED3\u679C[superscript:6]\u3002</p><p>\u4EE3\u7801\u793A\u4F8B\uFF08\u624B\u52A8\u5220\u9664\u7F13\u5B58\uFF0C\u7B80\u77ED\u53EF\u8FD0\u884C\uFF09\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain.globals import set_llm_cache, get_llm_cache
from langchain.cache import InMemoryCache
from langchain_openai import ChatOpenAI

# 1. \u542F\u7528\u5185\u5B58\u7F13\u5B58
cache = InMemoryCache()
set_llm_cache(cache)

# 2. \u521D\u59CB\u5316LLM\u5E76\u8C03\u7528\uFF08\u751F\u6210\u7F13\u5B58\uFF09
llm = ChatOpenAI(model=&quot;gpt-3.5-turbo&quot;, api_key=&quot;\u4F60\u7684API Key&quot;)
prompt = &quot;\u4EA7\u54C1X\u7684\u529F\u80FD\u4ECB\u7ECD&quot;
response1 = llm.invoke(prompt)
print(&quot;\u7B2C\u4E00\u6B21\u8C03\u7528\uFF08\u6709\u7F13\u5B58\uFF09\uFF1A&quot;, response1.content[:30])

# 3. \u4EA7\u54C1\u6587\u6863\u66F4\u65B0\uFF0C\u624B\u52A8\u5220\u9664\u5BF9\u5E94\u7F13\u5B58\u952E
# \u83B7\u53D6\u7F13\u5B58\u952E\uFF08\u590D\u7528LangChain\u9ED8\u8BA4\u7684\u952E\u751F\u6210\u903B\u8F91\uFF09
cache_key = cache._key(prompt, llm)
cache.delete(cache_key)  # \u624B\u52A8\u5220\u9664\u7F13\u5B58

# 4. \u518D\u6B21\u8C03\u7528\uFF0C\u7F13\u5B58\u5DF2\u5220\u9664\uFF0C\u83B7\u53D6\u6700\u65B0\u7ED3\u679C
response2 = llm.invoke(prompt)
print(&quot;\u5220\u9664\u7F13\u5B58\u540E\u8C03\u7528\uFF1A&quot;, response2.content[:30])
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u4EE3\u7801\u6765\u6E90\uFF1A\u57FA\u4E8ELangChain\u5B98\u65B9\u7F13\u5B58API\u793A\u4F8B\u7B80\u5316[superscript:2]\uFF0C\u5173\u952E\u8BF4\u660E\uFF1A\u5B9E\u9645\u751F\u4EA7\u4E2D\uFF0C\u53EF\u5728\u201C\u5185\u5BB9\u66F4\u65B0\u63A5\u53E3\u201D\u4E2D\u6DFB\u52A0\u7F13\u5B58\u5220\u9664\u903B\u8F91\uFF0C\u5B9E\u73B0\u201C\u5185\u5BB9\u66F4\u65B0\u2192\u7F13\u5B58\u5931\u6548\u2192\u83B7\u53D6\u6700\u65B0\u7ED3\u679C\u201D\u7684\u95ED\u73AF\u3002</p><h3 id="_17-4-3-\u7B56\u75653-lru\u5931\u6548\u7B56\u7565-\u6DD8\u6C70\u6700\u5C11\u4F7F\u7528" tabindex="-1"><a class="header-anchor" href="#_17-4-3-\u7B56\u75653-lru\u5931\u6548\u7B56\u7565-\u6DD8\u6C70\u6700\u5C11\u4F7F\u7528" aria-hidden="true">#</a> 17.4.3 \u7B56\u75653\uFF1ALRU\u5931\u6548\u7B56\u7565\uFF08\u6DD8\u6C70\u6700\u5C11\u4F7F\u7528\uFF09</h3><p>\u9002\u7528\u4E8E\u7F13\u5B58\u7A7A\u95F4\u6709\u9650\u7684\u573A\u666F\uFF1A\u5F53\u7F13\u5B58\u8FBE\u5230\u6700\u5927\u5BB9\u91CF\u65F6\uFF0C\u81EA\u52A8\u6DD8\u6C70\u201C\u6700\u5C11\u4F7F\u7528\uFF08LRU\uFF0CLeast Recently Used\uFF09\u201D\u7684\u7F13\u5B58\u9879\uFF0C\u786E\u4FDD\u7F13\u5B58\u7A7A\u95F4\u4E0D\u6EA2\u51FA[superscript:3]\u3002</p><p>\u4EE3\u7801\u793A\u4F8B\uFF08LRU\u7F13\u5B58\uFF0C\u7B80\u77ED\u53EF\u8FD0\u884C\uFF09\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain.globals import set_llm_cache
from langchain.cache import InMemoryCache
from langchain_openai import ChatOpenAI

# 1. LRU\u7F13\u5B58\u7C7B\uFF08\u7EE7\u627FInMemoryCache\uFF0C\u6DFB\u52A0\u5BB9\u91CF\u9650\u5236\u548CLRU\u6DD8\u6C70\uFF09
class LRUInMemoryCache(InMemoryCache):
    def __init__(self, max_size=100):  # \u7F13\u5B58\u6700\u5927\u5BB9\u91CF100\u6761
        super().__init__()
        self.max_size = max_size
        self.access_order = []  # \u8BB0\u5F55\u7F13\u5B58\u8BBF\u95EE\u987A\u5E8F
    
    def get(self, key):
        if key in self.cache:
            # \u8BBF\u95EE\u540E\uFF0C\u5C06\u952E\u79FB\u5230\u8BBF\u95EE\u987A\u5E8F\u7684\u672B\u5C3E\uFF08\u6807\u8BB0\u4E3A\u6700\u8FD1\u4F7F\u7528\uFF09
            self.access_order.remove(key)
            self.access_order.append(key)
            return self.cache[key]
        return None
    
    def set(self, key, value):
        if key in self.cache:
            self.access_order.remove(key)
        elif len(self.cache) &gt;= self.max_size:
            # \u7F13\u5B58\u6EE1\u4E86\uFF0C\u6DD8\u6C70\u6700\u5C11\u4F7F\u7528\u7684\u952E\uFF08\u8BBF\u95EE\u987A\u5E8F\u7684\u7B2C\u4E00\u4E2A\uFF09
            lru_key = self.access_order.pop(0)
            del self.cache[lru_key]
        self.cache[key] = value
        self.access_order.append(key)

# 2. \u542F\u7528LRU\u7F13\u5B58\uFF08\u6700\u5927\u5BB9\u91CF3\u6761\uFF09
set_llm_cache(LRUInMemoryCache(max_size=3))

# 3. \u6D4B\u8BD5LRU\u6DD8\u6C70
llm = ChatOpenAI(model=&quot;gpt-3.5-turbo&quot;, api_key=&quot;\u4F60\u7684API Key&quot;)
# \u751F\u62103\u6761\u7F13\u5B58
llm.invoke(&quot;\u8BF7\u6C421&quot;)
llm.invoke(&quot;\u8BF7\u6C422&quot;)
llm.invoke(&quot;\u8BF7\u6C423&quot;)
print(&quot;\u7F13\u5B58\u5BB9\u91CF\uFF1A&quot;, len(get_llm_cache().cache))  # \u8F93\u51FA3

# \u65B0\u589E\u7B2C4\u6761\u7F13\u5B58\uFF0C\u6DD8\u6C70\u6700\u5C11\u4F7F\u7528\u7684&quot;\u8BF7\u6C421&quot;
llm.invoke(&quot;\u8BF7\u6C424&quot;)
print(&quot;\u7F13\u5B58\u4E2D\u662F\u5426\u6709\u8BF7\u6C421\uFF1A&quot;, &quot;\u8BF7\u6C421&quot; in get_llm_cache().cache)  # \u8F93\u51FAFalse
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_17-4-4-\u5931\u6548\u7B56\u7565\u9009\u62E9\u6307\u5357" tabindex="-1"><a class="header-anchor" href="#_17-4-4-\u5931\u6548\u7B56\u7565\u9009\u62E9\u6307\u5357" aria-hidden="true">#</a> 17.4.4 \u5931\u6548\u7B56\u7565\u9009\u62E9\u6307\u5357</h3><ul><li>\u5185\u5BB9\u66F4\u65B0\u56FA\u5B9A\uFF08\u5982\u6BCF\u65E5\u66F4\u65B0\uFF09\uFF1A\u9009\u62E9TTL\u7B56\u7565\uFF0C\u8BBE\u7F6E\u4E0E\u66F4\u65B0\u9891\u7387\u5339\u914D\u7684\u5B58\u6D3B\u65F6\u95F4\uFF08\u59821\u5929\uFF09\u3002</li></ul><p>\u5185\u5BB9\u66F4\u65B0\u56FA\u5B9A\uFF08\u5982\u6BCF\u65E5\u66F4\u65B0\uFF09\uFF1A\u9009\u62E9TTL\u7B56\u7565\uFF0C\u8BBE\u7F6E\u4E0E\u66F4\u65B0\u9891\u7387\u5339\u914D\u7684\u5B58\u6D3B\u65F6\u95F4\uFF08\u59821\u5929\uFF09\u3002</p><ul><li>\u5185\u5BB9\u66F4\u65B0\u4E0D\u786E\u5B9A\uFF08\u5982\u968F\u65F6\u66F4\u65B0\uFF09\uFF1A\u9009\u62E9\u4E3B\u52A8\u5931\u6548\u7B56\u7565\uFF0C\u5185\u5BB9\u66F4\u65B0\u65F6\u624B\u52A8\u5220\u9664\u5BF9\u5E94\u7F13\u5B58\u3002</li></ul><p>\u5185\u5BB9\u66F4\u65B0\u4E0D\u786E\u5B9A\uFF08\u5982\u968F\u65F6\u66F4\u65B0\uFF09\uFF1A\u9009\u62E9\u4E3B\u52A8\u5931\u6548\u7B56\u7565\uFF0C\u5185\u5BB9\u66F4\u65B0\u65F6\u624B\u52A8\u5220\u9664\u5BF9\u5E94\u7F13\u5B58\u3002</p><ul><li>\u7F13\u5B58\u7A7A\u95F4\u6709\u9650\uFF08\u5982\u670D\u52A1\u5668\u5185\u5B58\u8F83\u5C0F\uFF09\uFF1A\u9009\u62E9LRU\u7B56\u7565\uFF0C\u9650\u5236\u7F13\u5B58\u5BB9\u91CF\uFF0C\u907F\u514D\u5185\u5B58\u6EA2\u51FA[superscript:3]\u3002</li></ul><p>\u7F13\u5B58\u7A7A\u95F4\u6709\u9650\uFF08\u5982\u670D\u52A1\u5668\u5185\u5B58\u8F83\u5C0F\uFF09\uFF1A\u9009\u62E9LRU\u7B56\u7565\uFF0C\u9650\u5236\u7F13\u5B58\u5BB9\u91CF\uFF0C\u907F\u514D\u5185\u5B58\u6EA2\u51FA[superscript:3]\u3002</p><ul><li>\u751F\u4EA7\u6700\u4F73\u5B9E\u8DF5\uFF1ATTL\u7B56\u7565+\u4E3B\u52A8\u5931\u6548\u7B56\u7565\u7ED3\u5408\uFF0C\u65E2\u907F\u514D\u7F13\u5B58\u957F\u671F\u8FC7\u65F6\uFF0C\u53C8\u80FD\u5728\u5185\u5BB9\u66F4\u65B0\u65F6\u53CA\u65F6\u5931\u6548\u3002</li></ul><p>\u751F\u4EA7\u6700\u4F73\u5B9E\u8DF5\uFF1ATTL\u7B56\u7565+\u4E3B\u52A8\u5931\u6548\u7B56\u7565\u7ED3\u5408\uFF0C\u65E2\u907F\u514D\u7F13\u5B58\u957F\u671F\u8FC7\u65F6\uFF0C\u53C8\u80FD\u5728\u5185\u5BB9\u66F4\u65B0\u65F6\u53CA\u65F6\u5931\u6548\u3002</p><h2 id="_17-5-\u5411\u91CF\u68C0\u7D22\u7ED3\u679C\u7F13\u5B58" tabindex="-1"><a class="header-anchor" href="#_17-5-\u5411\u91CF\u68C0\u7D22\u7ED3\u679C\u7F13\u5B58" aria-hidden="true">#</a> 17.5 \u5411\u91CF\u68C0\u7D22\u7ED3\u679C\u7F13\u5B58</h2><p>\u5728RAG\uFF08\u68C0\u7D22\u589E\u5F3A\u751F\u6210\uFF09\u573A\u666F\u4E2D\uFF0C\u5411\u91CF\u68C0\u7D22\u662F\u6838\u5FC3\u73AF\u8282\u2014\u2014\u5C06\u7528\u6237\u67E5\u8BE2\u8F6C\u5316\u4E3A\u5411\u91CF\uFF0C\u518D\u4E0E\u5411\u91CF\u6570\u636E\u5E93\u4E2D\u7684\u6587\u6863\u5411\u91CF\u8FDB\u884C\u76F8\u4F3C\u5EA6\u8BA1\u7B97\uFF0C\u8FD4\u56DE\u6700\u76F8\u5173\u7684\u6587\u6863[superscript:4]\u3002\u5411\u91CF\u68C0\u7D22\u7684\u8BA1\u7B97\u6210\u672C\u8F83\u9AD8\uFF0C\u4E14\u9AD8\u9891\u67E5\u8BE2\u4E2D\u5B58\u5728\u5927\u91CF\u91CD\u590D\u8BF7\u6C42\uFF0C\u56E0\u6B64\u5411\u91CF\u68C0\u7D22\u7ED3\u679C\u7684\u7F13\u5B58\u5C24\u4E3A\u91CD\u8981\u3002</p><p>LangChain\u63D0\u4F9B\u4E86CacheBackedEmbeddings\u5DE5\u5177\uFF0C\u4E13\u95E8\u7528\u4E8E\u7F13\u5B58\u5411\u91CF\u5D4C\u5165\u7ED3\u679C\uFF0C\u540C\u65F6\u53EF\u7ED3\u5408\u524D\u9762\u7684\u7F13\u5B58\u65B9\u6848\uFF0C\u7F13\u5B58\u5411\u91CF\u68C0\u7D22\u7684\u6700\u7EC8\u7ED3\u679C[superscript:1][superscript:7]\u3002</p><h3 id="_17-5-1-\u5411\u91CF\u5D4C\u5165\u7F13\u5B58-cachebackedembeddings" tabindex="-1"><a class="header-anchor" href="#_17-5-1-\u5411\u91CF\u5D4C\u5165\u7F13\u5B58-cachebackedembeddings" aria-hidden="true">#</a> 17.5.1 \u5411\u91CF\u5D4C\u5165\u7F13\u5B58\uFF08CacheBackedEmbeddings\uFF09</h3><p>\u5411\u91CF\u5D4C\u5165\u7684\u751F\u6210\uFF08\u5C24\u5176\u662F\u8C03\u7528API\u751F\u6210\u5D4C\u5165\uFF09\u8017\u65F6\u4E14\u8017\u6210\u672C\uFF0CCacheBackedEmbeddings\u53EF\u5C06\u5D4C\u5165\u7ED3\u679C\u7F13\u5B58\u5230\u952E\u503C\u5B58\u50A8\u4E2D\uFF0C\u907F\u514D\u91CD\u590D\u8BA1\u7B97[superscript:1]\u3002\u5176\u6838\u5FC3\u903B\u8F91\uFF1A\u5BF9\u6587\u672C\u8FDB\u884C\u54C8\u5E0C\u5904\u7406\u751F\u6210\u552F\u4E00\u952E\uFF0C\u5C06\u5D4C\u5165\u7ED3\u679C\u4E0E\u952E\u7ED1\u5B9A\u5B58\u50A8\uFF0C\u4E0B\u6B21\u76F8\u540C\u6587\u672C\u751F\u6210\u5D4C\u5165\u65F6\uFF0C\u76F4\u63A5\u4ECE\u7F13\u5B58\u83B7\u53D6\u3002</p><p>\u4EE3\u7801\u793A\u4F8B\uFF08\u5411\u91CF\u5D4C\u5165\u7F13\u5B58\uFF0C\u7B80\u77ED\u53EF\u8FD0\u884C\uFF09\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain.embeddings import OpenAIEmbeddings
from langchain.cache import InMemoryCache
from langchain.embeddings.cache import CacheBackedEmbeddings
import langchain

# 1. \u542F\u7528\u5185\u5B58\u7F13\u5B58
langchain.llm_cache = InMemoryCache()

# 2. \u521D\u59CB\u5316\u539F\u59CB\u5D4C\u5165\u6A21\u578B\uFF08\u8C03\u7528API\u751F\u6210\u5D4C\u5165\uFF09
original_embeddings = OpenAIEmbeddings(model=&quot;text-embedding-ada-002&quot;, api_key=&quot;\u4F60\u7684API Key&quot;)

# 3. \u7528CacheBackedEmbeddings\u5305\u88C5\uFF0C\u5B9E\u73B0\u5D4C\u5165\u7F13\u5B58
cached_embeddings = CacheBackedEmbeddings.from_bytes_store(
    original_embeddings,
    langchain.llm_cache  # \u590D\u7528\u5185\u5B58\u7F13\u5B58
)

# 4. \u6D4B\u8BD5\u5D4C\u5165\u7F13\u5B58
text = &quot;LangChain\u5411\u91CF\u68C0\u7D22\u7F13\u5B58&quot;
# \u7B2C\u4E00\u6B21\u751F\u6210\u5D4C\u5165\uFF1A\u8C03\u7528API\uFF0C\u5B58\u5165\u7F13\u5B58
emb1 = cached_embeddings.embed_query(text)
print(&quot;\u7B2C\u4E00\u6B21\u751F\u6210\u5D4C\u5165\uFF08\u8C03\u7528API\uFF09\uFF1A&quot;, len(emb1))

# \u7B2C\u4E8C\u6B21\u751F\u6210\u5D4C\u5165\uFF1A\u4ECE\u7F13\u5B58\u83B7\u53D6\uFF0C\u4E0D\u8C03\u7528API
emb2 = cached_embeddings.embed_query(text)
print(&quot;\u7B2C\u4E8C\u6B21\u751F\u6210\u5D4C\u5165\uFF08\u4ECE\u7F13\u5B58\u83B7\u53D6\uFF09\uFF1A&quot;, len(emb2))
print(&quot;\u4E24\u6B21\u5D4C\u5165\u662F\u5426\u4E00\u81F4\uFF1A&quot;, emb1 == emb2)  # \u8F93\u51FATrue
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u4EE3\u7801\u6765\u6E90\uFF1A\u6398\u91D1LangChain\u5D4C\u5165\u7F13\u5B58\u5B9E\u6218[superscript:1]\uFF0C\u5173\u952E\u8BF4\u660E\uFF1ACacheBackedEmbeddings\u652F\u6301\u591A\u79CD\u7F13\u5B58\u5B58\u50A8\uFF08\u5982InMemoryCache\u3001SQLiteCache\uFF09\uFF0C\u53EF\u6839\u636E\u573A\u666F\u9009\u62E9\uFF0C\u5927\u5E45\u51CF\u5C11\u5D4C\u5165API\u7684\u8C03\u7528\u6B21\u6570\u548C\u6210\u672C\u3002</p><h3 id="_17-5-2-\u5411\u91CF\u68C0\u7D22\u7ED3\u679C\u7F13\u5B58-\u5B8C\u6574\u6D41\u7A0B" tabindex="-1"><a class="header-anchor" href="#_17-5-2-\u5411\u91CF\u68C0\u7D22\u7ED3\u679C\u7F13\u5B58-\u5B8C\u6574\u6D41\u7A0B" aria-hidden="true">#</a> 17.5.2 \u5411\u91CF\u68C0\u7D22\u7ED3\u679C\u7F13\u5B58\uFF08\u5B8C\u6574\u6D41\u7A0B\uFF09</h3><p>\u9664\u4E86\u7F13\u5B58\u5D4C\u5165\u7ED3\u679C\uFF0C\u8FD8\u53EF\u7F13\u5B58\u5411\u91CF\u68C0\u7D22\u7684\u6700\u7EC8\u7ED3\u679C\uFF08\u5373\u201C\u7528\u6237\u67E5\u8BE2\u2192\u76F8\u5173\u6587\u6863\u5217\u8868\u201D\u7684\u6620\u5C04\uFF09\uFF0C\u8FDB\u4E00\u6B65\u63D0\u5347RAG\u573A\u666F\u7684\u54CD\u5E94\u901F\u5EA6[superscript:4]\u3002</p><p>\u4EE3\u7801\u793A\u4F8B\uFF08\u5411\u91CF\u68C0\u7D22\u7ED3\u679C\u7F13\u5B58\uFF0C\u7B80\u77ED\u53EF\u8FD0\u884C\uFF09\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain.globals import set_llm_cache
from langchain.cache import InMemoryCache
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter

# 1. \u542F\u7528\u7F13\u5B58\uFF08\u7F13\u5B58\u68C0\u7D22\u7ED3\u679C\uFF09
set_llm_cache(InMemoryCache())

# 2. \u521D\u59CB\u5316\u5D4C\u5165\u6A21\u578B\uFF08\u5E26\u7F13\u5B58\uFF09
embeddings = OpenAIEmbeddings(model=&quot;text-embedding-ada-002&quot;, api_key=&quot;\u4F60\u7684API Key&quot;)
cached_embeddings = CacheBackedEmbeddings.from_bytes_store(embeddings, InMemoryCache())

# 3. \u51C6\u5907\u6587\u6863\u5E76\u521B\u5EFA\u5411\u91CF\u5E93
texts = [&quot;LangChain\u7F13\u5B58\u6559\u7A0B&quot;, &quot;\u5411\u91CF\u68C0\u7D22\u7F13\u5B58\u65B9\u6CD5&quot;, &quot;RAG\u6027\u80FD\u4F18\u5316\u6280\u5DE7&quot;]
vector_db = Chroma.from_texts(texts, cached_embeddings)

# 4. \u5B9A\u4E49\u5E26\u7F13\u5B58\u7684\u68C0\u7D22\u51FD\u6570
def cached_retrieval(query):
    # \u590D\u7528LangChain\u7F13\u5B58\uFF0C\u7F13\u5B58\u68C0\u7D22\u7ED3\u679C
    return vector_db.similarity_search(query, k=2)

# 5. \u6D4B\u8BD5\u68C0\u7D22\u7F13\u5B58
query = &quot;LangChain\u7F13\u5B58&quot;
# \u7B2C\u4E00\u6B21\u68C0\u7D22\uFF1A\u6267\u884C\u5411\u91CF\u8BA1\u7B97\uFF0C\u5B58\u5165\u7F13\u5B58
result1 = cached_retrieval(query)
print(&quot;\u7B2C\u4E00\u6B21\u68C0\u7D22\uFF08\u65E0\u7F13\u5B58\uFF09\uFF1A&quot;, [doc.page_content for doc in result1])

# \u7B2C\u4E8C\u6B21\u68C0\u7D22\uFF1A\u4ECE\u7F13\u5B58\u83B7\u53D6\uFF0C\u65E0\u9700\u5411\u91CF\u8BA1\u7B97
result2 = cached_retrieval(query)
print(&quot;\u7B2C\u4E8C\u6B21\u68C0\u7D22\uFF08\u6709\u7F13\u5B58\uFF09\uFF1A&quot;, [doc.page_content for doc in result2])
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u4EE3\u7801\u8BF4\u660E\uFF1A\u901A\u8FC7CacheBackedEmbeddings\u7F13\u5B58\u5D4C\u5165\u7ED3\u679C\uFF0C\u540C\u65F6\u901A\u8FC7\u5168\u5C40\u7F13\u5B58\u7F13\u5B58\u68C0\u7D22\u7ED3\u679C\uFF0C\u53CC\u91CD\u7F13\u5B58\u53EF\u4F7FRAG\u573A\u666F\u7684\u54CD\u5E94\u901F\u5EA6\u63D0\u534780%\u4EE5\u4E0A[superscript:4]\u3002</p><h3 id="_17-5-3-\u5411\u91CF\u7F13\u5B58\u6CE8\u610F\u4E8B\u9879" tabindex="-1"><a class="header-anchor" href="#_17-5-3-\u5411\u91CF\u7F13\u5B58\u6CE8\u610F\u4E8B\u9879" aria-hidden="true">#</a> 17.5.3 \u5411\u91CF\u7F13\u5B58\u6CE8\u610F\u4E8B\u9879</h3><ul><li>\u5D4C\u5165\u6A21\u578B\u4E00\u81F4\u6027\uFF1A\u7F13\u5B58\u7684\u5D4C\u5165\u7ED3\u679C\u4E0E\u5D4C\u5165\u6A21\u578B\u5F3A\u7ED1\u5B9A\uFF0C\u66F4\u6362\u5D4C\u5165\u6A21\u578B\u540E\uFF0C\u9700\u6E05\u7A7A\u7F13\u5B58\uFF0C\u5426\u5219\u4F1A\u5BFC\u81F4\u68C0\u7D22\u7ED3\u679C\u4E0D\u51C6\u786E[superscript:7]\u3002</li></ul><p>\u5D4C\u5165\u6A21\u578B\u4E00\u81F4\u6027\uFF1A\u7F13\u5B58\u7684\u5D4C\u5165\u7ED3\u679C\u4E0E\u5D4C\u5165\u6A21\u578B\u5F3A\u7ED1\u5B9A\uFF0C\u66F4\u6362\u5D4C\u5165\u6A21\u578B\u540E\uFF0C\u9700\u6E05\u7A7A\u7F13\u5B58\uFF0C\u5426\u5219\u4F1A\u5BFC\u81F4\u68C0\u7D22\u7ED3\u679C\u4E0D\u51C6\u786E[superscript:7]\u3002</p><ul><li>\u6587\u6863\u66F4\u65B0\u5904\u7406\uFF1A\u5F53\u5411\u91CF\u6570\u636E\u5E93\u4E2D\u7684\u6587\u6863\u66F4\u65B0\u65F6\uFF0C\u9700\u5220\u9664\u5BF9\u5E94\u6587\u6863\u7684\u5D4C\u5165\u7F13\u5B58\u548C\u68C0\u7D22\u7ED3\u679C\u7F13\u5B58\uFF0C\u907F\u514D\u4F7F\u7528\u65E7\u6587\u6863\u7684\u5D4C\u5165[superscript:4]\u3002</li></ul><p>\u6587\u6863\u66F4\u65B0\u5904\u7406\uFF1A\u5F53\u5411\u91CF\u6570\u636E\u5E93\u4E2D\u7684\u6587\u6863\u66F4\u65B0\u65F6\uFF0C\u9700\u5220\u9664\u5BF9\u5E94\u6587\u6863\u7684\u5D4C\u5165\u7F13\u5B58\u548C\u68C0\u7D22\u7ED3\u679C\u7F13\u5B58\uFF0C\u907F\u514D\u4F7F\u7528\u65E7\u6587\u6863\u7684\u5D4C\u5165[superscript:4]\u3002</p><ul><li>\u7F13\u5B58\u952E\u8BBE\u8BA1\uFF1A\u5411\u91CF\u7F13\u5B58\u7684\u952E\u5EFA\u8BAE\u4F7F\u7528\u201C\u6587\u672C\u54C8\u5E0C+\u5D4C\u5165\u6A21\u578B\u540D\u79F0\u201D\uFF0C\u786E\u4FDD\u4E0D\u540C\u6587\u672C\u3001\u4E0D\u540C\u6A21\u578B\u7684\u5D4C\u5165\u4E0D\u51B2\u7A81[superscript:7]\u3002</li></ul><p>\u7F13\u5B58\u952E\u8BBE\u8BA1\uFF1A\u5411\u91CF\u7F13\u5B58\u7684\u952E\u5EFA\u8BAE\u4F7F\u7528\u201C\u6587\u672C\u54C8\u5E0C+\u5D4C\u5165\u6A21\u578B\u540D\u79F0\u201D\uFF0C\u786E\u4FDD\u4E0D\u540C\u6587\u672C\u3001\u4E0D\u540C\u6A21\u578B\u7684\u5D4C\u5165\u4E0D\u51B2\u7A81[superscript:7]\u3002</p><h2 id="_17-6-\u5F02\u6B65\u6279\u5904\u7406\u63D0\u5347\u541E\u5410\u91CF" tabindex="-1"><a class="header-anchor" href="#_17-6-\u5F02\u6B65\u6279\u5904\u7406\u63D0\u5347\u541E\u5410\u91CF" aria-hidden="true">#</a> 17.6 \u5F02\u6B65\u6279\u5904\u7406\u63D0\u5347\u541E\u5410\u91CF</h2><p>\u9664\u4E86\u7F13\u5B58\uFF0C\u5F02\u6B65\u6279\u5904\u7406\u4E5F\u662FLangChain\u6027\u80FD\u4F18\u5316\u7684\u6838\u5FC3\u624B\u6BB5\u2014\u2014\u9488\u5BF9\u6279\u91CF\u8BF7\u6C42\uFF08\u5982\u6279\u91CF\u751F\u6210\u6587\u672C\u3001\u6279\u91CF\u68C0\u7D22\u3001\u6279\u91CF\u5D4C\u5165\uFF09\uFF0C\u901A\u8FC7\u5F02\u6B65\u8C03\u7528+\u6279\u5904\u7406\uFF0C\u51CF\u5C11\u7B49\u5F85\u65F6\u95F4\uFF0C\u63D0\u5347\u7CFB\u7EDF\u541E\u5410\u91CF[superscript:5]\u3002</p><p>\u6838\u5FC3\u903B\u8F91\uFF1A\u5C06\u591A\u4E2A\u72EC\u7ACB\u8BF7\u6C42\u5408\u5E76\u4E3A\u4E00\u4E2A\u6279\u6B21\uFF0C\u5F02\u6B65\u8C03\u7528LLM/\u5411\u91CF\u6A21\u578B\uFF0C\u907F\u514D\u5355\u4E2A\u8BF7\u6C42\u9010\u4E2A\u7B49\u5F85\u54CD\u5E94\uFF0C\u5C24\u5176\u9002\u5408\u9AD8\u9891\u6279\u91CF\u573A\u666F\uFF08\u5982\u6279\u91CF\u5904\u7406\u7528\u6237\u67E5\u8BE2\u3001\u6279\u91CF\u751F\u6210\u6587\u6863\u6458\u8981\uFF09\u3002</p><h3 id="_17-6-1-\u5F02\u6B65\u8C03\u7528\u57FA\u7840-\u5355\u8BF7\u6C42\u5F02\u6B65" tabindex="-1"><a class="header-anchor" href="#_17-6-1-\u5F02\u6B65\u8C03\u7528\u57FA\u7840-\u5355\u8BF7\u6C42\u5F02\u6B65" aria-hidden="true">#</a> 17.6.1 \u5F02\u6B65\u8C03\u7528\u57FA\u7840\uFF08\u5355\u8BF7\u6C42\u5F02\u6B65\uFF09</h3><p>LangChain\u652F\u6301\u5F02\u6B65\u8C03\u7528\uFF08async/await\uFF09\uFF0C\u901A\u8FC7Python\u7684asyncio\u5E93\u5B9E\u73B0\uFF0C\u53EF\u5728\u7B49\u5F85\u4E00\u4E2A\u8BF7\u6C42\u54CD\u5E94\u7684\u540C\u65F6\uFF0C\u5904\u7406\u5176\u4ED6\u8BF7\u6C42\uFF0C\u63D0\u5347\u5E76\u53D1\u80FD\u529B[superscript:5]\u3002</p><p>\u4EE3\u7801\u793A\u4F8B\uFF08\u5F02\u6B65\u8C03\u7528LLM\uFF0C\u7B80\u77ED\u53EF\u8FD0\u884C\uFF09\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>import asyncio
from langchain_openai import ChatOpenAI

# 1. \u521D\u59CB\u5316LLM\uFF08\u652F\u6301\u5F02\u6B65\uFF09
llm = ChatOpenAI(model=&quot;gpt-3.5-turbo&quot;, api_key=&quot;\u4F60\u7684API Key&quot;)

# 2. \u5B9A\u4E49\u5F02\u6B65\u8C03\u7528\u51FD\u6570
async def async_llm_call(prompt):
    return await llm.ainvoke(prompt)

# 3. \u5F02\u6B65\u6267\u884C
async def main():
    # \u540C\u65F6\u53D1\u8D772\u4E2A\u5F02\u6B65\u8BF7\u6C42
    task1 = async_llm_call(&quot;\u4ECB\u7ECDLangChain\u5F02\u6B65\u8C03\u7528&quot;)
    task2 = async_llm_call(&quot;\u4ECB\u7ECDLangChain\u6279\u5904\u7406&quot;)
    # \u7B49\u5F85\u6240\u6709\u4EFB\u52A1\u5B8C\u6210
    results = await asyncio.gather(task1, task2)
    for i, result in enumerate(results):
        print(f&quot;\u8BF7\u6C42{i+1}\u7ED3\u679C\uFF1A&quot;, result.content[:30])

# \u8FD0\u884C\u5F02\u6B65\u51FD\u6570
asyncio.run(main())
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u4EE3\u7801\u6765\u6E90\uFF1A\u6398\u91D1LangChain\u5F02\u6B65\u5904\u7406\u6DF1\u5EA6\u89E3\u6790[superscript:5]\uFF0C\u8FD0\u884C\u6548\u679C\uFF1A\u4E24\u4E2A\u8BF7\u6C42\u540C\u65F6\u53D1\u8D77\uFF0C\u603B\u8017\u65F6\u63A5\u8FD1\u5355\u4E2A\u8BF7\u6C42\u7684\u8017\u65F6\uFF0C\u800C\u975E\u4E24\u4E2A\u8BF7\u6C42\u8017\u65F6\u4E4B\u548C\uFF0C\u5927\u5E45\u63D0\u5347\u6548\u7387\u3002</p><h3 id="_17-6-2-\u6279\u91CF\u5904\u7406-\u591A\u8BF7\u6C42\u5408\u5E76" tabindex="-1"><a class="header-anchor" href="#_17-6-2-\u6279\u91CF\u5904\u7406-\u591A\u8BF7\u6C42\u5408\u5E76" aria-hidden="true">#</a> 17.6.2 \u6279\u91CF\u5904\u7406\uFF08\u591A\u8BF7\u6C42\u5408\u5E76\uFF09</h3><p>\u5BF9\u4E8E\u5927\u91CF\u76F8\u540C\u7C7B\u578B\u7684\u8BF7\u6C42\uFF08\u5982\u6279\u91CF\u751F\u6210100\u6761\u4EA7\u54C1\u63CF\u8FF0\uFF09\uFF0C\u4F7F\u7528\u6279\u5904\u7406\u5C06\u591A\u4E2A\u8BF7\u6C42\u5408\u5E76\u4E3A\u4E00\u4E2A\u6279\u6B21\uFF0C\u51CF\u5C11API\u8C03\u7528\u6B21\u6570\uFF0C\u63D0\u5347\u541E\u5410\u91CF[superscript:5]\u3002</p><p>\u4EE3\u7801\u793A\u4F8B\uFF08LLM\u6279\u5904\u7406\uFF0C\u7B80\u77ED\u53EF\u8FD0\u884C\uFF09\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

# 1. \u521D\u59CB\u5316LLM\u548CPrompt\u6A21\u677F
llm = ChatOpenAI(model=&quot;gpt-3.5-turbo&quot;, api_key=&quot;\u4F60\u7684API Key&quot;)
prompt = ChatPromptTemplate.from_template(&quot;\u751F\u6210\u4E00\u6761{product}\u7684\u7B80\u77ED\u63CF\u8FF0\uFF0810\u5B57\u4EE5\u5185\uFF09&quot;)

# 2. \u51C6\u5907\u6279\u91CF\u8BF7\u6C42\uFF0810\u4E2A\u4EA7\u54C1\uFF09
products = [&quot;\u624B\u673A&quot;, &quot;\u7535\u8111&quot;, &quot;\u8033\u673A&quot;, &quot;\u624B\u8868&quot;, &quot;\u5E73\u677F&quot;, &quot;\u97F3\u7BB1&quot;, &quot;\u952E\u76D8&quot;, &quot;\u9F20\u6807&quot;, &quot;\u5145\u7535\u5B9D&quot;, &quot;\u8033\u673A&quot;]
batch_inputs = [{&quot;product&quot;: product} for product in products]

# 3. \u6279\u5904\u7406\u8C03\u7528\uFF08\u5408\u5E76\u4E3A\u4E00\u4E2A\u6279\u6B21\uFF09
results = llm.batch(batch_inputs)

# 4. \u8F93\u51FA\u7ED3\u679C
for product, result in zip(products, results):
    print(f&quot;{product}\uFF1A&quot;, result.content)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u4EE3\u7801\u8BF4\u660E\uFF1A\u5C0610\u4E2A\u4EA7\u54C1\u63CF\u8FF0\u8BF7\u6C42\u5408\u5E76\u4E3A\u4E00\u4E2A\u6279\u6B21\uFF0C\u8C03\u7528\u4E00\u6B21LLM API\u5373\u53EF\u83B7\u53D6\u6240\u6709\u7ED3\u679C\uFF0C\u76F8\u6BD4\u5355\u4E2A\u8BF7\u6C42\u9010\u4E2A\u8C03\u7528\uFF0C\u6548\u7387\u63D0\u53475-10\u500D\uFF0C\u540C\u65F6\u51CF\u5C11API\u8C03\u7528\u6B21\u6570[superscript:5]\u3002</p><h3 id="_17-6-3-\u5F02\u6B65\u6279\u5904\u7406\u7ED3\u5408\u7F13\u5B58-\u6700\u4F73\u5B9E\u8DF5" tabindex="-1"><a class="header-anchor" href="#_17-6-3-\u5F02\u6B65\u6279\u5904\u7406\u7ED3\u5408\u7F13\u5B58-\u6700\u4F73\u5B9E\u8DF5" aria-hidden="true">#</a> 17.6.3 \u5F02\u6B65\u6279\u5904\u7406\u7ED3\u5408\u7F13\u5B58\uFF08\u6700\u4F73\u5B9E\u8DF5\uFF09</h3><p>\u751F\u4EA7\u573A\u666F\u4E2D\uFF0C\u5C06\u5F02\u6B65\u6279\u5904\u7406\u4E0E\u7F13\u5B58\u7ED3\u5408\uFF0C\u53EF\u5B9E\u73B0\u201C\u6279\u91CF\u8BF7\u6C42\u2192\u7F13\u5B58\u547D\u4E2D\u2192\u5FEB\u901F\u54CD\u5E94\u201D\u201C\u672A\u547D\u4E2D\u7F13\u5B58\u2192\u5F02\u6B65\u6279\u5904\u7406\u2192\u7F13\u5B58\u5B58\u50A8\u201D\u7684\u95ED\u73AF\uFF0C\u6700\u5927\u5316\u63D0\u5347\u541E\u5410\u91CF\u548C\u54CD\u5E94\u901F\u5EA6[superscript:5][superscript:8]\u3002</p><p>\u4EE3\u7801\u793A\u4F8B\uFF08\u5F02\u6B65\u6279\u5904\u7406+\u7F13\u5B58\uFF0C\u7B80\u77ED\u53EF\u8FD0\u884C\uFF09\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>import asyncio
from langchain.globals import set_llm_cache
from langchain.cache import InMemoryCache
from langchain_openai import ChatOpenAI

# 1. \u542F\u7528\u7F13\u5B58
set_llm_cache(InMemoryCache())

# 2. \u521D\u59CB\u5316LLM\uFF08\u652F\u6301\u5F02\u6B65\uFF09
llm = ChatOpenAI(model=&quot;gpt-3.5-turbo&quot;, api_key=&quot;\u4F60\u7684API Key&quot;)

# 3. \u5B9A\u4E49\u5F02\u6B65\u6279\u5904\u7406\u51FD\u6570
async def async_batch_with_cache(prompts):
    # \u5F02\u6B65\u6279\u91CF\u8C03\u7528\uFF0C\u81EA\u52A8\u5229\u7528\u7F13\u5B58
    tasks = [llm.ainvoke(prompt) for prompt in prompts]
    return await asyncio.gather(*tasks)

# 4. \u6D4B\u8BD5\uFF08\u5305\u542B\u91CD\u590D\u8BF7\u6C42\uFF0C\u89E6\u53D1\u7F13\u5B58\uFF09
prompts = [
    &quot;\u4ECB\u7ECDLangChain&quot;, &quot;\u4ECB\u7ECDLangChain&quot;,  # \u91CD\u590D\u8BF7\u6C42\uFF0C\u7F13\u5B58\u547D\u4E2D
    &quot;\u4ECB\u7ECD\u7F13\u5B58\u4F18\u5316&quot;, &quot;\u4ECB\u7ECD\u5F02\u6B65\u6279\u5904\u7406&quot;
]

# \u8FD0\u884C\u5F02\u6B65\u6279\u5904\u7406
results = asyncio.run(async_batch_with_cache(prompts))
for prompt, result in zip(prompts, results):
    print(f&quot;\u8BF7\u6C42\uFF1A{prompt}\\n\u7ED3\u679C\uFF1A{result.content[:30]}\\n&quot;)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u4EE3\u7801\u8BF4\u660E\uFF1A\u91CD\u590D\u8BF7\u6C42\uFF08\u201C\u4ECB\u7ECDLangChain\u201D\uFF09\u4F1A\u547D\u4E2D\u7F13\u5B58\uFF0C\u65E0\u9700\u91CD\u65B0\u8C03\u7528LLM\uFF1B\u975E\u91CD\u590D\u8BF7\u6C42\u901A\u8FC7\u5F02\u6B65\u6279\u5904\u7406\u5E76\u884C\u6267\u884C\uFF0C\u517C\u987E\u7F13\u5B58\u7684\u9AD8\u6548\u6027\u548C\u6279\u5904\u7406\u7684\u9AD8\u541E\u5410\u91CF[superscript:5]\u3002</p><h2 id="_17-7-\u5185\u5B58\u4E0E\u78C1\u76D8\u7F13\u5B58\u6743\u8861" tabindex="-1"><a class="header-anchor" href="#_17-7-\u5185\u5B58\u4E0E\u78C1\u76D8\u7F13\u5B58\u6743\u8861" aria-hidden="true">#</a> 17.7 \u5185\u5B58\u4E0E\u78C1\u76D8\u7F13\u5B58\u6743\u8861</h2><p>\u524D\u9762\u6211\u4EEC\u4ECB\u7ECD\u4E86\u5185\u5B58\u7F13\u5B58\uFF08InMemoryCache\uFF09\u548C\u78C1\u76D8\u7F13\u5B58\uFF08SQLiteCache\uFF09\uFF0C\u5B9E\u9645\u751F\u4EA7\u4E2D\uFF0C\u9700\u6839\u636E\u4E1A\u52A1\u573A\u666F\u3001\u8D44\u6E90\u9650\u5236\uFF0C\u6743\u8861\u4E24\u8005\u7684\u4F18\u7F3A\u70B9\uFF0C\u9009\u62E9\u5408\u9002\u7684\u7F13\u5B58\u65B9\u6848\u2014\u2014\u751A\u81F3\u53EF\u4EE5\u7ED3\u5408\u4F7F\u7528\uFF08\u5185\u5B58\u7F13\u5B58\u4F5C\u4E3A\u70ED\u70B9\u7F13\u5B58\uFF0C\u78C1\u76D8\u7F13\u5B58\u4F5C\u4E3A\u6301\u4E45\u5316\u5907\u4EFD\uFF09[superscript:2][superscript:8]\u3002</p><h3 id="_17-7-1-\u6838\u5FC3\u6743\u8861\u7EF4\u5EA6" tabindex="-1"><a class="header-anchor" href="#_17-7-1-\u6838\u5FC3\u6743\u8861\u7EF4\u5EA6" aria-hidden="true">#</a> 17.7.1 \u6838\u5FC3\u6743\u8861\u7EF4\u5EA6</h3><p>\u9009\u62E9\u5185\u5B58\u7F13\u5B58\u8FD8\u662F\u78C1\u76D8\u7F13\u5B58\uFF0C\u4E3B\u8981\u4ECE\u4EE5\u4E0B5\u4E2A\u7EF4\u5EA6\u6743\u8861\uFF0C\u7ED3\u5408\u4E1A\u52A1\u573A\u666F\u505A\u51FA\u51B3\u7B56[superscript:3][superscript:6]\uFF1A</p><h3 id="_17-7-2-\u573A\u666F\u5316\u9009\u62E9\u5EFA\u8BAE" tabindex="-1"><a class="header-anchor" href="#_17-7-2-\u573A\u666F\u5316\u9009\u62E9\u5EFA\u8BAE" aria-hidden="true">#</a> 17.7.2 \u573A\u666F\u5316\u9009\u62E9\u5EFA\u8BAE</h3><ul><li>\u5F00\u53D1\u6D4B\u8BD5\u573A\u666F\uFF1A\u4F18\u5148\u9009\u62E9InMemoryCache\uFF0C\u65E0\u9700\u5173\u6CE8\u6301\u4E45\u5316\uFF0C\u8BFB\u5199\u901F\u5EA6\u5FEB\uFF0C\u65B9\u4FBF\u8C03\u8BD5\u3002</li></ul><p>\u5F00\u53D1\u6D4B\u8BD5\u573A\u666F\uFF1A\u4F18\u5148\u9009\u62E9InMemoryCache\uFF0C\u65E0\u9700\u5173\u6CE8\u6301\u4E45\u5316\uFF0C\u8BFB\u5199\u901F\u5EA6\u5FEB\uFF0C\u65B9\u4FBF\u8C03\u8BD5\u3002</p><ul><li>\u751F\u4EA7\u73AF\u5883-\u9AD8\u9891\u70ED\u70B9\u8BF7\u6C42\uFF1A\u9009\u62E9\u201C\u5185\u5B58\u7F13\u5B58+\u78C1\u76D8\u7F13\u5B58\u201D\u7ED3\u5408\u2014\u2014\u70ED\u70B9\u8BF7\u6C42\uFF08\u9AD8\u9891\u91CD\u590D\uFF09\u5B58\u5728\u5185\u5B58\u7F13\u5B58\uFF0C\u63D0\u5347\u54CD\u5E94\u901F\u5EA6\uFF1B\u6240\u6709\u8BF7\u6C42\u540C\u6B65\u5230\u78C1\u76D8\u7F13\u5B58\uFF0C\u786E\u4FDD\u5E94\u7528\u91CD\u542F\u540E\u7F13\u5B58\u4E0D\u4E22\u5931[superscript:8]\u3002</li></ul><p>\u751F\u4EA7\u73AF\u5883-\u9AD8\u9891\u70ED\u70B9\u8BF7\u6C42\uFF1A\u9009\u62E9\u201C\u5185\u5B58\u7F13\u5B58+\u78C1\u76D8\u7F13\u5B58\u201D\u7ED3\u5408\u2014\u2014\u70ED\u70B9\u8BF7\u6C42\uFF08\u9AD8\u9891\u91CD\u590D\uFF09\u5B58\u5728\u5185\u5B58\u7F13\u5B58\uFF0C\u63D0\u5347\u54CD\u5E94\u901F\u5EA6\uFF1B\u6240\u6709\u8BF7\u6C42\u540C\u6B65\u5230\u78C1\u76D8\u7F13\u5B58\uFF0C\u786E\u4FDD\u5E94\u7528\u91CD\u542F\u540E\u7F13\u5B58\u4E0D\u4E22\u5931[superscript:8]\u3002</p><ul><li>\u751F\u4EA7\u73AF\u5883-\u4F4E\u9891\u8BF7\u6C42\uFF1A\u4F18\u5148\u9009\u62E9SQLiteCache\uFF0C\u65E0\u9700\u5360\u7528\u5927\u91CF\u5185\u5B58\uFF0C\u540C\u65F6\u4FDD\u8BC1\u7F13\u5B58\u6301\u4E45\u5316\uFF0C\u51CF\u5C11API\u8C03\u7528\u6210\u672C\u3002</li></ul><p>\u751F\u4EA7\u73AF\u5883-\u4F4E\u9891\u8BF7\u6C42\uFF1A\u4F18\u5148\u9009\u62E9SQLiteCache\uFF0C\u65E0\u9700\u5360\u7528\u5927\u91CF\u5185\u5B58\uFF0C\u540C\u65F6\u4FDD\u8BC1\u7F13\u5B58\u6301\u4E45\u5316\uFF0C\u51CF\u5C11API\u8C03\u7528\u6210\u672C\u3002</p><ul><li>\u5185\u5B58\u8D44\u6E90\u6709\u9650\u573A\u666F\uFF1A\u9009\u62E9SQLiteCache\uFF0C\u4EE5\u78C1\u76D8\u7A7A\u95F4\u6362\u5185\u5B58\uFF0C\u907F\u514D\u5185\u5B58\u6EA2\u51FA\u3002</li></ul><p>\u5185\u5B58\u8D44\u6E90\u6709\u9650\u573A\u666F\uFF1A\u9009\u62E9SQLiteCache\uFF0C\u4EE5\u78C1\u76D8\u7A7A\u95F4\u6362\u5185\u5B58\uFF0C\u907F\u514D\u5185\u5B58\u6EA2\u51FA\u3002</p><h3 id="_17-7-3-\u5185\u5B58-\u78C1\u76D8\u7F13\u5B58\u7ED3\u5408-\u751F\u4EA7\u6700\u4F73\u5B9E\u8DF5" tabindex="-1"><a class="header-anchor" href="#_17-7-3-\u5185\u5B58-\u78C1\u76D8\u7F13\u5B58\u7ED3\u5408-\u751F\u4EA7\u6700\u4F73\u5B9E\u8DF5" aria-hidden="true">#</a> 17.7.3 \u5185\u5B58+\u78C1\u76D8\u7F13\u5B58\u7ED3\u5408\uFF08\u751F\u4EA7\u6700\u4F73\u5B9E\u8DF5\uFF09</h3><p>\u4EE3\u7801\u793A\u4F8B\uFF08\u53CC\u91CD\u7F13\u5B58\uFF0C\u70ED\u70B9\u5B58\u5185\u5B58\uFF0C\u6301\u4E45\u5316\u5B58\u78C1\u76D8\uFF09\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain.globals import set_llm_cache
from langchain.cache import InMemoryCache
from langchain_community.cache import SQLiteCache
from langchain_openai import ChatOpenAI

# 1. \u5B9A\u4E49\u53CC\u91CD\u7F13\u5B58\u7C7B\uFF08\u5185\u5B58\u7F13\u5B58+\u78C1\u76D8\u7F13\u5B58\uFF09
class DualCache(InMemoryCache):
    def __init__(self, disk_cache_path=&quot;.langchain.db&quot;):
        super().__init__()
        self.disk_cache = SQLiteCache(database_path=disk_cache_path)
    
    def get(self, key):
        # \u5148\u4ECE\u5185\u5B58\u7F13\u5B58\u83B7\u53D6\uFF0C\u672A\u547D\u4E2D\u518D\u4ECE\u78C1\u76D8\u7F13\u5B58\u83B7\u53D6
        value = super().get(key)
        if value is None:
            value = self.disk_cache.get(key)
            # \u78C1\u76D8\u7F13\u5B58\u547D\u4E2D\uFF0C\u540C\u6B65\u5230\u5185\u5B58\u7F13\u5B58\uFF08\u4E0B\u6B21\u66F4\u5FEB\uFF09
            if value is not None:
                self.set(key, value)
        return value
    
    def set(self, key, value):
        # \u540C\u65F6\u5B58\u5165\u5185\u5B58\u7F13\u5B58\u548C\u78C1\u76D8\u7F13\u5B58
        super().set(key, value)
        self.disk_cache.set(key, value)
    
    def delete(self, key):
        # \u540C\u65F6\u5220\u9664\u5185\u5B58\u548C\u78C1\u76D8\u7F13\u5B58
        super().delete(key)
        self.disk_cache.delete(key)

# 2. \u542F\u7528\u53CC\u91CD\u7F13\u5B58
set_llm_cache(DualCache())

# 3. \u6D4B\u8BD5\u53CC\u91CD\u7F13\u5B58
llm = ChatOpenAI(model=&quot;gpt-3.5-turbo&quot;, api_key=&quot;\u4F60\u7684API Key&quot;)
# \u7B2C\u4E00\u6B21\u8C03\u7528\uFF1A\u5185\u5B58\u548C\u78C1\u76D8\u90FD\u65E0\u7F13\u5B58\uFF0C\u8C03\u7528LLM\u5E76\u53CC\u7F13\u5B58
response1 = llm.invoke(&quot;\u6D4B\u8BD5\u53CC\u91CD\u7F13\u5B58&quot;)
print(&quot;\u7B2C\u4E00\u6B21\u8C03\u7528\uFF1A&quot;, response1.content[:30])

# \u6A21\u62DF\u5E94\u7528\u91CD\u542F\uFF08\u6E05\u7A7A\u5185\u5B58\u7F13\u5B58\uFF0C\u4FDD\u7559\u78C1\u76D8\u7F13\u5B58\uFF09
set_llm_cache(DualCache())
# \u7B2C\u4E8C\u6B21\u8C03\u7528\uFF1A\u5185\u5B58\u65E0\u7F13\u5B58\uFF0C\u4ECE\u78C1\u76D8\u7F13\u5B58\u83B7\u53D6\uFF0C\u540C\u6B65\u5230\u5185\u5B58
response2 = llm.invoke(&quot;\u6D4B\u8BD5\u53CC\u91CD\u7F13\u5B58&quot;)
print(&quot;\u91CD\u542F\u540E\u8C03\u7528\uFF1A&quot;, response2.content[:30])
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u4EE3\u7801\u8BF4\u660E\uFF1A\u53CC\u91CD\u7F13\u5B58\u7ED3\u5408\u4E86\u5185\u5B58\u7F13\u5B58\u7684\u901F\u5EA6\u548C\u78C1\u76D8\u7F13\u5B58\u7684\u6301\u4E45\u5316\u4F18\u52BF\uFF0C\u662F\u751F\u4EA7\u73AF\u5883\u7684\u6700\u4F73\u9009\u62E9\u2014\u2014\u70ED\u70B9\u8BF7\u6C42\u4ECE\u5185\u5B58\u83B7\u53D6\uFF0C\u54CD\u5E94\u6781\u5FEB\uFF1B\u5E94\u7528\u91CD\u542F\u540E\uFF0C\u4ECE\u78C1\u76D8\u7F13\u5B58\u540C\u6B65\u5230\u5185\u5B58\uFF0C\u907F\u514D\u7F13\u5B58\u5931\u6548[superscript:8]\u3002</p><h2 id="_17-8-\u3010\u5B9E\u6218\u3011\u4E3A\u9AD8\u9891\u67E5\u8BE2\u63A5\u53E3\u6DFB\u52A0\u7F13\u5B58\u5C42" tabindex="-1"><a class="header-anchor" href="#_17-8-\u3010\u5B9E\u6218\u3011\u4E3A\u9AD8\u9891\u67E5\u8BE2\u63A5\u53E3\u6DFB\u52A0\u7F13\u5B58\u5C42" aria-hidden="true">#</a> 17.8 \u3010\u5B9E\u6218\u3011\u4E3A\u9AD8\u9891\u67E5\u8BE2\u63A5\u53E3\u6DFB\u52A0\u7F13\u5B58\u5C42</h2><p>\u7ED3\u5408\u672C\u7AE0\u6240\u5B66\u77E5\u8BC6\u70B9\uFF0C\u5B9E\u6218\u6784\u5EFA\u4E00\u4E2A\u201C\u9AD8\u9891\u67E5\u8BE2\u63A5\u53E3\u201D\uFF0C\u6574\u5408\u53CC\u91CD\u7F13\u5B58\uFF08\u5185\u5B58+\u78C1\u76D8\uFF09\u3001TTL\u5931\u6548\u7B56\u7565\u3001\u5F02\u6B65\u6279\u5904\u7406\u3001\u5411\u91CF\u68C0\u7D22\u7F13\u5B58\uFF0C\u5B9E\u73B0\u9AD8\u54CD\u5E94\u901F\u5EA6\u3001\u9AD8\u541E\u5410\u91CF\u3001\u4F4E\u6210\u672C\u7684\u751F\u4EA7\u7EA7\u63A5\u53E3\uFF0C\u57FA\u4E8EFastAPI\u63D0\u4F9BAPI\u670D\u52A1\uFF0C\u53EF\u76F4\u63A5\u90E8\u7F72\u4F7F\u7528\u3002</p><h3 id="_17-8-1-\u5B9E\u6218\u9700\u6C42\u4E0E\u6280\u672F\u6808" tabindex="-1"><a class="header-anchor" href="#_17-8-1-\u5B9E\u6218\u9700\u6C42\u4E0E\u6280\u672F\u6808" aria-hidden="true">#</a> 17.8.1 \u5B9E\u6218\u9700\u6C42\u4E0E\u6280\u672F\u6808</h3><h4 id="\u6838\u5FC3\u9700\u6C42" tabindex="-1"><a class="header-anchor" href="#\u6838\u5FC3\u9700\u6C42" aria-hidden="true">#</a> \u6838\u5FC3\u9700\u6C42</h4><ul><li>\u63A5\u53E3\u529F\u80FD\uFF1A\u63A5\u6536\u7528\u6237\u67E5\u8BE2\uFF0C\u8FD4\u56DE\u57FA\u4E8E\u4EA7\u54C1\u6587\u6863\u7684\u95EE\u7B54\u7ED3\u679C\uFF08RAG\u573A\u666F\uFF09\u3002</li></ul><p>\u63A5\u53E3\u529F\u80FD\uFF1A\u63A5\u6536\u7528\u6237\u67E5\u8BE2\uFF0C\u8FD4\u56DE\u57FA\u4E8E\u4EA7\u54C1\u6587\u6863\u7684\u95EE\u7B54\u7ED3\u679C\uFF08RAG\u573A\u666F\uFF09\u3002</p><ul><li>\u6027\u80FD\u8981\u6C42\uFF1A\u9AD8\u9891\u67E5\u8BE2\u54CD\u5E94\u65F6\u95F4\u226450ms\uFF0C\u652F\u6301\u6279\u91CF\u67E5\u8BE2\uFF0C\u541E\u5410\u91CF\u2265100QPS\u3002</li></ul><p>\u6027\u80FD\u8981\u6C42\uFF1A\u9AD8\u9891\u67E5\u8BE2\u54CD\u5E94\u65F6\u95F4\u226450ms\uFF0C\u652F\u6301\u6279\u91CF\u67E5\u8BE2\uFF0C\u541E\u5410\u91CF\u2265100QPS\u3002</p><ul><li>\u7F13\u5B58\u8981\u6C42\uFF1A\u652F\u6301\u53CC\u91CD\u7F13\u5B58\uFF08\u5185\u5B58+\u78C1\u76D8\uFF09\uFF0CTTL=1\u5C0F\u65F6\uFF0C\u4EA7\u54C1\u6587\u6863\u66F4\u65B0\u65F6\u4E3B\u52A8\u5931\u6548\u3002</li></ul><p>\u7F13\u5B58\u8981\u6C42\uFF1A\u652F\u6301\u53CC\u91CD\u7F13\u5B58\uFF08\u5185\u5B58+\u78C1\u76D8\uFF09\uFF0CTTL=1\u5C0F\u65F6\uFF0C\u4EA7\u54C1\u6587\u6863\u66F4\u65B0\u65F6\u4E3B\u52A8\u5931\u6548\u3002</p><ul><li>\u6210\u672C\u8981\u6C42\uFF1A\u51CF\u5C1180%\u7684LLM\u548C\u5411\u91CFAPI\u8C03\u7528\u6B21\u6570\u3002</li></ul><p>\u6210\u672C\u8981\u6C42\uFF1A\u51CF\u5C1180%\u7684LLM\u548C\u5411\u91CFAPI\u8C03\u7528\u6B21\u6570\u3002</p><h4 id="\u6280\u672F\u6808" tabindex="-1"><a class="header-anchor" href="#\u6280\u672F\u6808" aria-hidden="true">#</a> \u6280\u672F\u6808</h4><ul><li>\u6838\u5FC3\u6846\u67B6\uFF1ALangChain\u3001FastAPI\uFF08\u63D0\u4F9BAPI\u670D\u52A1\uFF09\u3002</li></ul><p>\u6838\u5FC3\u6846\u67B6\uFF1ALangChain\u3001FastAPI\uFF08\u63D0\u4F9BAPI\u670D\u52A1\uFF09\u3002</p><ul><li>\u7F13\u5B58\u65B9\u6848\uFF1A\u53CC\u91CD\u7F13\u5B58\uFF08InMemoryCache+SQLiteCache\uFF09+ TTL\u5931\u6548\u3002</li></ul><p>\u7F13\u5B58\u65B9\u6848\uFF1A\u53CC\u91CD\u7F13\u5B58\uFF08InMemoryCache+SQLiteCache\uFF09+ TTL\u5931\u6548\u3002</p><ul><li>\u5411\u91CF\u68C0\u7D22\uFF1AChroma\uFF08\u8F7B\u91CF\u7EA7\u5411\u91CF\u6570\u636E\u5E93\uFF09+ CacheBackedEmbeddings\uFF08\u5D4C\u5165\u7F13\u5B58\uFF09\u3002</li></ul><p>\u5411\u91CF\u68C0\u7D22\uFF1AChroma\uFF08\u8F7B\u91CF\u7EA7\u5411\u91CF\u6570\u636E\u5E93\uFF09+ CacheBackedEmbeddings\uFF08\u5D4C\u5165\u7F13\u5B58\uFF09\u3002</p><ul><li>LLM\uFF1AChatOpenAI\uFF08gpt-3.5-turbo\uFF09\uFF0C\u652F\u6301\u5F02\u6B65\u6279\u5904\u7406\u3002</li></ul><p>LLM\uFF1AChatOpenAI\uFF08gpt-3.5-turbo\uFF09\uFF0C\u652F\u6301\u5F02\u6B65\u6279\u5904\u7406\u3002</p><ul><li>\u4F9D\u8D56\u5B89\u88C5\uFF1Apip install langchain langchain-openai langchain-community fastapi uvicorn chromadb tiktoken\u3002</li></ul><p>\u4F9D\u8D56\u5B89\u88C5\uFF1Apip install langchain langchain-openai langchain-community fastapi uvicorn chromadb tiktoken\u3002</p><h3 id="_17-8-2-\u5B8C\u6574\u4EE3\u7801\u5B9E\u73B0-\u53EF\u76F4\u63A5\u90E8\u7F72" tabindex="-1"><a class="header-anchor" href="#_17-8-2-\u5B8C\u6574\u4EE3\u7801\u5B9E\u73B0-\u53EF\u76F4\u63A5\u90E8\u7F72" aria-hidden="true">#</a> 17.8.2 \u5B8C\u6574\u4EE3\u7801\u5B9E\u73B0\uFF08\u53EF\u76F4\u63A5\u90E8\u7F72\uFF09</h3><p>\u4EE3\u7801\u5206\u4E3A6\u4E2A\u6A21\u5757\uFF1A\u7F13\u5B58\u521D\u59CB\u5316\u3001\u5411\u91CF\u68C0\u7D22\u521D\u59CB\u5316\u3001LLM\u914D\u7F6E\u3001\u6838\u5FC3\u4E1A\u52A1\u903B\u8F91\u3001API\u63A5\u53E3\u3001\u7F13\u5B58\u5931\u6548\u63A5\u53E3\uFF0C\u6CE8\u91CA\u6E05\u6670\uFF0C\u9002\u914D\u751F\u4EA7\u573A\u666F\u3002</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>import time
import asyncio
from fastapi import FastAPI, HTTPException
from langchain.globals import set_llm_cache
from langchain.cache import InMemoryCache
from langchain_community.cache import SQLiteCache
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.embeddings.cache import CacheBackedEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableSequence

# -------------------------- 1. \u521D\u59CB\u5316\u53CC\u91CD\u7F13\u5B58\uFF08\u5185\u5B58+\u78C1\u76D8+TTL\uFF09 --------------------------
class TTL DualCache(InMemoryCache):
    def __init__(self, disk_cache_path=&quot;.langchain_qa.db&quot;, ttl=3600):
        super().__init__()
        self.disk_cache = SQLiteCache(database_path=disk_cache_path)
        self.ttl = ttl  # \u7F13\u5B58\u5B58\u6D3B\u65F6\u95F41\u5C0F\u65F6\uFF083600\u79D2\uFF09
    
    def get(self, key):
        # \u5148\u67E5\u5185\u5B58\u7F13\u5B58
        value = super().get(key)
        if value is not None:
            # \u68C0\u67E5\u5185\u5B58\u7F13\u5B58\u662F\u5426\u8FC7\u671F
            if time.time() - value[1] &lt; self.ttl:
                return value[0]
            else:
                super().delete(key)  # \u5185\u5B58\u7F13\u5B58\u8FC7\u671F\uFF0C\u5220\u9664
        
        # \u5185\u5B58\u672A\u547D\u4E2D\uFF0C\u67E5\u78C1\u76D8\u7F13\u5B58
        disk_value = self.disk_cache.get(key)
        if disk_value is not None:
            if time.time() - disk_value[1] &lt; self.ttl:
                # \u78C1\u76D8\u7F13\u5B58\u672A\u8FC7\u671F\uFF0C\u540C\u6B65\u5230\u5185\u5B58
                super().set(key, (disk_value[0], time.time()))
                return disk_value[0]
            else:
                self.disk_cache.delete(key)  # \u78C1\u76D8\u7F13\u5B58\u8FC7\u671F\uFF0C\u5220\u9664
        return None
    
    def set(self, key, value):
        # \u540C\u65F6\u5B58\u5165\u5185\u5B58\uFF08\u5E26\u65F6\u95F4\u6233\uFF09\u548C\u78C1\u76D8\uFF08\u5E26\u65F6\u95F4\u6233\uFF09
        super().set(key, (value, time.time()))
        self.disk_cache.set(key, (value, time.time()))
    
    def delete(self, key):
        # \u540C\u65F6\u5220\u9664\u5185\u5B58\u548C\u78C1\u76D8\u7F13\u5B58
        super().delete(key)
        self.disk_cache.delete(key)

# \u542F\u7528\u53CC\u91CD\u7F13\u5B58
set_llm_cache(TTL DualCache())

# -------------------------- 2. \u521D\u59CB\u5316\u5411\u91CF\u68C0\u7D22\uFF08\u5E26\u5D4C\u5165\u7F13\u5B58\uFF09 --------------------------
# \u51C6\u5907\u4EA7\u54C1\u6587\u6863\uFF08\u5B9E\u9645\u573A\u666F\u4ECE\u6570\u636E\u5E93/\u6587\u4EF6\u52A0\u8F7D\uFF09
product_docs = [
    &quot;\u4EA7\u54C1X\uFF1A\u667A\u80FD\u624B\u8868\uFF0C\u652F\u6301\u5FC3\u7387\u76D1\u6D4B\u3001\u7761\u7720\u5206\u6790\u3001\u84DD\u7259\u901A\u8BDD\uFF0C\u7EED\u822A7\u5929&quot;,
    &quot;\u4EA7\u54C1Y\uFF1A\u65E0\u7EBF\u8033\u673A\uFF0C\u964D\u566A\u529F\u80FD\uFF0C\u7EED\u822A30\u5C0F\u65F6\uFF0C\u652F\u6301\u5FEB\u5145&quot;,
    &quot;\u4EA7\u54C1Z\uFF1A\u5E73\u677F\u7535\u8111\uFF0C10\u82F1\u5BF8\u5C4F\u5E55\uFF0C8GB\u5185\u5B58\uFF0C256GB\u5B58\u50A8\uFF0C\u652F\u6301\u624B\u5199\u7B14&quot;
]

# \u6587\u672C\u5206\u5757
text_splitter = RecursiveCharacterTextSplitter(chunk_size=100, chunk_overlap=10)
chunks = text_splitter.split_text(&quot;\\n&quot;.join(product_docs))

# \u521D\u59CB\u5316\u5D4C\u5165\u6A21\u578B\uFF08\u5E26\u7F13\u5B58\uFF09
original_embeddings = OpenAIEmbeddings(model=&quot;text-embedding-ada-002&quot;, api_key=&quot;\u4F60\u7684API Key&quot;)
cached_embeddings = CacheBackedEmbeddings.from_bytes_store(
    original_embeddings,
    TTL DualCache()  # \u590D\u7528\u53CC\u91CD\u7F13\u5B58
)

# \u521B\u5EFA\u5411\u91CF\u5E93\uFF08Chroma\uFF09
vector_db = Chroma.from_texts(chunks, cached_embeddings, persist_directory=&quot;./chroma_db&quot;)
vector_db.persist()

# -------------------------- 3. \u521D\u59CB\u5316LLM\uFF08\u652F\u6301\u5F02\u6B65\u548C\u6279\u5904\u7406\uFF09 --------------------------
llm = ChatOpenAI(model=&quot;gpt-3.5-turbo&quot;, api_key=&quot;\u4F60\u7684API Key&quot;, temperature=0.7)

# \u6784\u5EFARAG\u94FE\uFF08\u68C0\u7D22\u2192\u751F\u6210\uFF09
prompt = ChatPromptTemplate.from_template(
    &quot;\u57FA\u4E8E\u4EE5\u4E0B\u76F8\u5173\u6587\u6863\uFF0C\u7B80\u6D01\u56DE\u7B54\u7528\u6237\u95EE\u9898\uFF0C\u4E0D\u6DFB\u52A0\u65E0\u5173\u5185\u5BB9\uFF1A\\n{context}\\n\u7528\u6237\u95EE\u9898\uFF1A{query}&quot;
)
retriever = vector_db.as_retriever(k=2)  # \u68C0\u7D22\u524D2\u6761\u76F8\u5173\u6587\u6863
rag_chain = RunnableSequence.from([
    lambda x: {&quot;context&quot;: &quot;\\n&quot;.join([doc.page_content for doc in retriever.get_relevant_documents(x)]), &quot;query&quot;: x},
    prompt,
    llm
])

# -------------------------- 4. \u6838\u5FC3\u4E1A\u52A1\u903B\u8F91\uFF08\u5F02\u6B65+\u6279\u5904\u7406+\u7F13\u5B58\uFF09 --------------------------
# \u5355\u4E2A\u67E5\u8BE2\u5904\u7406\uFF08\u5E26\u7F13\u5B58\uFF09
async def process_single_query(query):
    try:
        # \u5F02\u6B65\u8C03\u7528RAG\u94FE\uFF0C\u81EA\u52A8\u5229\u7528\u7F13\u5B58
        response = await rag_chain.ainvoke(query)
        return {&quot;query&quot;: query, &quot;answer&quot;: response.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f&quot;\u67E5\u8BE2\u5931\u8D25\uFF1A{str(e)}&quot;)

# \u6279\u91CF\u67E5\u8BE2\u5904\u7406\uFF08\u5F02\u6B65\u6279\u5904\u7406+\u7F13\u5B58\uFF09
async def process_batch_queries(queries):
    tasks = [process_single_query(query) for query in queries]
    return await asyncio.gather(*tasks)

# \u7F13\u5B58\u5931\u6548\u5904\u7406\uFF08\u4EA7\u54C1\u6587\u6863\u66F4\u65B0\u65F6\u8C03\u7528\uFF09
def invalidate_cache(query=None):
    cache = get_llm_cache()
    if query:
        # \u5220\u9664\u6307\u5B9A\u67E5\u8BE2\u7684\u7F13\u5B58
        cache_key = cache._key(query, llm)
        cache.delete(cache_key)
    else:
        # \u6E05\u7A7A\u6240\u6709\u7F13\u5B58\uFF08\u6587\u6863\u5927\u89C4\u6A21\u66F4\u65B0\u65F6\uFF09
        cache.cache.clear()
        cache.disk_cache.cache.clear()

# -------------------------- 5. FastAPI API\u63A5\u53E3 --------------------------
app = FastAPI(title=&quot;LangChain\u9AD8\u9891\u67E5\u8BE2\u63A5\u53E3\uFF08\u5E26\u7F13\u5B58\uFF09&quot;)

# \u5355\u4E2A\u67E5\u8BE2\u63A5\u53E3
@app.get(&quot;/query&quot;)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,165);function p(b,h){const n=l("ExternalLinkIcon");return a(),d("div",null,[e("blockquote",null,[e("p",null,[t,e("a",v,[m,r(n)])])]),o])}var g=s(u,[["render",p],["__file","ai-langchain-cache.html.vue"]]);export{g as default};
