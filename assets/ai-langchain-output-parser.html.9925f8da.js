import{_ as r}from"./plugin-vue_export-helper.21dcd24c.js";import{r as a,o as l,c as d,a as i,d as t,b as n,e as s}from"./app.d848612b.js";const u={},o=n("\u539F\u6587\u94FE\u63A5\uFF1A"),v={href:"https://juejin.cn/column/7616994432275267627",target:"_blank",rel:"noopener noreferrer"},c=n("\u6398\u91D1"),m=s(`<h2 id="_5-1-\u4E3A\u4EC0\u4E48\u9700\u8981-outputparser" tabindex="-1"><a class="header-anchor" href="#_5-1-\u4E3A\u4EC0\u4E48\u9700\u8981-outputparser" aria-hidden="true">#</a> 5.1 \u4E3A\u4EC0\u4E48\u9700\u8981 OutputParser\uFF1F</h2><p>\u5728\u4F7F\u7528\u5927\u6A21\u578B\u65F6\uFF0C\u9ED8\u8BA4\u60C5\u51B5\u4E0B\uFF0C\u6A21\u578B\u8FD4\u56DE\u7684\u662F\u81EA\u7531\u6587\u672C\uFF08\u5B57\u7B26\u4E32\uFF09\uFF0C\u8FD9\u79CD\u8F93\u51FA\u65B9\u5F0F\u5728\u5B9E\u9645\u5F00\u53D1\u4E2D\u4F1A\u9047\u52303\u4E2A\u6838\u5FC3\u75DB\u70B9\uFF0C\u800COutputParser\u6070\u597D\u80FD\u5B8C\u7F8E\u89E3\u51B3\u8FD9\u4E9B\u95EE\u9898\u3002</p><h3 id="_5-1-1-\u6838\u5FC3\u75DB\u70B9-\u81EA\u7531\u6587\u672C\u8F93\u51FA\u7684\u5F0A\u7AEF" tabindex="-1"><a class="header-anchor" href="#_5-1-1-\u6838\u5FC3\u75DB\u70B9-\u81EA\u7531\u6587\u672C\u8F93\u51FA\u7684\u5F0A\u7AEF" aria-hidden="true">#</a> 5.1.1 \u6838\u5FC3\u75DB\u70B9\uFF1A\u81EA\u7531\u6587\u672C\u8F93\u51FA\u7684\u5F0A\u7AEF</h3><ul><li>\u683C\u5F0F\u6DF7\u4E71\uFF0C\u96BE\u4EE5\u5904\u7406\uFF1A\u6A21\u578B\u8FD4\u56DE\u7684\u6587\u672C\u6CA1\u6709\u56FA\u5B9A\u683C\u5F0F\uFF0C\u6BD4\u5982\u63D0\u53D6\u8BA2\u5355\u4FE1\u606F\u65F6\uFF0C\u6709\u65F6\u8FD4\u56DE\u201C\u8BA2\u5355\u53F7\uFF1A123\uFF0C\u91D1\u989D\uFF1A99\u5143\u201D\uFF0C\u6709\u65F6\u8FD4\u56DE\u201C123\u53F7\u8BA2\u5355\uFF0C\u82B1\u8D3999\u5143\u201D\uFF0C\u540E\u7EED\u9700\u8981\u624B\u52A8\u7528\u5B57\u7B26\u4E32\u622A\u53D6\u3001\u6B63\u5219\u5339\u914D\u5904\u7406\uFF0C\u4EE3\u7801\u7E41\u7410\u4E14\u6613\u51FA\u9519\uFF1B</li></ul><p>\u683C\u5F0F\u6DF7\u4E71\uFF0C\u96BE\u4EE5\u5904\u7406\uFF1A\u6A21\u578B\u8FD4\u56DE\u7684\u6587\u672C\u6CA1\u6709\u56FA\u5B9A\u683C\u5F0F\uFF0C\u6BD4\u5982\u63D0\u53D6\u8BA2\u5355\u4FE1\u606F\u65F6\uFF0C\u6709\u65F6\u8FD4\u56DE\u201C\u8BA2\u5355\u53F7\uFF1A123\uFF0C\u91D1\u989D\uFF1A99\u5143\u201D\uFF0C\u6709\u65F6\u8FD4\u56DE\u201C123\u53F7\u8BA2\u5355\uFF0C\u82B1\u8D3999\u5143\u201D\uFF0C\u540E\u7EED\u9700\u8981\u624B\u52A8\u7528\u5B57\u7B26\u4E32\u622A\u53D6\u3001\u6B63\u5219\u5339\u914D\u5904\u7406\uFF0C\u4EE3\u7801\u7E41\u7410\u4E14\u6613\u51FA\u9519\uFF1B</p><ul><li>\u65E0\u6CD5\u76F4\u63A5\u5BF9\u63A5\u4E0B\u6E38\u7CFB\u7EDF\uFF1A\u6570\u636E\u5E93\u3001\u524D\u7AEF\u63A5\u53E3\u3001\u4E1A\u52A1\u903B\u8F91\u901A\u5E38\u9700\u8981\u7ED3\u6784\u5316\u6570\u636E\uFF08\u5982JSON\u3001\u5217\u8868\u3001\u5B9E\u4F53\u5BF9\u8C61\uFF09\uFF0C\u81EA\u7531\u6587\u672C\u65E0\u6CD5\u76F4\u63A5\u4F20\u5165\uFF0C\u9700\u989D\u5916\u8F6C\u6362\uFF1B</li></ul><p>\u65E0\u6CD5\u76F4\u63A5\u5BF9\u63A5\u4E0B\u6E38\u7CFB\u7EDF\uFF1A\u6570\u636E\u5E93\u3001\u524D\u7AEF\u63A5\u53E3\u3001\u4E1A\u52A1\u903B\u8F91\u901A\u5E38\u9700\u8981\u7ED3\u6784\u5316\u6570\u636E\uFF08\u5982JSON\u3001\u5217\u8868\u3001\u5B9E\u4F53\u5BF9\u8C61\uFF09\uFF0C\u81EA\u7531\u6587\u672C\u65E0\u6CD5\u76F4\u63A5\u4F20\u5165\uFF0C\u9700\u989D\u5916\u8F6C\u6362\uFF1B</p><ul><li>\u65E0\u6570\u636E\u6821\u9A8C\uFF0C\u5B58\u5728\u98CE\u9669\uFF1A\u6A21\u578B\u53EF\u80FD\u8FD4\u56DE\u4E0D\u7B26\u5408\u8981\u6C42\u7684\u6570\u636E\uFF08\u5982\u8BA2\u5355\u53F7\u683C\u5F0F\u9519\u8BEF\u3001\u91D1\u989D\u4E3A\u8D1F\u6570\uFF09\uFF0C\u81EA\u7531\u6587\u672C\u65E0\u6CD5\u81EA\u52A8\u6821\u9A8C\uFF0C\u5BB9\u6613\u5BFC\u81F4\u4E0B\u6E38\u4E1A\u52A1\u5F02\u5E38\u3002</li></ul><p>\u65E0\u6570\u636E\u6821\u9A8C\uFF0C\u5B58\u5728\u98CE\u9669\uFF1A\u6A21\u578B\u53EF\u80FD\u8FD4\u56DE\u4E0D\u7B26\u5408\u8981\u6C42\u7684\u6570\u636E\uFF08\u5982\u8BA2\u5355\u53F7\u683C\u5F0F\u9519\u8BEF\u3001\u91D1\u989D\u4E3A\u8D1F\u6570\uFF09\uFF0C\u81EA\u7531\u6587\u672C\u65E0\u6CD5\u81EA\u52A8\u6821\u9A8C\uFF0C\u5BB9\u6613\u5BFC\u81F4\u4E0B\u6E38\u4E1A\u52A1\u5F02\u5E38\u3002</p><h3 id="_5-1-2-outputparser-\u7684\u6838\u5FC3\u4EF7\u503C" tabindex="-1"><a class="header-anchor" href="#_5-1-2-outputparser-\u7684\u6838\u5FC3\u4EF7\u503C" aria-hidden="true">#</a> 5.1.2 OutputParser \u7684\u6838\u5FC3\u4EF7\u503C</h3><p>OutputParser\u7684\u6838\u5FC3\u4F5C\u7528\u662F\uFF1A\u5C06\u6A21\u578B\u8FD4\u56DE\u7684\u81EA\u7531\u6587\u672C\uFF0C\u6309\u7167\u9884\u8BBE\u89C4\u5219\uFF0C\u89E3\u6790\u4E3A\u7ED3\u6784\u5316\u6570\u636E\uFF0C\u5E76\u8FDB\u884C\u683C\u5F0F\u6821\u9A8C\uFF0C\u5177\u4F53\u4EF7\u503C\u4F53\u73B0\u57283\u70B9\uFF1A</p><ul><li>\u6807\u51C6\u5316\u8F93\u51FA\uFF1A\u5F3A\u5236\u6A21\u578B\u8FD4\u56DE\u56FA\u5B9A\u683C\u5F0F\uFF08\u5982JSON\u3001\u5217\u8868\uFF09\uFF0C\u907F\u514D\u683C\u5F0F\u6DF7\u4E71\uFF0C\u540E\u7EED\u5904\u7406\u65E0\u9700\u624B\u52A8\u9002\u914D\uFF1B</li></ul><p>\u6807\u51C6\u5316\u8F93\u51FA\uFF1A\u5F3A\u5236\u6A21\u578B\u8FD4\u56DE\u56FA\u5B9A\u683C\u5F0F\uFF08\u5982JSON\u3001\u5217\u8868\uFF09\uFF0C\u907F\u514D\u683C\u5F0F\u6DF7\u4E71\uFF0C\u540E\u7EED\u5904\u7406\u65E0\u9700\u624B\u52A8\u9002\u914D\uFF1B</p><ul><li>\u964D\u4F4E\u5F00\u53D1\u6210\u672C\uFF1A\u65E0\u9700\u7F16\u5199\u590D\u6742\u7684\u5B57\u7B26\u4E32\u5904\u7406\u3001\u6B63\u5219\u5339\u914D\u4EE3\u7801\uFF0C\u89E3\u6790\u5668\u81EA\u52A8\u5B8C\u6210\u683C\u5F0F\u8F6C\u6362\uFF1B</li></ul><p>\u964D\u4F4E\u5F00\u53D1\u6210\u672C\uFF1A\u65E0\u9700\u7F16\u5199\u590D\u6742\u7684\u5B57\u7B26\u4E32\u5904\u7406\u3001\u6B63\u5219\u5339\u914D\u4EE3\u7801\uFF0C\u89E3\u6790\u5668\u81EA\u52A8\u5B8C\u6210\u683C\u5F0F\u8F6C\u6362\uFF1B</p><ul><li>\u6570\u636E\u6821\u9A8C\uFF1A\u90E8\u5206\u89E3\u6790\u5668\uFF08\u5982PydanticOutputParser\uFF09\u652F\u6301\u5F3A\u7C7B\u578B\u6821\u9A8C\uFF0C\u786E\u4FDD\u89E3\u6790\u540E\u7684\u6570\u636E\u7B26\u5408\u4E1A\u52A1\u8981\u6C42\uFF0C\u907F\u514D\u5F02\u5E38\u6570\u636E\u6D41\u5165\u4E0B\u6E38\u3002</li></ul><p>\u6570\u636E\u6821\u9A8C\uFF1A\u90E8\u5206\u89E3\u6790\u5668\uFF08\u5982PydanticOutputParser\uFF09\u652F\u6301\u5F3A\u7C7B\u578B\u6821\u9A8C\uFF0C\u786E\u4FDD\u89E3\u6790\u540E\u7684\u6570\u636E\u7B26\u5408\u4E1A\u52A1\u8981\u6C42\uFF0C\u907F\u514D\u5F02\u5E38\u6570\u636E\u6D41\u5165\u4E0B\u6E38\u3002</p><h3 id="_5-1-3-\u76F4\u89C2\u5BF9\u6BD4-\u65E0\u89E3\u6790\u5668-vs-\u6709\u89E3\u6790\u5668" tabindex="-1"><a class="header-anchor" href="#_5-1-3-\u76F4\u89C2\u5BF9\u6BD4-\u65E0\u89E3\u6790\u5668-vs-\u6709\u89E3\u6790\u5668" aria-hidden="true">#</a> 5.1.3 \u76F4\u89C2\u5BF9\u6BD4\uFF1A\u65E0\u89E3\u6790\u5668 vs \u6709\u89E3\u6790\u5668</h3><h3 id="_5-1-4-outputparser-\u6838\u5FC3\u5DE5\u4F5C\u6D41\u7A0B" tabindex="-1"><a class="header-anchor" href="#_5-1-4-outputparser-\u6838\u5FC3\u5DE5\u4F5C\u6D41\u7A0B" aria-hidden="true">#</a> 5.1.4 OutputParser \u6838\u5FC3\u5DE5\u4F5C\u6D41\u7A0B</h3><p>LangChain\u4E2D\u6240\u6709OutputParser\u7684\u5DE5\u4F5C\u6D41\u7A0B\u90FD\u4E00\u81F4\uFF0C\u5206\u4E3A3\u6B65\uFF0C\u7B80\u5355\u6613\u61C2\uFF1A</p><ul><li>\u5B9A\u4E49\u89E3\u6790\u89C4\u5219\uFF1A\u6307\u5B9A\u9700\u8981\u89E3\u6790\u7684\u683C\u5F0F\uFF08\u5982\u5217\u8868\u3001JSON\u3001\u5B9E\u4F53\u5BF9\u8C61\uFF09\uFF1B</li></ul><p>\u5B9A\u4E49\u89E3\u6790\u89C4\u5219\uFF1A\u6307\u5B9A\u9700\u8981\u89E3\u6790\u7684\u683C\u5F0F\uFF08\u5982\u5217\u8868\u3001JSON\u3001\u5B9E\u4F53\u5BF9\u8C61\uFF09\uFF1B</p><ul><li>\u63D0\u793A\u6A21\u578B\u9002\u914D\u683C\u5F0F\uFF1A\u5728Prompt\u4E2D\u52A0\u5165\u89E3\u6790\u5668\u7684\u201C\u683C\u5F0F\u63D0\u793A\u201D\uFF0C\u8BA9\u6A21\u578B\u6309\u6307\u5B9A\u683C\u5F0F\u8F93\u51FA\uFF1B</li></ul><p>\u63D0\u793A\u6A21\u578B\u9002\u914D\u683C\u5F0F\uFF1A\u5728Prompt\u4E2D\u52A0\u5165\u89E3\u6790\u5668\u7684\u201C\u683C\u5F0F\u63D0\u793A\u201D\uFF0C\u8BA9\u6A21\u578B\u6309\u6307\u5B9A\u683C\u5F0F\u8F93\u51FA\uFF1B</p><ul><li>\u89E3\u6790\u4E0E\u6821\u9A8C\uFF1A\u6A21\u578B\u8FD4\u56DE\u6587\u672C\u540E\uFF0C\u89E3\u6790\u5668\u81EA\u52A8\u89E3\u6790\u4E3A\u7ED3\u6784\u5316\u6570\u636E\uFF0C\u5E76\u8FDB\u884C\u683C\u5F0F\u6821\u9A8C\uFF0C\u5931\u8D25\u5219\u629B\u51FA\u5F02\u5E38\u6216\u81EA\u52A8\u4FEE\u590D\u3002</li></ul><p>\u89E3\u6790\u4E0E\u6821\u9A8C\uFF1A\u6A21\u578B\u8FD4\u56DE\u6587\u672C\u540E\uFF0C\u89E3\u6790\u5668\u81EA\u52A8\u89E3\u6790\u4E3A\u7ED3\u6784\u5316\u6570\u636E\uFF0C\u5E76\u8FDB\u884C\u683C\u5F0F\u6821\u9A8C\uFF0C\u5931\u8D25\u5219\u629B\u51FA\u5F02\u5E38\u6216\u81EA\u52A8\u4FEE\u590D\u3002</p><p>\u63D0\u793A\uFF1A\u6240\u6709OutputParser\u90FD\u63D0\u4F9Bget_format_instructions()\u65B9\u6CD5\uFF0C\u53EF\u81EA\u52A8\u751F\u6210\u201C\u683C\u5F0F\u63D0\u793A\u201D\uFF0C\u65E0\u9700\u624B\u52A8\u7F16\u5199\uFF0C\u6781\u5927\u964D\u4F4E\u4F7F\u7528\u6210\u672C\u3002</p><h2 id="_5-2-listoutputparser-\u4E0E-commaseparatedlistoutputparser" tabindex="-1"><a class="header-anchor" href="#_5-2-listoutputparser-\u4E0E-commaseparatedlistoutputparser" aria-hidden="true">#</a> 5.2 ListOutputParser \u4E0E CommaSeparatedListOutputParser</h2><p>\u6700\u57FA\u7840\u7684\u7ED3\u6784\u5316\u8F93\u51FA\u662F\u201C\u5217\u8868\u201D\u2014\u2014\u6BD4\u5982\u63D0\u53D6\u5173\u952E\u8BCD\u3001\u63A8\u8350\u5217\u8868\u3001\u9009\u9879\u5217\u8868\u7B49\u3002LangChain\u63D0\u4F9B\u4E24\u79CD\u4E13\u95E8\u7528\u4E8E\u89E3\u6790\u5217\u8868\u7684\u89E3\u6790\u5668\uFF0C\u7528\u6CD5\u7B80\u5355\uFF0C\u8986\u76D6\u4E0D\u540C\u573A\u666F\uFF1A</p><ul><li>ListOutputParser\uFF1A\u89E3\u6790\u6362\u884C\u5206\u9694\u7684\u5217\u8868\uFF08\u5982\u6BCF\u884C\u4E00\u4E2A\u5143\u7D20\uFF09\uFF0C\u9002\u914D\u591A\u5143\u7D20\u3001\u957F\u6587\u672C\u5217\u8868\uFF1B</li></ul><p>ListOutputParser\uFF1A\u89E3\u6790\u6362\u884C\u5206\u9694\u7684\u5217\u8868\uFF08\u5982\u6BCF\u884C\u4E00\u4E2A\u5143\u7D20\uFF09\uFF0C\u9002\u914D\u591A\u5143\u7D20\u3001\u957F\u6587\u672C\u5217\u8868\uFF1B</p><ul><li>CommaSeparatedListOutputParser\uFF1A\u89E3\u6790\u9017\u53F7\u5206\u9694\u7684\u5217\u8868\uFF08\u5982\u201Ca,b,c\u201D\uFF09\uFF0C\u9002\u914D\u77ED\u6587\u672C\u3001\u7B80\u5355\u5217\u8868\u3002</li></ul><p>CommaSeparatedListOutputParser\uFF1A\u89E3\u6790\u9017\u53F7\u5206\u9694\u7684\u5217\u8868\uFF08\u5982\u201Ca,b,c\u201D\uFF09\uFF0C\u9002\u914D\u77ED\u6587\u672C\u3001\u7B80\u5355\u5217\u8868\u3002</p><h3 id="_5-2-1-listoutputparser-\u6362\u884C\u5206\u9694\u5217\u8868" tabindex="-1"><a class="header-anchor" href="#_5-2-1-listoutputparser-\u6362\u884C\u5206\u9694\u5217\u8868" aria-hidden="true">#</a> 5.2.1 ListOutputParser\uFF08\u6362\u884C\u5206\u9694\u5217\u8868\uFF09</h3><p>\u6838\u5FC3\u573A\u666F\uFF1A\u63D0\u53D6\u591A\u5143\u7D20\u5217\u8868\uFF08\u5982\u63A8\u8350\u4E66\u5355\u3001\u5173\u952E\u8BCD\u5217\u8868\uFF09\uFF0C\u6A21\u578B\u8F93\u51FA\u6BCF\u884C\u4E00\u4E2A\u5143\u7D20\uFF0C\u89E3\u6790\u5668\u81EA\u52A8\u8F6C\u6362\u4E3APython\u5217\u8868\u3002</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import ListOutputParser
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os

load_dotenv()

# 1. \u521D\u59CB\u5316\u5217\u8868\u89E3\u6790\u5668\uFF08\u6362\u884C\u5206\u9694\uFF09
list_parser = ListOutputParser()

# 2. \u83B7\u53D6\u683C\u5F0F\u63D0\u793A\uFF08\u8BA9\u6A21\u578B\u6309\u6362\u884C\u683C\u5F0F\u8F93\u51FA\uFF09
format_instructions = list_parser.get_format_instructions()

# 3. \u5B9A\u4E49\u63D0\u793A\u6A21\u677F\uFF08\u52A0\u5165\u683C\u5F0F\u63D0\u793A\uFF09
prompt = PromptTemplate(
    template=&quot;\u63A8\u83505\u4E2ALangChain\u76F8\u5173\u7684\u5B66\u4E60\u8D44\u6E90\uFF0C\u6309\u4EE5\u4E0B\u683C\u5F0F\u8F93\u51FA\uFF1A\\n{format_instructions}&quot;,
    input_variables=[],
    partial_variables={&quot;format_instructions&quot;: format_instructions}
)

# 4. \u8C03\u7528\u6A21\u578B+\u89E3\u6790\u8F93\u51FA
chat_model = ChatOpenAI(
    model_name=&quot;gpt-3.5-turbo&quot;,
    api_key=os.getenv(&quot;OPENAI_API_KEY&quot;),
    temperature=0.7
)

# \u94FE\u5F0F\u8C03\u7528\uFF1A\u63D0\u793A\u2192\u6A21\u578B\u2192\u89E3\u6790\uFF08\u540E\u7EED\u7AE0\u8282\u8BE6\u89E3Chains\uFF0C\u6B64\u5904\u7B80\u5316\uFF09
chain = prompt | chat_model | list_parser
result = chain.invoke({})

print(&quot;\u89E3\u6790\u540E\u7684\u5217\u8868\uFF1A&quot;, result)
print(&quot;\u5217\u8868\u7C7B\u578B\uFF1A&quot;, type(result))
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,36),p=n("\u4EE3\u7801\u6765\u6E90\uFF1ALangChain ListOutputParser\u5B98\u65B9\u793A\u4F8B\uFF08"),b={href:"http://python.langchain.com/docs/langch%E2%80%A6%EF%BC%89%EF%BC%9B",target:"_blank",rel:"noopener noreferrer"},_=n("python.langchain.com/docs/langch\u2026\uFF09\uFF1B"),h=s(`<p>\u8FD0\u884C\u7ED3\u679C\uFF1A \u89E3\u6790\u540E\u7684\u5217\u8868\uFF1A [&#39;LangChain\u5B98\u65B9\u6587\u6863&#39;, &#39;LangChain\u4E2D\u6587\u6559\u7A0B&#39;, &#39;LangChain\u5B9E\u6218\u9879\u76EE&#39;, &#39;Prompt Engineering\u6307\u5357&#39;, &#39;LangChain\u6E90\u7801\u89E3\u6790&#39;] \u5217\u8868\u7C7B\u578B\uFF1A &lt;class &#39;list&#39;&gt;</p><p>\u8BF4\u660E\uFF1A\u6A21\u578B\u4F1A\u4E25\u683C\u6309\u7167\u683C\u5F0F\u63D0\u793A\uFF0C\u8F93\u51FA\u6BCF\u884C\u4E00\u4E2A\u5143\u7D20\u7684\u5217\u8868\uFF0C\u89E3\u6790\u5668\u81EA\u52A8\u5C06\u5176\u8F6C\u6362\u4E3APython\u5217\u8868\uFF0C\u53EF\u76F4\u63A5\u7528\u4E8E\u5FAA\u73AF\u3001\u5B58\u50A8\u7B49\u64CD\u4F5C\u3002</p><h3 id="_5-2-2-commaseparatedlistoutputparser-\u9017\u53F7\u5206\u9694\u5217\u8868" tabindex="-1"><a class="header-anchor" href="#_5-2-2-commaseparatedlistoutputparser-\u9017\u53F7\u5206\u9694\u5217\u8868" aria-hidden="true">#</a> 5.2.2 CommaSeparatedListOutputParser\uFF08\u9017\u53F7\u5206\u9694\u5217\u8868\uFF09</h3><p>\u6838\u5FC3\u573A\u666F\uFF1A\u63D0\u53D6\u77ED\u6587\u672C\u5217\u8868\uFF08\u5982\u6807\u7B7E\u3001\u7B80\u5355\u9009\u9879\uFF09\uFF0C\u6A21\u578B\u8F93\u51FA\u9017\u53F7\u5206\u9694\u7684\u5B57\u7B26\u4E32\uFF0C\u89E3\u6790\u5668\u81EA\u52A8\u8F6C\u6362\u4E3APython\u5217\u8868\u3002</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import CommaSeparatedListOutputParser
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os

load_dotenv()

# 1. \u521D\u59CB\u5316\u9017\u53F7\u5206\u9694\u5217\u8868\u89E3\u6790\u5668
csv_parser = CommaSeparatedListOutputParser()

# 2. \u683C\u5F0F\u63D0\u793A\uFF08\u8BA9\u6A21\u578B\u6309\u9017\u53F7\u5206\u9694\u8F93\u51FA\uFF09
format_instructions = csv_parser.get_format_instructions()

# 3. \u63D0\u793A\u6A21\u677F
prompt = PromptTemplate(
    template=&quot;\u63D0\u53D6\u4EE5\u4E0B\u6587\u672C\u7684\u5173\u952E\u8BCD\uFF08\u9017\u53F7\u5206\u9694\uFF09\uFF1A{text}\\n{format_instructions}&quot;,
    input_variables=[&quot;text&quot;],
    partial_variables={&quot;format_instructions&quot;: format_instructions}
)

# 4. \u8C03\u7528\u6A21\u578B+\u89E3\u6790
chat_model = ChatOpenAI(api_key=os.getenv(&quot;OPENAI_API_KEY&quot;), temperature=0.5)
chain = prompt | chat_model | csv_parser

# \u6CE8\u5165\u6587\u672C\uFF0C\u83B7\u53D6\u89E3\u6790\u7ED3\u679C
text = &quot;LangChain\u662F\u4E00\u4E2A\u7528\u4E8E\u6784\u5EFA\u5927\u8BED\u8A00\u6A21\u578B\u5E94\u7528\u7684\u6846\u67B6\uFF0C\u652F\u6301\u63D0\u793A\u6A21\u677F\u3001\u8F93\u51FA\u89E3\u6790\u3001\u94FE\u5F0F\u8C03\u7528\u7B49\u529F\u80FD\u3002&quot;
result = chain.invoke({&quot;text&quot;: text})

print(&quot;\u89E3\u6790\u540E\u7684\u5173\u952E\u8BCD\u5217\u8868\uFF1A&quot;, result)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),q=n("\u4EE3\u7801\u6765\u6E90\uFF1ALangChain CommaSeparatedListOutputParser\u5B98\u65B9\u793A\u4F8B\uFF08"),f={href:"http://python.langchain.com/docs/langch%E2%80%A6%EF%BC%89%EF%BC%9B",target:"_blank",rel:"noopener noreferrer"},g=n("python.langchain.com/docs/langch\u2026\uFF09\uFF1B"),P=s(`<p>\u8FD0\u884C\u7ED3\u679C\uFF1A\u89E3\u6790\u540E\u7684\u5173\u952E\u8BCD\u5217\u8868\uFF1A [&#39;LangChain&#39;, &#39;\u5927\u8BED\u8A00\u6A21\u578B\u5E94\u7528&#39;, &#39;\u6846\u67B6&#39;, &#39;\u63D0\u793A\u6A21\u677F&#39;, &#39;\u8F93\u51FA\u89E3\u6790&#39;, &#39;\u94FE\u5F0F\u8C03\u7528&#39;]</p><h3 id="_5-2-3-\u4E24\u79CD\u89E3\u6790\u5668\u5BF9\u6BD4\u4E0E\u9009\u578B\u5EFA\u8BAE" tabindex="-1"><a class="header-anchor" href="#_5-2-3-\u4E24\u79CD\u89E3\u6790\u5668\u5BF9\u6BD4\u4E0E\u9009\u578B\u5EFA\u8BAE" aria-hidden="true">#</a> 5.2.3 \u4E24\u79CD\u89E3\u6790\u5668\u5BF9\u6BD4\u4E0E\u9009\u578B\u5EFA\u8BAE</h3><h2 id="_5-3-jsonoutputparser-\u89E3\u6790\u590D\u6742\u5BF9\u8C61" tabindex="-1"><a class="header-anchor" href="#_5-3-jsonoutputparser-\u89E3\u6790\u590D\u6742\u5BF9\u8C61" aria-hidden="true">#</a> 5.3 JSONOutputParser \u89E3\u6790\u590D\u6742\u5BF9\u8C61</h2><p>\u5217\u8868\u89E3\u6790\u9002\u7528\u4E8E\u7B80\u5355\u573A\u666F\uFF0C\u800C\u5B9E\u9645\u5F00\u53D1\u4E2D\uFF0C\u6211\u4EEC\u66F4\u591A\u9700\u8981\u89E3\u6790\u590D\u6742\u5BF9\u8C61\uFF08\u5982\u8BA2\u5355\u4FE1\u606F\u3001\u7528\u6237\u4FE1\u606F\u3001\u5B9E\u4F53\u6570\u636E\uFF09\uFF0C\u6B64\u65F6\u6700\u5E38\u7528\u7684\u662FJSONOutputParser\u2014\u2014\u5B83\u80FD\u5C06\u6A21\u578B\u8FD4\u56DE\u7684JSON\u5B57\u7B26\u4E32\uFF0C\u81EA\u52A8\u89E3\u6790\u4E3APython\u5B57\u5178\uFF08\u6216JSON\u5BF9\u8C61\uFF09\uFF0C\u652F\u6301\u5D4C\u5957\u7ED3\u6784\uFF0C\u9002\u914D\u5927\u591A\u6570\u590D\u6742\u573A\u666F\u3002</p><p>\u6838\u5FC3\u7279\u70B9\uFF1A\u652F\u6301JSON Schema\uFF08JSON\u6A21\u5F0F\uFF09\uFF0C\u53EF\u63D0\u524D\u5B9A\u4E49JSON\u7684\u5B57\u6BB5\u3001\u7C7B\u578B\u3001\u7EA6\u675F\uFF0C\u8BA9\u6A21\u578B\u4E25\u683C\u6309Schema\u8F93\u51FA\uFF0C\u89E3\u6790\u66F4\u7CBE\u51C6\u3002</p><h3 id="_5-3-1-\u57FA\u7840\u7528\u6CD5-\u89E3\u6790\u7B80\u5355json\u5BF9\u8C61" tabindex="-1"><a class="header-anchor" href="#_5-3-1-\u57FA\u7840\u7528\u6CD5-\u89E3\u6790\u7B80\u5355json\u5BF9\u8C61" aria-hidden="true">#</a> 5.3.1 \u57FA\u7840\u7528\u6CD5\uFF1A\u89E3\u6790\u7B80\u5355JSON\u5BF9\u8C61</h3><p>\u9002\u7528\u4E8E\u89E3\u6790\u65E0\u5D4C\u5957\u7684\u7B80\u5355JSON\u5BF9\u8C61\uFF08\u5982\u7528\u6237\u57FA\u672C\u4FE1\u606F\u3001\u5355\u6761\u8BA2\u5355\u4FE1\u606F\uFF09\uFF0C\u6B65\u9AA4\u7B80\u5355\uFF0C\u65E0\u9700\u590D\u6742\u914D\u7F6E\u3002</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JSONOutputParser
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os

load_dotenv()

# 1. \u521D\u59CB\u5316JSON\u89E3\u6790\u5668
json_parser = JSONOutputParser()

# 2. \u683C\u5F0F\u63D0\u793A\uFF08\u5305\u542BJSON Schema\uFF0C\u8BA9\u6A21\u578B\u6309\u6307\u5B9A\u5B57\u6BB5\u8F93\u51FA\uFF09
format_instructions = json_parser.get_format_instructions()

# 3. \u63D0\u793A\u6A21\u677F\uFF08\u63D0\u53D6\u7528\u6237\u4FE1\u606F\uFF0C\u6309JSON\u683C\u5F0F\u8F93\u51FA\uFF09
prompt = PromptTemplate(
    template=&quot;\u4ECE\u4EE5\u4E0B\u6587\u672C\u4E2D\u63D0\u53D6\u7528\u6237\u4FE1\u606F\uFF0C\u6309JSON\u683C\u5F0F\u8F93\u51FA\uFF1A\\n\u6587\u672C\uFF1A{text}\\n{format_instructions}&quot;,
    input_variables=[&quot;text&quot;],
    partial_variables={&quot;format_instructions&quot;: format_instructions}
)

# 4. \u8C03\u7528\u6A21\u578B+\u89E3\u6790
chat_model = ChatOpenAI(api_key=os.getenv(&quot;OPENAI_API_KEY&quot;), temperature=0.3)
chain = prompt | chat_model | json_parser

# \u6D4B\u8BD5\u6587\u672C
text = &quot;\u7528\u6237\u5F20\u4E09\uFF0C\u5E74\u9F8425\u5C81\uFF0C\u90AE\u7BB1zhangsan@163.com\uFF0C\u624B\u673A\u53F713800138000\uFF0C\u804C\u4E1A\u662FPython\u5F00\u53D1\u5DE5\u7A0B\u5E08\u3002&quot;
result = chain.invoke({&quot;text&quot;: text})

print(&quot;\u89E3\u6790\u540E\u7684JSON\u5BF9\u8C61\uFF1A&quot;, result)
print(&quot;\u8BA2\u5355\u53F7\u5B57\u6BB5\uFF1A&quot;, result.get(&quot;username&quot;))
print(&quot;\u7ED3\u679C\u7C7B\u578B\uFF1A&quot;, type(result))
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8),O=n("\u4EE3\u7801\u6765\u6E90\uFF1ALangChain JSONOutputParser\u5B98\u65B9\u793A\u4F8B\uFF08"),y={href:"http://python.langchain.com/docs/langch%E2%80%A6%EF%BC%89%EF%BC%9B",target:"_blank",rel:"noopener noreferrer"},x=n("python.langchain.com/docs/langch\u2026\uFF09\uFF1B"),L=s(`<p>\u8FD0\u884C\u7ED3\u679C\uFF1A \u89E3\u6790\u540E\u7684JSON\u5BF9\u8C61\uFF1A {&#39;username&#39;: &#39;\u5F20\u4E09&#39;, &#39;age&#39;: 25, &#39;email&#39;: &#39;zhangsan@163.com&#39;, &#39;phone&#39;: &#39;13800138000&#39;, &#39;occupation&#39;: &#39;Python\u5F00\u53D1\u5DE5\u7A0B\u5E08&#39;} \u7528\u6237\u540D\u5B57\u6BB5\uFF1A \u5F20\u4E09 \u7ED3\u679C\u7C7B\u578B\uFF1A &lt;class &#39;dict&#39;&gt;</p><h3 id="_5-3-2-\u8FDB\u9636\u7528\u6CD5-\u6307\u5B9A-json-schema-\u5F3A\u5236\u5B57\u6BB5\u7EA6\u675F" tabindex="-1"><a class="header-anchor" href="#_5-3-2-\u8FDB\u9636\u7528\u6CD5-\u6307\u5B9A-json-schema-\u5F3A\u5236\u5B57\u6BB5\u7EA6\u675F" aria-hidden="true">#</a> 5.3.2 \u8FDB\u9636\u7528\u6CD5\uFF1A\u6307\u5B9A JSON Schema\uFF08\u5F3A\u5236\u5B57\u6BB5\u7EA6\u675F\uFF09</h3><p>\u57FA\u7840\u7528\u6CD5\u4E2D\uFF0C\u6A21\u578B\u53EF\u80FD\u4F1A\u8FD4\u56DE\u591A\u4F59\u5B57\u6BB5\u6216\u7F3A\u5931\u5B57\u6BB5\uFF0C\u901A\u8FC7\u6307\u5B9AJSON Schema\uFF0C\u53EF\u5F3A\u5236\u6A21\u578B\u8FD4\u56DE\u56FA\u5B9A\u5B57\u6BB5\u3001\u6307\u5B9A\u5B57\u6BB5\u7C7B\u578B\uFF0C\u786E\u4FDD\u89E3\u6790\u7ED3\u679C\u7B26\u5408\u4E1A\u52A1\u8981\u6C42\u3002</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JSONOutputParser
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os

load_dotenv()

# 1. \u5B9A\u4E49JSON Schema\uFF08\u5F3A\u5236\u5B57\u6BB5\u3001\u7C7B\u578B\u7EA6\u675F\uFF09
json_schema = {
    &quot;type&quot;: &quot;object&quot;,
    &quot;properties&quot;: {
        &quot;order_id&quot;: {&quot;type&quot;: &quot;string&quot;, &quot;description&quot;: &quot;\u8BA2\u5355\u53F7\uFF0C\u683C\u5F0F\u4E3A6\u4F4D\u6570\u5B57&quot;},
        &quot;amount&quot;: {&quot;type&quot;: &quot;number&quot;, &quot;description&quot;: &quot;\u8BA2\u5355\u91D1\u989D\uFF0C\u4FDD\u75592\u4F4D\u5C0F\u6570&quot;},
        &quot;status&quot;: {&quot;type&quot;: &quot;string&quot;, &quot;enum&quot;: [&quot;\u5F85\u4ED8\u6B3E&quot;, &quot;\u5DF2\u53D1\u8D27&quot;, &quot;\u5DF2\u7B7E\u6536&quot;, &quot;\u5DF2\u53D6\u6D88&quot;], &quot;description&quot;: &quot;\u8BA2\u5355\u72B6\u6001&quot;},
        &quot;create_time&quot;: {&quot;type&quot;: &quot;string&quot;, &quot;description&quot;: &quot;\u8BA2\u5355\u521B\u5EFA\u65F6\u95F4\uFF0C\u683C\u5F0F\u4E3AYYYY-MM-DD HH:MM:SS&quot;}
    },
    &quot;required&quot;: [&quot;order_id&quot;, &quot;amount&quot;, &quot;status&quot;],  # \u5FC5\u9009\u5B57\u6BB5
    &quot;additionalProperties&quot;: False  # \u7981\u6B62\u591A\u4F59\u5B57\u6BB5
}

# 2. \u521D\u59CB\u5316JSON\u89E3\u6790\u5668\uFF08\u4F20\u5165Schema\uFF09
json_parser = JSONOutputParser(schema=json_schema)

# 3. \u683C\u5F0F\u63D0\u793A\uFF08\u5305\u542BSchema\u7EA6\u675F\uFF09
format_instructions = json_parser.get_format_instructions()

# 4. \u63D0\u793A\u6A21\u677F
prompt = PromptTemplate(
    template=&quot;\u4ECE\u4EE5\u4E0B\u6587\u672C\u4E2D\u63D0\u53D6\u8BA2\u5355\u4FE1\u606F\uFF0C\u4E25\u683C\u6309JSON Schema\u8F93\u51FA\uFF1A\\n\u6587\u672C\uFF1A{text}\\n{format_instructions}&quot;,
    input_variables=[&quot;text&quot;],
    partial_variables={&quot;format_instructions&quot;: format_instructions}
)

# 5. \u8C03\u7528\u6A21\u578B+\u89E3\u6790
chat_model = ChatOpenAI(api_key=os.getenv(&quot;OPENAI_API_KEY&quot;), temperature=0.3)
chain = prompt | chat_model | json_parser

# \u6D4B\u8BD5\u6587\u672C
text = &quot;\u7528\u6237\u674E\u56DB\u57282024-05-20 14:30:00\u4E0B\u5355\uFF0C\u8BA2\u5355\u53F7\u662F123456\uFF0C\u91D1\u989D99.90\u5143\uFF0C\u76EE\u524D\u8BA2\u5355\u5DF2\u53D1\u8D27\uFF0C\u8FD8\u672A\u7B7E\u6536\u3002&quot;
result = chain.invoke({&quot;text&quot;: text})

print(&quot;\u89E3\u6790\u540E\u7684\u8BA2\u5355\u4FE1\u606F\uFF1A&quot;, result)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u8FD0\u884C\u7ED3\u679C\uFF1A\u89E3\u6790\u540E\u7684\u8BA2\u5355\u4FE1\u606F\uFF1A {&#39;order_id&#39;: &#39;123456&#39;, &#39;amount&#39;: 99.9, &#39;status&#39;: &#39;\u5DF2\u53D1\u8D27&#39;, &#39;create_time&#39;: &#39;2024-05-20 14:30:00&#39;}</p><p>\u8BF4\u660E\uFF1A\u901A\u8FC7JSON Schema\uFF0C\u6A21\u578B\u4F1A\u4E25\u683C\u8FD4\u56DE\u6307\u5B9A\u5B57\u6BB5\u3001\u7C7B\u578B\uFF0C\u4E0D\u4F1A\u51FA\u73B0\u591A\u4F59\u5B57\u6BB5\u6216\u7F3A\u5931\u5FC5\u9009\u5B57\u6BB5\uFF0C\u89E3\u6790\u7ED3\u679C\u53EF\u76F4\u63A5\u5BF9\u63A5\u6570\u636E\u5E93\u6216\u4E1A\u52A1\u903B\u8F91\u3002</p><h3 id="_5-3-3-\u6CE8\u610F\u4E8B\u9879" tabindex="-1"><a class="header-anchor" href="#_5-3-3-\u6CE8\u610F\u4E8B\u9879" aria-hidden="true">#</a> 5.3.3 \u6CE8\u610F\u4E8B\u9879</h3><ul><li>JSON Schema\u7684\u63CF\u8FF0\u8981\u6E05\u6670\uFF1A\u7ED9\u6BCF\u4E2A\u5B57\u6BB5\u6DFB\u52A0description\uFF0C\u8BA9\u6A21\u578B\u7406\u89E3\u5B57\u6BB5\u542B\u4E49\u548C\u683C\u5F0F\u8981\u6C42\uFF08\u5982\u8BA2\u5355\u53F7\u683C\u5F0F\u3001\u65F6\u95F4\u683C\u5F0F\uFF09\uFF1B</li></ul><p>JSON Schema\u7684\u63CF\u8FF0\u8981\u6E05\u6670\uFF1A\u7ED9\u6BCF\u4E2A\u5B57\u6BB5\u6DFB\u52A0description\uFF0C\u8BA9\u6A21\u578B\u7406\u89E3\u5B57\u6BB5\u542B\u4E49\u548C\u683C\u5F0F\u8981\u6C42\uFF08\u5982\u8BA2\u5355\u53F7\u683C\u5F0F\u3001\u65F6\u95F4\u683C\u5F0F\uFF09\uFF1B</p><ul><li>\u5FC5\u9009\u5B57\u6BB5\u7528required\u6307\u5B9A\uFF1A\u907F\u514D\u6A21\u578B\u9057\u6F0F\u6838\u5FC3\u5B57\u6BB5\uFF1B</li></ul><p>\u5FC5\u9009\u5B57\u6BB5\u7528required\u6307\u5B9A\uFF1A\u907F\u514D\u6A21\u578B\u9057\u6F0F\u6838\u5FC3\u5B57\u6BB5\uFF1B</p><ul><li>\u7981\u6B62\u591A\u4F59\u5B57\u6BB5\uFF1A\u8BBE\u7F6EadditionalProperties=False\uFF0C\u9632\u6B62\u6A21\u578B\u8FD4\u56DE\u65E0\u5173\u5B57\u6BB5\uFF0C\u7B80\u5316\u540E\u7EED\u5904\u7406\uFF1B</li></ul><p>\u7981\u6B62\u591A\u4F59\u5B57\u6BB5\uFF1A\u8BBE\u7F6EadditionalProperties=False\uFF0C\u9632\u6B62\u6A21\u578B\u8FD4\u56DE\u65E0\u5173\u5B57\u6BB5\uFF0C\u7B80\u5316\u540E\u7EED\u5904\u7406\uFF1B</p><ul><li>\u89E3\u6790\u5931\u8D25\u5904\u7406\uFF1A\u82E5\u6A21\u578B\u8F93\u51FA\u4E0D\u7B26\u5408JSON\u683C\u5F0F\uFF0C\u89E3\u6790\u5668\u4F1A\u629B\u51FAOutputParserException\uFF0C\u53EF\u901A\u8FC7try-except\u6355\u83B7\uFF0C\u540E\u7EED\u7AE0\u8282\u4F1A\u8BB2\u89E3\u81EA\u52A8\u4FEE\u590D\u65B9\u6CD5\u3002</li></ul><p>\u89E3\u6790\u5931\u8D25\u5904\u7406\uFF1A\u82E5\u6A21\u578B\u8F93\u51FA\u4E0D\u7B26\u5408JSON\u683C\u5F0F\uFF0C\u89E3\u6790\u5668\u4F1A\u629B\u51FAOutputParserException\uFF0C\u53EF\u901A\u8FC7try-except\u6355\u83B7\uFF0C\u540E\u7EED\u7AE0\u8282\u4F1A\u8BB2\u89E3\u81EA\u52A8\u4FEE\u590D\u65B9\u6CD5\u3002</p><h2 id="_5-4-pydanticoutputparser-\u5F3A\u7C7B\u578B\u6570\u636E\u6821\u9A8C" tabindex="-1"><a class="header-anchor" href="#_5-4-pydanticoutputparser-\u5F3A\u7C7B\u578B\u6570\u636E\u6821\u9A8C" aria-hidden="true">#</a> 5.4 PydanticOutputParser\uFF1A\u5F3A\u7C7B\u578B\u6570\u636E\u6821\u9A8C</h2><p>JSONOutputParser\u80FD\u89E3\u6790JSON\u5BF9\u8C61\uFF0C\u4F46\u65E0\u6CD5\u8FDB\u884C\u590D\u6742\u6570\u636E\u6821\u9A8C\uFF08\u5982\u8BA2\u5355\u53F7\u683C\u5F0F\u6821\u9A8C\u3001\u91D1\u989D\u8303\u56F4\u6821\u9A8C\u3001\u81EA\u5B9A\u4E49\u89C4\u5219\u6821\u9A8C\uFF09\u3002\u800CPydanticOutputParser\u57FA\u4E8EPydantic\uFF08Python\u5F3A\u7C7B\u578B\u6570\u636E\u6821\u9A8C\u5E93\uFF09\uFF0C\u4E0D\u4EC5\u80FD\u89E3\u6790\u7ED3\u6784\u5316\u6570\u636E\uFF0C\u8FD8\u80FD\u5B9E\u73B0\u5F3A\u7C7B\u578B\u6821\u9A8C\u3001\u81EA\u5B9A\u4E49\u6821\u9A8C\u89C4\u5219\uFF0C\u662F\u751F\u4EA7\u73AF\u5883\u4E2D\u6700\u63A8\u8350\u7684\u89E3\u6790\u5668\u3002</p><p>\u6838\u5FC3\u4F18\u52BF\uFF1A\u5C06\u89E3\u6790\u4E0E\u6821\u9A8C\u7ED3\u5408\uFF0C\u786E\u4FDD\u89E3\u6790\u540E\u7684\u6570\u636E\u4E0D\u4EC5\u683C\u5F0F\u6B63\u786E\uFF0C\u8FD8\u7B26\u5408\u4E1A\u52A1\u89C4\u5219\uFF0C\u907F\u514D\u5F02\u5E38\u6570\u636E\u6D41\u5165\u4E0B\u6E38\u3002</p><h3 id="_5-4-1-\u57FA\u7840\u7528\u6CD5-\u5F3A\u7C7B\u578B\u89E3\u6790\u4E0E\u6821\u9A8C" tabindex="-1"><a class="header-anchor" href="#_5-4-1-\u57FA\u7840\u7528\u6CD5-\u5F3A\u7C7B\u578B\u89E3\u6790\u4E0E\u6821\u9A8C" aria-hidden="true">#</a> 5.4.1 \u57FA\u7840\u7528\u6CD5\uFF1A\u5F3A\u7C7B\u578B\u89E3\u6790\u4E0E\u6821\u9A8C</h3><p>\u6B65\u9AA4\uFF1A\u5148\u5B9A\u4E49Pydantic\u6A21\u578B\uFF08\u6307\u5B9A\u5B57\u6BB5\u7C7B\u578B\u3001\u7EA6\u675F\uFF09\uFF0C\u518D\u521D\u59CB\u5316PydanticOutputParser\uFF0C\u6700\u540E\u7ED3\u5408\u63D0\u793A\u6A21\u677F\u548C\u6A21\u578B\u8C03\u7528\u3002</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os
from pydantic import BaseModel, Field, validator

load_dotenv()

# 1. \u5B9A\u4E49Pydantic\u6A21\u578B\uFF08\u5F3A\u7C7B\u578B+\u6570\u636E\u6821\u9A8C\uFF09
class OrderInfo(BaseModel):
    order_id: str = Field(description=&quot;\u8BA2\u5355\u53F7\uFF0C\u683C\u5F0F\u4E3A6\u4F4D\u6570\u5B57&quot;)
    amount: float = Field(description=&quot;\u8BA2\u5355\u91D1\u989D\uFF0C\u5927\u4E8E0\uFF0C\u4FDD\u75592\u4F4D\u5C0F\u6570&quot;)
    status: str = Field(description=&quot;\u8BA2\u5355\u72B6\u6001&quot;, enum=[&quot;\u5F85\u4ED8\u6B3E&quot;, &quot;\u5DF2\u53D1\u8D27&quot;, &quot;\u5DF2\u7B7E\u6536&quot;, &quot;\u5DF2\u53D6\u6D88&quot;])
    create_time: str = Field(description=&quot;\u8BA2\u5355\u521B\u5EFA\u65F6\u95F4\uFF0C\u683C\u5F0F\u4E3AYYYY-MM-DD HH:MM:SS&quot;)
    
    # \u81EA\u5B9A\u4E49\u6821\u9A8C\u89C4\u5219\uFF1A\u8BA2\u5355\u53F7\u5FC5\u987B\u662F6\u4F4D\u6570\u5B57
    @validator(&quot;order_id&quot;)
    def order_id_must_be_6_digits(cls, v):
        if not v.isdigit() or len(v) != 6:
            raise ValueError(&quot;\u8BA2\u5355\u53F7\u5FC5\u987B\u662F6\u4F4D\u6570\u5B57&quot;)
        return v
    
    # \u81EA\u5B9A\u4E49\u6821\u9A8C\u89C4\u5219\uFF1A\u91D1\u989D\u5FC5\u987B\u5927\u4E8E0
    @validator(&quot;amount&quot;)
    def amount_must_be_positive(cls, v):
        if v &lt;= 0:
            raise ValueError(&quot;\u8BA2\u5355\u91D1\u989D\u5FC5\u987B\u5927\u4E8E0&quot;)
        return round(v, 2)  # \u4FDD\u75592\u4F4D\u5C0F\u6570

# 2. \u521D\u59CB\u5316Pydantic\u89E3\u6790\u5668\uFF08\u4F20\u5165Pydantic\u6A21\u578B\uFF09
pydantic_parser = PydanticOutputParser(pydantic_object=OrderInfo)

# 3. \u683C\u5F0F\u63D0\u793A\uFF08\u81EA\u52A8\u751F\u6210\uFF0C\u5305\u542B\u6A21\u578B\u5B57\u6BB5\u548C\u6821\u9A8C\u89C4\u5219\uFF09
format_instructions = pydantic_parser.get_format_instructions()

# 4. \u63D0\u793A\u6A21\u677F
prompt = PromptTemplate(
    template=&quot;\u4ECE\u4EE5\u4E0B\u6587\u672C\u4E2D\u63D0\u53D6\u8BA2\u5355\u4FE1\u606F\uFF0C\u4E25\u683C\u6309\u8981\u6C42\u8F93\u51FA\uFF1A\\n\u6587\u672C\uFF1A{text}\\n{format_instructions}&quot;,
    input_variables=[&quot;text&quot;],
    partial_variables={&quot;format_instructions&quot;: format_instructions}
)

# 5. \u8C03\u7528\u6A21\u578B+\u89E3\u6790\uFF08\u81EA\u52A8\u6821\u9A8C\uFF09
chat_model = ChatOpenAI(api_key=os.getenv(&quot;OPENAI_API_KEY&quot;), temperature=0.3)
chain = prompt | chat_model | pydantic_parser

# \u6D4B\u8BD5\u6587\u672C\uFF08\u6B63\u5E38\u60C5\u51B5\uFF09
text1 = &quot;\u7528\u6237\u738B\u4E94\u57282024-06-01 10:00:00\u4E0B\u5355\uFF0C\u8BA2\u5355\u53F7654321\uFF0C\u91D1\u989D199.50\u5143\uFF0C\u8BA2\u5355\u72B6\u6001\u5DF2\u7B7E\u6536\u3002&quot;
result1 = chain.invoke({&quot;text&quot;: text1})
print(&quot;\u6B63\u5E38\u8BA2\u5355\u89E3\u6790\u7ED3\u679C\uFF1A&quot;, result1)
print(&quot;\u8BA2\u5355\u53F7\u7C7B\u578B\uFF1A&quot;, type(result1.order_id))

# \u6D4B\u8BD5\u6587\u672C\uFF08\u5F02\u5E38\u60C5\u51B5\uFF1A\u8BA2\u5355\u53F75\u4F4D\uFF0C\u91D1\u989D\u4E3A0\uFF09
try:
    text2 = &quot;\u7528\u6237\u8D75\u516D\u57282024-06-02 15:00:00\u4E0B\u5355\uFF0C\u8BA2\u5355\u53F712345\uFF0C\u91D1\u989D0\u5143\uFF0C\u8BA2\u5355\u72B6\u6001\u5F85\u4ED8\u6B3E\u3002&quot;
    result2 = chain.invoke({&quot;text&quot;: text2})
except Exception as e:
    print(&quot;\u5F02\u5E38\u8BA2\u5355\u89E3\u6790\u5931\u8D25\uFF1A&quot;, str(e))
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,21),C=n("\u4EE3\u7801\u6765\u6E90\uFF1ALangChain PydanticOutputParser\u5B98\u65B9\u793A\u4F8B\uFF08"),S={href:"http://python.langchain.com/docs/langch%E2%80%A6%EF%BC%89%EF%BC%9B",target:"_blank",rel:"noopener noreferrer"},N=n("python.langchain.com/docs/langch\u2026\uFF09\uFF1B"),k=s(`<p>\u8FD0\u884C\u7ED3\u679C\uFF1A \u6B63\u5E38\u8BA2\u5355\u89E3\u6790\u7ED3\u679C\uFF1A order_id=&#39;654321&#39; amount=199.5 status=&#39;\u5DF2\u7B7E\u6536&#39; create_time=&#39;2024-06-01 10:00:00&#39; \u8BA2\u5355\u53F7\u7C7B\u578B\uFF1A &lt;class &#39;str&#39;&gt; \u5F02\u5E38\u8BA2\u5355\u89E3\u6790\u5931\u8D25\uFF1A 1 validation error for OrderInfo order_id \u8BA2\u5355\u53F7\u5FC5\u987B\u662F6\u4F4D\u6570\u5B57 (type=value_error)</p><p>\u8BF4\u660E\uFF1A\u89E3\u6790\u5668\u4F1A\u81EA\u52A8\u6821\u9A8C\u5B57\u6BB5\u7C7B\u578B\u3001\u81EA\u5B9A\u4E49\u89C4\u5219\uFF0C\u5F02\u5E38\u6570\u636E\u4F1A\u76F4\u63A5\u629B\u51FA\u6821\u9A8C\u9519\u8BEF\uFF0C\u907F\u514D\u6D41\u5165\u4E0B\u6E38\u4E1A\u52A1\u3002</p><h3 id="_5-4-2-\u8FDB\u9636\u7528\u6CD5-\u5D4C\u5957pydantic\u6A21\u578B-\u590D\u6742\u5BF9\u8C61" tabindex="-1"><a class="header-anchor" href="#_5-4-2-\u8FDB\u9636\u7528\u6CD5-\u5D4C\u5957pydantic\u6A21\u578B-\u590D\u6742\u5BF9\u8C61" aria-hidden="true">#</a> 5.4.2 \u8FDB\u9636\u7528\u6CD5\uFF1A\u5D4C\u5957Pydantic\u6A21\u578B\uFF08\u590D\u6742\u5BF9\u8C61\uFF09</h3><p>\u5F53\u9700\u8981\u89E3\u6790\u5D4C\u5957\u7ED3\u6784\uFF08\u5982\u8BA2\u5355\u4FE1\u606F\u5305\u542B\u7528\u6237\u4FE1\u606F\u3001\u5546\u54C1\u4FE1\u606F\uFF09\u65F6\uFF0C\u53EF\u5B9A\u4E49\u5D4C\u5957Pydantic\u6A21\u578B\uFF0C\u89E3\u6790\u5668\u4F1A\u81EA\u52A8\u5904\u7406\u5D4C\u5957\u7ED3\u6784\uFF0C\u5B9E\u73B0\u591A\u5C42\u6570\u636E\u6821\u9A8C\u3002</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os
from pydantic import BaseModel, Field, validator
from typing import List

load_dotenv()

# 1. \u5B9A\u4E49\u5D4C\u5957Pydantic\u6A21\u578B
class UserInfo(BaseModel):
    username: str = Field(description=&quot;\u7528\u6237\u540D&quot;)
    phone: str = Field(description=&quot;\u624B\u673A\u53F7\uFF0C11\u4F4D\u6570\u5B57&quot;)
    
    @validator(&quot;phone&quot;)
    def phone_must_be_11_digits(cls, v):
        if not v.isdigit() or len(v) != 11:
            raise ValueError(&quot;\u624B\u673A\u53F7\u5FC5\u987B\u662F11\u4F4D\u6570\u5B57&quot;)
        return v

class ProductInfo(BaseModel):
    product_name: str = Field(description=&quot;\u5546\u54C1\u540D\u79F0&quot;)
    quantity: int = Field(description=&quot;\u5546\u54C1\u6570\u91CF\uFF0C\u5927\u4E8E0&quot;)
    price: float = Field(description=&quot;\u5546\u54C1\u5355\u4EF7\uFF0C\u5927\u4E8E0&quot;)

class OrderDetail(BaseModel):
    order_info: OrderInfo  # \u5D4C\u5957\u8BA2\u5355\u57FA\u672C\u4FE1\u606F
    user_info: UserInfo    # \u5D4C\u5957\u7528\u6237\u4FE1\u606F
    products: List[ProductInfo]  # \u5D4C\u5957\u5546\u54C1\u5217\u8868

# 2. \u521D\u59CB\u5316\u89E3\u6790\u5668
pydantic_parser = PydanticOutputParser(pydantic_object=OrderDetail)

# 3. \u683C\u5F0F\u63D0\u793A
format_instructions = pydantic_parser.get_format_instructions()

# 4. \u63D0\u793A\u6A21\u677F
prompt = PromptTemplate(
    template=&quot;\u4ECE\u4EE5\u4E0B\u6587\u672C\u4E2D\u63D0\u53D6\u5B8C\u6574\u8BA2\u5355\u8BE6\u60C5\uFF0C\u4E25\u683C\u6309\u8981\u6C42\u8F93\u51FA\uFF1A\\n\u6587\u672C\uFF1A{text}\\n{format_instructions}&quot;,
    input_variables=[&quot;text&quot;],
    partial_variables={&quot;format_instructions&quot;: format_instructions}
)

# 5. \u8C03\u7528\u6A21\u578B+\u89E3\u6790
chat_model = ChatOpenAI(api_key=os.getenv(&quot;OPENAI_API_KEY&quot;), temperature=0.3)
chain = prompt | chat_model | pydantic_parser

# \u6D4B\u8BD5\u6587\u672C
text = &quot;\u7528\u6237\u5F20\u4E09\uFF08\u624B\u673A\u53F713800138000\uFF09\u57282024-06-03 09:30:00\u4E0B\u5355\uFF0C\u8BA2\u5355\u53F7789012\uFF0C\u91D1\u989D299.00\u5143\uFF0C\u72B6\u6001\u5DF2\u53D1\u8D27\u3002\u8BA2\u5355\u5305\u542B2\u4EF6\u5546\u54C1\uFF1ALangChain\u6559\u7A0B\uFF08\u5355\u4EF799.00\u5143\uFF09\u3001Python\u5B9E\u6218\uFF08\u5355\u4EF7100.00\u5143\uFF09\u3002&quot;
result = chain.invoke({&quot;text&quot;: text})

print(&quot;\u5B8C\u6574\u8BA2\u5355\u8BE6\u60C5\uFF1A&quot;)
print(f&quot;\u8BA2\u5355\u53F7\uFF1A{result.order_info.order_id}&quot;)
print(f&quot;\u7528\u6237\u540D\uFF1A{result.user_info.username}&quot;)
print(f&quot;\u5546\u54C1\u5217\u8868\uFF1A&quot;)
for product in result.products:
    print(f&quot;- {product.product_name}\uFF1A{product.quantity}\u4EF6\uFF0C\u5355\u4EF7{product.price}\u5143&quot;)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u8FD0\u884C\u7ED3\u679C\u4F1A\u81EA\u52A8\u89E3\u6790\u5D4C\u5957\u7ED3\u6784\uFF0C\u4E14\u5BF9\u6BCF\u4E2A\u5D4C\u5957\u6A21\u578B\u7684\u5B57\u6BB5\u8FDB\u884C\u6821\u9A8C\uFF0C\u9002\u5408\u590D\u6742\u4E1A\u52A1\u573A\u666F\uFF08\u5982\u7535\u5546\u8BA2\u5355\u3001\u7528\u6237\u8BE6\u60C5\uFF09\u3002</p><h3 id="_5-4-3-\u6838\u5FC3\u4F18\u52BF\u4E0E\u9009\u578B\u5EFA\u8BAE" tabindex="-1"><a class="header-anchor" href="#_5-4-3-\u6838\u5FC3\u4F18\u52BF\u4E0E\u9009\u578B\u5EFA\u8BAE" aria-hidden="true">#</a> 5.4.3 \u6838\u5FC3\u4F18\u52BF\u4E0E\u9009\u578B\u5EFA\u8BAE</h3><ul><li>\u5F3A\u7C7B\u578B\u6821\u9A8C\uFF1A\u652F\u6301\u5B57\u6BB5\u7C7B\u578B\u3001\u8303\u56F4\u3001\u683C\u5F0F\u3001\u81EA\u5B9A\u4E49\u89C4\u5219\u6821\u9A8C\uFF0C\u6BD4JSONOutputParser\u66F4\u4E25\u8C28\uFF1B</li></ul><p>\u5F3A\u7C7B\u578B\u6821\u9A8C\uFF1A\u652F\u6301\u5B57\u6BB5\u7C7B\u578B\u3001\u8303\u56F4\u3001\u683C\u5F0F\u3001\u81EA\u5B9A\u4E49\u89C4\u5219\u6821\u9A8C\uFF0C\u6BD4JSONOutputParser\u66F4\u4E25\u8C28\uFF1B</p><ul><li>\u5D4C\u5957\u7ED3\u6784\u652F\u6301\uFF1A\u8F7B\u677E\u5904\u7406\u5D4C\u5957\u5BF9\u8C61\u3001\u5217\u8868\uFF0C\u9002\u914D\u590D\u6742\u4E1A\u52A1\u6570\u636E\uFF1B</li></ul><p>\u5D4C\u5957\u7ED3\u6784\u652F\u6301\uFF1A\u8F7B\u677E\u5904\u7406\u5D4C\u5957\u5BF9\u8C61\u3001\u5217\u8868\uFF0C\u9002\u914D\u590D\u6742\u4E1A\u52A1\u6570\u636E\uFF1B</p><ul><li>\u4EE3\u7801\u53CB\u597D\uFF1A\u89E3\u6790\u7ED3\u679C\u662FPydantic\u6A21\u578B\u5B9E\u4F8B\uFF0C\u53EF\u901A\u8FC7\u201C\u5BF9\u8C61.\u5B57\u6BB5\u201D\u8BBF\u95EE\uFF0C\u6BD4\u5B57\u5178\u66F4\u76F4\u89C2\u3001\u66F4\u5B89\u5168\uFF1B</li></ul><p>\u4EE3\u7801\u53CB\u597D\uFF1A\u89E3\u6790\u7ED3\u679C\u662FPydantic\u6A21\u578B\u5B9E\u4F8B\uFF0C\u53EF\u901A\u8FC7\u201C\u5BF9\u8C61.\u5B57\u6BB5\u201D\u8BBF\u95EE\uFF0C\u6BD4\u5B57\u5178\u66F4\u76F4\u89C2\u3001\u66F4\u5B89\u5168\uFF1B</p><ul><li>\u9009\u578B\u5EFA\u8BAE\uFF1A\u751F\u4EA7\u73AF\u5883\u4F18\u5148\u4F7F\u7528PydanticOutputParser\uFF0C\u5C24\u5176\u662F\u9700\u8981\u6570\u636E\u6821\u9A8C\u3001\u590D\u6742\u5BF9\u8C61\u89E3\u6790\u7684\u573A\u666F\uFF1B\u7B80\u5355JSON\u89E3\u6790\u53EF\u4F7F\u7528JSONOutputParser\uFF0C\u8FFD\u6C42\u7B80\u6D01\u9AD8\u6548\u3002</li></ul><p>\u9009\u578B\u5EFA\u8BAE\uFF1A\u751F\u4EA7\u73AF\u5883\u4F18\u5148\u4F7F\u7528PydanticOutputParser\uFF0C\u5C24\u5176\u662F\u9700\u8981\u6570\u636E\u6821\u9A8C\u3001\u590D\u6742\u5BF9\u8C61\u89E3\u6790\u7684\u573A\u666F\uFF1B\u7B80\u5355JSON\u89E3\u6790\u53EF\u4F7F\u7528JSONOutputParser\uFF0C\u8FFD\u6C42\u7B80\u6D01\u9AD8\u6548\u3002</p><h2 id="_5-5-\u81EA\u5B9A\u4E49-outputparser-\u5B9E\u73B0\u7279\u6B8A\u683C\u5F0F" tabindex="-1"><a class="header-anchor" href="#_5-5-\u81EA\u5B9A\u4E49-outputparser-\u5B9E\u73B0\u7279\u6B8A\u683C\u5F0F" aria-hidden="true">#</a> 5.5 \u81EA\u5B9A\u4E49 OutputParser \u5B9E\u73B0\u7279\u6B8A\u683C\u5F0F</h2><p>LangChain\u63D0\u4F9B\u7684\u5185\u7F6E\u89E3\u6790\u5668\uFF08List\u3001JSON\u3001Pydantic\uFF09\u8986\u76D6\u4E86\u5927\u591A\u6570\u573A\u666F\uFF0C\u4F46\u5728\u67D0\u4E9B\u7279\u6B8A\u4E1A\u52A1\u573A\u666F\u4E2D\uFF0C\u6211\u4EEC\u9700\u8981\u89E3\u6790\u81EA\u5B9A\u4E49\u683C\u5F0F\uFF08\u5982XML\u3001Markdown\u8868\u683C\u3001\u7279\u5B9A\u5206\u9694\u7B26\u683C\u5F0F\uFF09\uFF0C\u6B64\u65F6\u53EF\u901A\u8FC7\u7EE7\u627FBaseOutputParser\uFF0C\u5B9E\u73B0\u81EA\u5B9A\u4E49OutputParser\u3002</p><p>\u6838\u5FC3\u6B65\u9AA4\uFF1A\u7EE7\u627FBaseOutputParser\uFF0C\u91CD\u5199\u4E24\u4E2A\u65B9\u6CD5\u2014\u2014parse()\uFF08\u89E3\u6790\u903B\u8F91\uFF09\u548Cget_format_instructions()\uFF08\u683C\u5F0F\u63D0\u793A\uFF09\u3002</p><h3 id="_5-5-1-\u5B9E\u6218\u793A\u4F8B1-\u89E3\u6790xml\u683C\u5F0F" tabindex="-1"><a class="header-anchor" href="#_5-5-1-\u5B9E\u6218\u793A\u4F8B1-\u89E3\u6790xml\u683C\u5F0F" aria-hidden="true">#</a> 5.5.1 \u5B9E\u6218\u793A\u4F8B1\uFF1A\u89E3\u6790XML\u683C\u5F0F</h3><p>\u573A\u666F\uFF1A\u6A21\u578B\u8FD4\u56DEXML\u683C\u5F0F\u6587\u672C\uFF0C\u89E3\u6790\u4E3APython\u5B57\u5178\uFF0C\u9002\u914D\u9700\u8981XML\u8F93\u5165\u7684\u4E0B\u6E38\u7CFB\u7EDF\u3002</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_core.output_parsers import BaseOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os
import xml.etree.ElementTree as ET

load_dotenv()

# 1. \u81EA\u5B9A\u4E49XML\u89E3\u6790\u5668\uFF08\u7EE7\u627FBaseOutputParser\uFF09
class XMLOutputParser(BaseOutputParser):
    def parse(self, text: str) -&gt; dict:
        &quot;&quot;&quot;\u89E3\u6790XML\u6587\u672C\u4E3A\u5B57\u5178&quot;&quot;&quot;
        try:
            # \u89E3\u6790XML
            root = ET.fromstring(text)
            # \u8F6C\u6362\u4E3A\u5B57\u5178\uFF08\u7B80\u5355XML\uFF0C\u65E0\u5D4C\u5957\uFF09
            result = {}
            for child in root:
                result[child.tag] = child.text
            return result
        except Exception as e:
            raise ValueError(f&quot;XML\u89E3\u6790\u5931\u8D25\uFF1A{str(e)}&quot;) from e
    
    def get_format_instructions(self) -&gt; str:
        &quot;&quot;&quot;\u8FD4\u56DE\u683C\u5F0F\u63D0\u793A\uFF0C\u8BA9\u6A21\u578B\u6309XML\u683C\u5F0F\u8F93\u51FA&quot;&quot;&quot;
        return &quot;&quot;&quot;\u8BF7\u6309\u4EE5\u4E0BXML\u683C\u5F0F\u8F93\u51FA\uFF0C\u6839\u8282\u70B9\u4E3A&lt;user&gt;\uFF0C\u5B50\u8282\u70B9\u4E3Ausername\u3001age\u3001email\u3001occupation\uFF0C\u65E0\u591A\u4F59\u5185\u5BB9\uFF1A
&lt;user&gt;
    &lt;username&gt;\u7528\u6237\u540D&lt;/username&gt;
    &lt;age&gt;\u5E74\u9F84&lt;/age&gt;
    &lt;email&gt;\u90AE\u7BB1&lt;/email&gt;
    &lt;occupation&gt;\u804C\u4E1A&lt;/occupation&gt;
&lt;/user&gt;&quot;&quot;&quot;

# 2. \u521D\u59CB\u5316\u81EA\u5B9A\u4E49\u89E3\u6790\u5668
xml_parser = XMLOutputParser()

# 3. \u63D0\u793A\u6A21\u677F
prompt = PromptTemplate(
    template=&quot;\u4ECE\u4EE5\u4E0B\u6587\u672C\u4E2D\u63D0\u53D6\u7528\u6237\u4FE1\u606F\uFF0C\u6309XML\u683C\u5F0F\u8F93\u51FA\uFF1A\\n\u6587\u672C\uFF1A{text}\\n{format_instructions}&quot;,
    input_variables=[&quot;text&quot;],
    partial_variables={&quot;format_instructions&quot;: xml_parser.get_format_instructions()}
)

# 4. \u8C03\u7528\u6A21\u578B+\u89E3\u6790
chat_model = ChatOpenAI(api_key=os.getenv(&quot;OPENAI_API_KEY&quot;), temperature=0.3)
chain = prompt | chat_model | xml_parser

# \u6D4B\u8BD5\u6587\u672C
text = &quot;\u7528\u6237\u674E\u56DB\uFF0C28\u5C81\uFF0C\u90AE\u7BB1lisi@qq.com\uFF0C\u804C\u4E1A\u662F\u4EA7\u54C1\u7ECF\u7406\u3002&quot;
result = chain.invoke({&quot;text&quot;: text})

print(&quot;XML\u89E3\u6790\u7ED3\u679C\uFF1A&quot;, result)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,21),M=n("\u4EE3\u7801\u6765\u6E90\uFF1ALangChain\u81EA\u5B9A\u4E49OutputParser\u5B98\u65B9\u6587\u6863\uFF08"),I={href:"http://python.langchain.com/docs/langch%E2%80%A6%EF%BC%89%EF%BC%9B",target:"_blank",rel:"noopener noreferrer"},E=n("python.langchain.com/docs/langch\u2026\uFF09\uFF1B"),A=s(`<p>\u8FD0\u884C\u7ED3\u679C\uFF1AXML\u89E3\u6790\u7ED3\u679C\uFF1A {&#39;username&#39;: &#39;\u674E\u56DB&#39;, &#39;age&#39;: &#39;28&#39;, &#39;email&#39;: &#39;lisi@qq.com&#39;, &#39;occupation&#39;: &#39;\u4EA7\u54C1\u7ECF\u7406&#39;}</p><h3 id="_5-5-2-\u5B9E\u6218\u793A\u4F8B2-\u89E3\u6790markdown\u8868\u683C" tabindex="-1"><a class="header-anchor" href="#_5-5-2-\u5B9E\u6218\u793A\u4F8B2-\u89E3\u6790markdown\u8868\u683C" aria-hidden="true">#</a> 5.5.2 \u5B9E\u6218\u793A\u4F8B2\uFF1A\u89E3\u6790Markdown\u8868\u683C</h3><p>\u573A\u666F\uFF1A\u6A21\u578B\u8FD4\u56DEMarkdown\u8868\u683C\uFF0C\u89E3\u6790\u4E3A\u5217\u8868\u5B57\u5178\uFF0C\u4FBF\u4E8E\u540E\u7EED\u6279\u91CF\u5904\u7406\uFF08\u5982\u6279\u91CF\u5BFC\u5165\u6570\u636E\u5E93\uFF09\u3002</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_core.output_parsers import BaseOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os

load_dotenv()

# 1. \u81EA\u5B9A\u4E49Markdown\u8868\u683C\u89E3\u6790\u5668
class MarkdownTableOutputParser(BaseOutputParser):
    def parse(self, text: str) -&gt; list[dict]:
        &quot;&quot;&quot;\u89E3\u6790Markdown\u8868\u683C\u4E3A\u5217\u8868\u5B57\u5178&quot;&quot;&quot;
        lines = text.strip().split(&quot;\\n&quot;)
        # \u63D0\u53D6\u8868\u5934\uFF08\u7B2C\u4E8C\u884C\uFF0C\u53BB\u6389|\u548C\u7A7A\u683C\uFF09
        headers = [h.strip() for h in lines[1].split(&quot;|&quot;) if h.strip()]
        # \u63D0\u53D6\u6570\u636E\u884C\uFF08\u4ECE\u7B2C\u4E09\u884C\u5F00\u59CB\uFF09
        data = []
        for line in lines[2:]:
            if line.strip() == &quot;&quot; or line.startswith(&quot;| --- |&quot;):
                continue
            values = [v.strip() for v in line.split(&quot;|&quot;) if v.strip()]
            # \u8868\u5934\u4E0E\u6570\u636E\u5BF9\u5E94\uFF0C\u751F\u6210\u5B57\u5178
            data.append(dict(zip(headers, values)))
        return data
    
    def get_format_instructions(self) -&gt; str:
        &quot;&quot;&quot;\u683C\u5F0F\u63D0\u793A\uFF0C\u8BA9\u6A21\u578B\u6309Markdown\u8868\u683C\u8F93\u51FA&quot;&quot;&quot;
        return &quot;&quot;&quot;\u8BF7\u6309\u4EE5\u4E0BMarkdown\u8868\u683C\u683C\u5F0F\u8F93\u51FA\u5546\u54C1\u5217\u8868\uFF0C\u8868\u5934\u4E3A\u5546\u54C1\u540D\u79F0\u3001\u5355\u4EF7\u3001\u6570\u91CF\uFF0C\u65E0\u591A\u4F59\u5185\u5BB9\uFF1A
| \u5546\u54C1\u540D\u79F0 | \u5355\u4EF7 | \u6570\u91CF |
| --- | --- | --- |
| \u5546\u54C11 | \u4EF7\u683C1 | \u6570\u91CF1 |
| \u5546\u54C12 | \u4EF7\u683C2 | \u6570\u91CF2 |&quot;&quot;&quot;

# 2. \u521D\u59CB\u5316\u89E3\u6790\u5668
md_parser = MarkdownTableOutputParser()

# 3. \u63D0\u793A\u6A21\u677F
prompt = PromptTemplate(
    template=&quot;\u5217\u51FA\u4EE5\u4E0B\u8BA2\u5355\u4E2D\u7684\u5546\u54C1\u4FE1\u606F\uFF0C\u6309Markdown\u8868\u683C\u8F93\u51FA\uFF1A\\n\u8BA2\u5355\uFF1A{order}\\n{format_instructions}&quot;,
    input_variables=[&quot;order&quot;],
    partial_variables={&quot;format_instructions&quot;: md_parser.get_format_instructions()}
)

# 4. \u8C03\u7528\u6A21\u578B+\u89E3\u6790
chat_model = ChatOpenAI(api_key=os.getenv(&quot;OPENAI_API_KEY&quot;), temperature=0.7)
chain = prompt | chat_model | md_parser

# \u6D4B\u8BD5\u8BA2\u5355\u6587\u672C
order = &quot;\u8BA2\u5355\u5305\u542B3\u4EF6\u5546\u54C1\uFF1ALangChain\u6559\u7A0B\uFF08\u5355\u4EF799\u5143\uFF0C1\u4EF6\uFF09\u3001Python\u5B9E\u6218\uFF08\u5355\u4EF7100\u5143\uFF0C2\u4EF6\uFF09\u3001AI\u63D0\u793A\u5DE5\u7A0B\uFF08\u5355\u4EF789\u5143\uFF0C1\u4EF6\uFF09\u3002&quot;
result = chain.invoke({&quot;order&quot;: order})

print(&quot;Markdown\u8868\u683C\u89E3\u6790\u7ED3\u679C\uFF1A&quot;)
for item in result:
    print(item)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u8FD0\u884C\u7ED3\u679C\uFF1A Markdown\u8868\u683C\u89E3\u6790\u7ED3\u679C\uFF1A {&#39;\u5546\u54C1\u540D\u79F0&#39;: &#39;LangChain\u6559\u7A0B&#39;, &#39;\u5355\u4EF7&#39;: &#39;99\u5143&#39;, &#39;\u6570\u91CF&#39;: &#39;1\u4EF6&#39;} {&#39;\u5546\u54C1\u540D\u79F0&#39;: &#39;Python\u5B9E\u6218&#39;, &#39;\u5355\u4EF7&#39;: &#39;100\u5143&#39;, &#39;\u6570\u91CF&#39;: &#39;2\u4EF6&#39;} {&#39;\u5546\u54C1\u540D\u79F0&#39;: &#39;AI\u63D0\u793A\u5DE5\u7A0B&#39;, &#39;\u5355\u4EF7&#39;: &#39;89\u5143&#39;, &#39;\u6570\u91CF&#39;: &#39;1\u4EF6&#39;}</p><h3 id="_5-5-3-\u81EA\u5B9A\u4E49\u89E3\u6790\u5668\u6CE8\u610F\u4E8B\u9879" tabindex="-1"><a class="header-anchor" href="#_5-5-3-\u81EA\u5B9A\u4E49\u89E3\u6790\u5668\u6CE8\u610F\u4E8B\u9879" aria-hidden="true">#</a> 5.5.3 \u81EA\u5B9A\u4E49\u89E3\u6790\u5668\u6CE8\u610F\u4E8B\u9879</h3><ul><li>\u683C\u5F0F\u63D0\u793A\u8981\u6E05\u6670\uFF1Aget_format_instructions()\u4E2D\uFF0C\u5FC5\u987B\u660E\u786E\u544A\u77E5\u6A21\u578B\u8F93\u51FA\u683C\u5F0F\uFF08\u5982XML\u6807\u7B7E\u3001\u8868\u683C\u7ED3\u6784\uFF09\uFF0C\u907F\u514D\u6A21\u578B\u8F93\u51FA\u4E0D\u7B26\u5408\u8981\u6C42\uFF1B</li></ul><p>\u683C\u5F0F\u63D0\u793A\u8981\u6E05\u6670\uFF1Aget_format_instructions()\u4E2D\uFF0C\u5FC5\u987B\u660E\u786E\u544A\u77E5\u6A21\u578B\u8F93\u51FA\u683C\u5F0F\uFF08\u5982XML\u6807\u7B7E\u3001\u8868\u683C\u7ED3\u6784\uFF09\uFF0C\u907F\u514D\u6A21\u578B\u8F93\u51FA\u4E0D\u7B26\u5408\u8981\u6C42\uFF1B</p><ul><li>\u5F02\u5E38\u5904\u7406\u8981\u5B8C\u5584\uFF1Aparse()\u65B9\u6CD5\u4E2D\uFF0C\u9700\u6355\u83B7\u89E3\u6790\u8FC7\u7A0B\u4E2D\u7684\u5F02\u5E38\uFF08\u5982XML\u683C\u5F0F\u9519\u8BEF\u3001\u8868\u683C\u683C\u5F0F\u9519\u8BEF\uFF09\uFF0C\u5E76\u629B\u51FA\u6E05\u6670\u7684\u9519\u8BEF\u4FE1\u606F\uFF0C\u4FBF\u4E8E\u8C03\u8BD5\uFF1B</li></ul><p>\u5F02\u5E38\u5904\u7406\u8981\u5B8C\u5584\uFF1Aparse()\u65B9\u6CD5\u4E2D\uFF0C\u9700\u6355\u83B7\u89E3\u6790\u8FC7\u7A0B\u4E2D\u7684\u5F02\u5E38\uFF08\u5982XML\u683C\u5F0F\u9519\u8BEF\u3001\u8868\u683C\u683C\u5F0F\u9519\u8BEF\uFF09\uFF0C\u5E76\u629B\u51FA\u6E05\u6670\u7684\u9519\u8BEF\u4FE1\u606F\uFF0C\u4FBF\u4E8E\u8C03\u8BD5\uFF1B</p><ul><li>\u590D\u7528\u6027\u8BBE\u8BA1\uFF1A\u53EF\u5C06\u81EA\u5B9A\u4E49\u89E3\u6790\u5668\u5C01\u88C5\u4E3A\u7C7B\uFF0C\u52A0\u5165\u53C2\u6570\uFF08\u5982XML\u6839\u8282\u70B9\u3001\u8868\u683C\u8868\u5934\uFF09\uFF0C\u63D0\u5347\u590D\u7528\u6027\uFF0C\u9002\u914D\u4E0D\u540C\u573A\u666F\u3002</li></ul><p>\u590D\u7528\u6027\u8BBE\u8BA1\uFF1A\u53EF\u5C06\u81EA\u5B9A\u4E49\u89E3\u6790\u5668\u5C01\u88C5\u4E3A\u7C7B\uFF0C\u52A0\u5165\u53C2\u6570\uFF08\u5982XML\u6839\u8282\u70B9\u3001\u8868\u683C\u8868\u5934\uFF09\uFF0C\u63D0\u5347\u590D\u7528\u6027\uFF0C\u9002\u914D\u4E0D\u540C\u573A\u666F\u3002</p><h2 id="_5-6-retryoutputparser-\u81EA\u52A8\u4FEE\u590D\u683C\u5F0F\u9519\u8BEF" tabindex="-1"><a class="header-anchor" href="#_5-6-retryoutputparser-\u81EA\u52A8\u4FEE\u590D\u683C\u5F0F\u9519\u8BEF" aria-hidden="true">#</a> 5.6 RetryOutputParser \u81EA\u52A8\u4FEE\u590D\u683C\u5F0F\u9519\u8BEF</h2><p>\u65E0\u8BBA\u4F7F\u7528\u54EA\u79CD\u89E3\u6790\u5668\uFF0C\u90FD\u53EF\u80FD\u51FA\u73B0\u201C\u6A21\u578B\u8F93\u51FA\u4E0D\u7B26\u5408\u683C\u5F0F\u8981\u6C42\u201D\u7684\u60C5\u51B5\uFF08\u5982JSON\u8BED\u6CD5\u9519\u8BEF\u3001XML\u6807\u7B7E\u7F3A\u5931\u3001\u5B57\u6BB5\u7F3A\u5931\uFF09\uFF0C\u6B64\u65F6\u5982\u679C\u76F4\u63A5\u629B\u51FA\u5F02\u5E38\uFF0C\u4F1A\u5F71\u54CD\u7528\u6237\u4F53\u9A8C\u548C\u4E1A\u52A1\u6D41\u7A0B\u3002</p><p>LangChain\u7684RetryOutputParser\uFF08\u91CD\u8BD5\u89E3\u6790\u5668\uFF09\u53EF\u89E3\u51B3\u8FD9\u4E00\u95EE\u9898\u2014\u2014\u5F53\u89E3\u6790\u5931\u8D25\u65F6\uFF0C\u5B83\u4F1A\u81EA\u52A8\u5C06\u201C\u9519\u8BEF\u4FE1\u606F\u201D\u548C\u201C\u6A21\u578B\u539F\u59CB\u8F93\u51FA\u201D\u53CD\u9988\u7ED9\u6A21\u578B\uFF0C\u8BA9\u6A21\u578B\u91CD\u65B0\u751F\u6210\u7B26\u5408\u683C\u5F0F\u8981\u6C42\u7684\u5185\u5BB9\uFF0C\u5B9E\u73B0\u81EA\u52A8\u4FEE\u590D\u683C\u5F0F\u9519\u8BEF\uFF0C\u65E0\u9700\u4EBA\u5DE5\u5E72\u9884\u3002</p><h3 id="_5-6-1-\u6838\u5FC3\u539F\u7406" tabindex="-1"><a class="header-anchor" href="#_5-6-1-\u6838\u5FC3\u539F\u7406" aria-hidden="true">#</a> 5.6.1 \u6838\u5FC3\u539F\u7406</h3><p>RetryOutputParser\u7684\u5DE5\u4F5C\u6D41\u7A0B\u5206\u4E3A4\u6B65\uFF1A</p><ul><li>\u6A21\u578B\u751F\u6210\u539F\u59CB\u8F93\u51FA\uFF0C\u4F20\u9012\u7ED9RetryOutputParser\uFF1B</li></ul><p>\u6A21\u578B\u751F\u6210\u539F\u59CB\u8F93\u51FA\uFF0C\u4F20\u9012\u7ED9RetryOutputParser\uFF1B</p><ul><li>RetryOutputParser\u8C03\u7528\u5E95\u5C42\u89E3\u6790\u5668\uFF08\u5982JSONOutputParser\u3001PydanticOutputParser\uFF09\u8FDB\u884C\u89E3\u6790\uFF1B</li></ul><p>RetryOutputParser\u8C03\u7528\u5E95\u5C42\u89E3\u6790\u5668\uFF08\u5982JSONOutputParser\u3001PydanticOutputParser\uFF09\u8FDB\u884C\u89E3\u6790\uFF1B</p><ul><li>\u82E5\u89E3\u6790\u6210\u529F\uFF0C\u76F4\u63A5\u8FD4\u56DE\u7ED3\u6784\u5316\u6570\u636E\uFF1B</li></ul><p>\u82E5\u89E3\u6790\u6210\u529F\uFF0C\u76F4\u63A5\u8FD4\u56DE\u7ED3\u6784\u5316\u6570\u636E\uFF1B</p><ul><li>\u82E5\u89E3\u6790\u5931\u8D25\uFF0CRetryOutputParser\u81EA\u52A8\u751F\u6210\u201C\u91CD\u8BD5\u63D0\u793A\u201D\uFF08\u5305\u542B\u539F\u59CB\u8F93\u51FA\u3001\u9519\u8BEF\u4FE1\u606F\u3001\u683C\u5F0F\u8981\u6C42\uFF09\uFF0C\u8BA9\u6A21\u578B\u91CD\u65B0\u751F\u6210\u8F93\u51FA\uFF0C\u76F4\u81F3\u89E3\u6790\u6210\u529F\u6216\u8FBE\u5230\u6700\u5927\u91CD\u8BD5\u6B21\u6570\u3002</li></ul><p>\u82E5\u89E3\u6790\u5931\u8D25\uFF0CRetryOutputParser\u81EA\u52A8\u751F\u6210\u201C\u91CD\u8BD5\u63D0\u793A\u201D\uFF08\u5305\u542B\u539F\u59CB\u8F93\u51FA\u3001\u9519\u8BEF\u4FE1\u606F\u3001\u683C\u5F0F\u8981\u6C42\uFF09\uFF0C\u8BA9\u6A21\u578B\u91CD\u65B0\u751F\u6210\u8F93\u51FA\uFF0C\u76F4\u81F3\u89E3\u6790\u6210\u529F\u6216\u8FBE\u5230\u6700\u5927\u91CD\u8BD5\u6B21\u6570\u3002</p><h3 id="_5-6-2-\u5B9E\u6218\u793A\u4F8B-\u81EA\u52A8\u4FEE\u590Djson\u683C\u5F0F\u9519\u8BEF" tabindex="-1"><a class="header-anchor" href="#_5-6-2-\u5B9E\u6218\u793A\u4F8B-\u81EA\u52A8\u4FEE\u590Djson\u683C\u5F0F\u9519\u8BEF" aria-hidden="true">#</a> 5.6.2 \u5B9E\u6218\u793A\u4F8B\uFF1A\u81EA\u52A8\u4FEE\u590DJSON\u683C\u5F0F\u9519\u8BEF</h3><p>\u4EE5JSONOutputParser\u4E3A\u4F8B\uFF0C\u6F14\u793ARetryOutputParser\u5982\u4F55\u81EA\u52A8\u4FEE\u590D\u6A21\u578B\u8F93\u51FA\u7684JSON\u8BED\u6CD5\u9519\u8BEF\u3002</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JSONOutputParser, RetryOutputParser
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os

load_dotenv()

# 1. \u5B9A\u4E49JSON Schema
json_schema = {
    &quot;type&quot;: &quot;object&quot;,
    &quot;properties&quot;: {
        &quot;username&quot;: {&quot;type&quot;: &quot;string&quot;},
        &quot;age&quot;: {&quot;type&quot;: &quot;number&quot;},
        &quot;occupation&quot;: {&quot;type&quot;: &quot;string&quot;}
    },
    &quot;required&quot;: [&quot;username&quot;, &quot;age&quot;]
}

# 2. \u521D\u59CB\u5316\u5E95\u5C42\u89E3\u6790\u5668\uFF08JSONOutputParser\uFF09
json_parser = JSONOutputParser(schema=json_schema)

# 3. \u521D\u59CB\u5316\u91CD\u8BD5\u89E3\u6790\u5668\uFF08\u4F20\u5165\u5E95\u5C42\u89E3\u6790\u5668\u3001\u6A21\u578B\u3001\u63D0\u793A\u6A21\u677F\uFF09
chat_model = ChatOpenAI(api_key=os.getenv(&quot;OPENAI_API_KEY&quot;), temperature=0.3)
retry_parser = RetryOutputParser.from_llm(
    llm=chat_model,
    parser=json_parser,
    max_retries=2  # \u6700\u5927\u91CD\u8BD5\u6B21\u6570\uFF08\u9ED8\u8BA43\u6B21\uFF09
)

# 4. \u63D0\u793A\u6A21\u677F\uFF08\u52A0\u5165\u683C\u5F0F\u63D0\u793A\uFF09
prompt = PromptTemplate(
    template=&quot;\u4ECE\u4EE5\u4E0B\u6587\u672C\u4E2D\u63D0\u53D6\u7528\u6237\u4FE1\u606F\uFF0C\u6309JSON\u683C\u5F0F\u8F93\u51FA\uFF1A\\n\u6587\u672C\uFF1A{text}\\n{format_instructions}&quot;,
    input_variables=[&quot;text&quot;],
    partial_variables={&quot;format_instructions&quot;: json_parser.get_format_instructions()}
)

# 5. \u8C03\u7528\u6A21\u578B+\u91CD\u8BD5\u89E3\u6790\uFF08\u81EA\u52A8\u4FEE\u590D\u9519\u8BEF\uFF09
chain = prompt | chat_model | retry_parser

# \u6D4B\u8BD5\u6587\u672C\uFF08\u6545\u610F\u8BA9\u6A21\u578B\u53EF\u80FD\u8F93\u51FA\u9519\u8BEFJSON\uFF0C\u5982\u7F3A\u5C11\u9017\u53F7\u3001\u5F15\u53F7\uFF09
text = &quot;\u7528\u6237\u5F20\u4E09\uFF0C25\u5C81\uFF0C\u804C\u4E1A\u662FPython\u5F00\u53D1\u5DE5\u7A0B\u5E08\u3002&quot;
result = chain.invoke({&quot;text&quot;: text})

print(&quot;\u89E3\u6790\u7ED3\u679C\uFF08\u81EA\u52A8\u4FEE\u590D\u540E\uFF09\uFF1A&quot;, result)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,28),J=n("\u4EE3\u7801\u6765\u6E90\uFF1ALangChain RetryOutputParser\u5B98\u65B9\u793A\u4F8B\uFF08"),B={href:"http://python.langchain.com/docs/langch%E2%80%A6%EF%BC%89%EF%BC%9B",target:"_blank",rel:"noopener noreferrer"},F=n("python.langchain.com/docs/langch\u2026\uFF09\uFF1B"),T=s(`<p>\u8FD0\u884C\u8BF4\u660E\uFF1A\u82E5\u6A21\u578B\u7B2C\u4E00\u6B21\u8F93\u51FA\u7684JSON\u5B58\u5728\u8BED\u6CD5\u9519\u8BEF\uFF08\u5982{&quot;username&quot;:&quot;\u5F20\u4E09&quot; &quot;age&quot;:25}\uFF0C\u7F3A\u5C11\u9017\u53F7\uFF09\uFF0CRetryOutputParser\u4F1A\u81EA\u52A8\u53CD\u9988\u9519\u8BEF\uFF0C\u8BA9\u6A21\u578B\u91CD\u65B0\u751F\u6210\u6B63\u786E\u7684JSON\uFF0C\u76F4\u81F3\u89E3\u6790\u6210\u529F\u3002</p><h3 id="_5-6-3-\u8FDB\u9636\u7528\u6CD5-\u7ED3\u5408pydanticoutputparser\u4FEE\u590D\u6821\u9A8C\u9519\u8BEF" tabindex="-1"><a class="header-anchor" href="#_5-6-3-\u8FDB\u9636\u7528\u6CD5-\u7ED3\u5408pydanticoutputparser\u4FEE\u590D\u6821\u9A8C\u9519\u8BEF" aria-hidden="true">#</a> 5.6.3 \u8FDB\u9636\u7528\u6CD5\uFF1A\u7ED3\u5408PydanticOutputParser\u4FEE\u590D\u6821\u9A8C\u9519\u8BEF</h3><p>RetryOutputParser\u4E0D\u4EC5\u80FD\u4FEE\u590D\u683C\u5F0F\u9519\u8BEF\uFF0C\u8FD8\u80FD\u4FEE\u590DPydantic\u6A21\u578B\u7684\u6821\u9A8C\u9519\u8BEF\uFF08\u5982\u8BA2\u5355\u53F7\u683C\u5F0F\u9519\u8BEF\u3001\u91D1\u989D\u4E3A\u8D1F\u6570\uFF09\uFF0C\u793A\u4F8B\u5982\u4E0B\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser, RetryOutputParser
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os
from pydantic import BaseModel, Field, validator

load_dotenv()

# 1. \u5B9A\u4E49Pydantic\u6A21\u578B\uFF08\u5E26\u6821\u9A8C\u89C4\u5219\uFF09
class OrderInfo(BaseModel):
    order_id: str = Field(description=&quot;\u8BA2\u5355\u53F7\uFF0C6\u4F4D\u6570\u5B57&quot;)
    amount: float = Field(description=&quot;\u8BA2\u5355\u91D1\u989D\uFF0C\u5927\u4E8E0&quot;)
    
    @validator(&quot;order_id&quot;)
    def order_id_must_be_6_digits(cls, v):
        if not v.isdigit() or len(v) != 6:
            raise ValueError(&quot;\u8BA2\u5355\u53F7\u5FC5\u987B\u662F6\u4F4D\u6570\u5B57&quot;)
        return v
    
    @validator(&quot;amount&quot;)
    def amount_must_be_positive(cls, v):
        if v &lt;= 0:
            raise ValueError(&quot;\u8BA2\u5355\u91D1\u989D\u5FC5\u987B\u5927\u4E8E0&quot;)
        return v

# 2. \u5E95\u5C42\u89E3\u6790\u5668
pydantic_parser = PydanticOutputParser(pydantic_object=OrderInfo)

# 3. \u91CD\u8BD5\u89E3\u6790\u5668
chat_model = ChatOpenAI(api_key=os.getenv(&quot;OPENAI_API_KEY&quot;), temperature=0.3)
retry_parser = RetryOutputParser.from_llm(
    llm=chat_model,
    parser=pydantic_parser,
    max_retries=2
)

# 4. \u63D0\u793A\u6A21\u677F
prompt = PromptTemplate(
    template=&quot;\u4ECE\u4EE5\u4E0B\u6587\u672C\u4E2D\u63D0\u53D6\u8BA2\u5355\u4FE1\u606F\uFF0C\u4E25\u683C\u6309\u8981\u6C42\u8F93\u51FA\uFF1A\\n\u6587\u672C\uFF1A{text}\\n{format_instructions}&quot;,
    input_variables=[&quot;text&quot;],
    partial_variables={&quot;format_instructions&quot;: pydantic_parser.get_format_instructions()}
)

# 5. \u94FE\u5F0F\u8C03\u7528
chain = prompt | chat_model | retry_parser

# \u6D4B\u8BD5\u6587\u672C\uFF08\u53EF\u80FD\u5BFC\u81F4\u6821\u9A8C\u9519\u8BEF\uFF1A\u8BA2\u5355\u53F75\u4F4D\uFF0C\u91D1\u989D\u4E3A0\uFF09
text = &quot;\u7528\u6237\u674E\u56DB\u4E0B\u5355\uFF0C\u8BA2\u5355\u53F712345\uFF0C\u91D1\u989D0\u5143\u3002&quot;
result = chain.invoke({&quot;text&quot;: text})

print(&quot;\u4FEE\u590D\u6821\u9A8C\u9519\u8BEF\u540E\u7684\u7ED3\u679C\uFF1A&quot;, result)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u8FD0\u884C\u7ED3\u679C\uFF1A\u89E3\u6790\u5668\u4F1A\u81EA\u52A8\u4FEE\u590D\u8BA2\u5355\u53F7\uFF08\u8865\u5168\u4E3A6\u4F4D\uFF09\u548C\u91D1\u989D\uFF08\u6539\u4E3A\u5927\u4E8E0\u7684\u503C\uFF09\uFF0C\u6700\u7EC8\u8FD4\u56DE\u7B26\u5408\u6821\u9A8C\u89C4\u5219\u7684OrderInfo\u5B9E\u4F8B\u3002</p><h3 id="_5-6-4-\u5B9E\u6218\u5EFA\u8BAE" tabindex="-1"><a class="header-anchor" href="#_5-6-4-\u5B9E\u6218\u5EFA\u8BAE" aria-hidden="true">#</a> 5.6.4 \u5B9E\u6218\u5EFA\u8BAE</h3><ul><li>\u8BBE\u7F6E\u5408\u7406\u7684\u91CD\u8BD5\u6B21\u6570\uFF1Amax_retries\u5EFA\u8BAE\u8BBE\u4E3A2~3\u6B21\uFF0C\u8FC7\u591A\u91CD\u8BD5\u4F1A\u589E\u52A0\u8017\u65F6\u548Ctokens\u6D88\u8017\uFF1B</li></ul><p>\u8BBE\u7F6E\u5408\u7406\u7684\u91CD\u8BD5\u6B21\u6570\uFF1Amax_retries\u5EFA\u8BAE\u8BBE\u4E3A2~3\u6B21\uFF0C\u8FC7\u591A\u91CD\u8BD5\u4F1A\u589E\u52A0\u8017\u65F6\u548Ctokens\u6D88\u8017\uFF1B</p><ul><li>\u4F18\u5148\u7528\u4E8E\u751F\u4EA7\u73AF\u5883\uFF1A\u5F00\u53D1\u73AF\u5883\u53EF\u5173\u95ED\u91CD\u8BD5\uFF0C\u5FEB\u901F\u5B9A\u4F4D\u683C\u5F0F\u9519\u8BEF\uFF1B\u751F\u4EA7\u73AF\u5883\u5F00\u542F\u91CD\u8BD5\uFF0C\u63D0\u5347\u7CFB\u7EDF\u7A33\u5B9A\u6027\uFF1B</li></ul><p>\u4F18\u5148\u7528\u4E8E\u751F\u4EA7\u73AF\u5883\uFF1A\u5F00\u53D1\u73AF\u5883\u53EF\u5173\u95ED\u91CD\u8BD5\uFF0C\u5FEB\u901F\u5B9A\u4F4D\u683C\u5F0F\u9519\u8BEF\uFF1B\u751F\u4EA7\u73AF\u5883\u5F00\u542F\u91CD\u8BD5\uFF0C\u63D0\u5347\u7CFB\u7EDF\u7A33\u5B9A\u6027\uFF1B</p><ul><li>\u7ED3\u5408\u65E5\u5FD7\uFF1A\u91CD\u8BD5\u8FC7\u7A0B\u4E2D\uFF0C\u53EF\u6253\u5370\u65E5\u5FD7\uFF08\u5982\u539F\u59CB\u8F93\u51FA\u3001\u9519\u8BEF\u4FE1\u606F\u3001\u91CD\u8BD5\u6B21\u6570\uFF09\uFF0C\u4FBF\u4E8E\u540E\u7EED\u8C03\u8BD5\u3002</li></ul><p>\u7ED3\u5408\u65E5\u5FD7\uFF1A\u91CD\u8BD5\u8FC7\u7A0B\u4E2D\uFF0C\u53EF\u6253\u5370\u65E5\u5FD7\uFF08\u5982\u539F\u59CB\u8F93\u51FA\u3001\u9519\u8BEF\u4FE1\u606F\u3001\u91CD\u8BD5\u6B21\u6570\uFF09\uFF0C\u4FBF\u4E8E\u540E\u7EED\u8C03\u8BD5\u3002</p><h2 id="_5-7-\u7ED3\u5408-llm-\u8C03\u7528\u94FE\u81EA\u52A8\u89E3\u6790" tabindex="-1"><a class="header-anchor" href="#_5-7-\u7ED3\u5408-llm-\u8C03\u7528\u94FE\u81EA\u52A8\u89E3\u6790" aria-hidden="true">#</a> 5.7 \u7ED3\u5408 LLM \u8C03\u7528\u94FE\u81EA\u52A8\u89E3\u6790</h2><p>\u524D\u9762\u7684\u793A\u4F8B\u4E2D\uFF0C\u6211\u4EEC\u4F7F\u7528\u201C\u63D0\u793A\u2192\u6A21\u578B\u2192\u89E3\u6790\u201D\u7684\u7B80\u5355\u94FE\u5F0F\u8C03\u7528\uFF0C\u800CLangChain\u7684\u6838\u5FC3\u4F18\u52BF\u662F\u201C\u94FE\u5F0F\u8C03\u7528\uFF08Chains\uFF09\u201D\u2014\u2014\u53EF\u5C06PromptTemplate\u3001Model\u3001OutputParser\u4E0E\u5176\u4ED6\u7EC4\u4EF6\uFF08\u5982\u8BB0\u5FC6\u3001\u5DE5\u5177\uFF09\u7ED3\u5408\uFF0C\u5B9E\u73B0\u66F4\u590D\u6742\u7684\u81EA\u52A8\u89E3\u6790\u6D41\u7A0B\u3002</p><p>\u672C\u8282\u5C06\u4ECB\u7ECD\u4E24\u79CD\u5E38\u7528\u7684\u201C\u89E3\u6790\u94FE\u201D\uFF0C\u5B9E\u73B0\u7AEF\u5230\u7AEF\u7684\u81EA\u52A8\u89E3\u6790\uFF0C\u65E0\u9700\u624B\u52A8\u62FC\u63A5\u7EC4\u4EF6\uFF0C\u63D0\u5347\u5F00\u53D1\u6548\u7387\u3002</p><h3 id="_5-7-1-\u57FA\u7840\u89E3\u6790\u94FE-llmchain" tabindex="-1"><a class="header-anchor" href="#_5-7-1-\u57FA\u7840\u89E3\u6790\u94FE-llmchain" aria-hidden="true">#</a> 5.7.1 \u57FA\u7840\u89E3\u6790\u94FE\uFF1ALLMChain</h3><p>LLMChain\u662F\u6700\u57FA\u7840\u7684\u94FE\u5F0F\u8C03\u7528\uFF0C\u5C06PromptTemplate\u3001Model\u3001OutputParser\u6574\u5408\u4E3A\u4E00\u4E2A\u94FE\uFF0C\u8C03\u7528\u94FE\u65F6\uFF0C\u81EA\u52A8\u5B8C\u6210\u201C\u63D0\u793A\u751F\u6210\u2192\u6A21\u578B\u8C03\u7528\u2192\u8F93\u51FA\u89E3\u6790\u201D\uFF0C\u9002\u5408\u7B80\u5355\u573A\u666F\u3002</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain.chains import LLMChain
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os
from pydantic import BaseModel, Field

load_dotenv()

# 1. \u5B9A\u4E49Pydantic\u6A21\u578B
class ProductInfo(BaseModel):
    product_name: str = Field(description=&quot;\u5546\u54C1\u540D\u79F0&quot;)
    price: float = Field(description=&quot;\u5546\u54C1\u5355\u4EF7&quot;)
    description: str = Field(description=&quot;\u5546\u54C1\u7B80\u4ECB&quot;)

# 2. \u89E3\u6790\u5668\u3001\u63D0\u793A\u6A21\u677F\u3001\u6A21\u578B
parser = PydanticOutputParser(pydantic_object=ProductInfo)
prompt = PromptTemplate(
    template=&quot;\u6839\u636E\u5546\u54C1\u540D\u79F0\uFF0C\u751F\u6210\u5546\u54C1\u4FE1\u606F\uFF0C\u6309\u8981\u6C42\u8F93\u51FA\uFF1A\\n\u5546\u54C1\u540D\u79F0\uFF1A{product_name}\\n{format_instructions}&quot;,
    input_variables=[&quot;product_name&quot;],
    partial_variables={&quot;format_instructions&quot;: parser.get_format_instructions()}
)
chat_model = ChatOpenAI(api_key=os.getenv(&quot;OPENAI_API_KEY&quot;), temperature=0.7)

# 3. \u6784\u5EFALLMChain\uFF08\u6574\u5408\u63D0\u793A\u3001\u6A21\u578B\u3001\u89E3\u6790\u5668\uFF09
llm_chain = LLMChain(
    llm=chat_model,
    prompt=prompt,
    output_parser=parser,
    verbose=True  # \u5F00\u542F\u65E5\u5FD7\uFF0C\u67E5\u770B\u94FE\u7684\u8FD0\u884C\u8FC7\u7A0B
)

# 4. \u8C03\u7528\u94FE\uFF0C\u81EA\u52A8\u89E3\u6790
result = llm_chain.invoke({&quot;product_name&quot;: &quot;LangChain\u6559\u7A0B&quot;})

print(&quot;\u81EA\u52A8\u89E3\u6790\u7ED3\u679C\uFF1A&quot;, result)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,18),j=n("\u4EE3\u7801\u6765\u6E90\uFF1ALangChain LLMChain\u5B98\u65B9\u793A\u4F8B\uFF08"),w={href:"http://python.langchain.com/docs/langch%E2%80%A6%EF%BC%89%EF%BC%9B",target:"_blank",rel:"noopener noreferrer"},X=n("python.langchain.com/docs/langch\u2026\uFF09\uFF1B"),Y=s(`<p>\u8FD0\u884C\u8BF4\u660E\uFF1A\u8C03\u7528llm_chain.invoke()\u540E\uFF0C\u94FE\u4F1A\u81EA\u52A8\u5B8C\u6210\u201C\u751F\u6210\u63D0\u793A\u2192\u8C03\u7528\u6A21\u578B\u2192\u89E3\u6790\u8F93\u51FA\u201D\uFF0C\u65E0\u9700\u624B\u52A8\u5206\u6B65\u64CD\u4F5C\uFF0Cverbose=True\u53EF\u67E5\u770B\u8BE6\u7EC6\u8FD0\u884C\u65E5\u5FD7\uFF0C\u4FBF\u4E8E\u8C03\u8BD5\u3002</p><h3 id="_5-7-2-\u8FDB\u9636\u89E3\u6790\u94FE-sequentialchain-\u591A\u6B65\u9AA4\u89E3\u6790" tabindex="-1"><a class="header-anchor" href="#_5-7-2-\u8FDB\u9636\u89E3\u6790\u94FE-sequentialchain-\u591A\u6B65\u9AA4\u89E3\u6790" aria-hidden="true">#</a> 5.7.2 \u8FDB\u9636\u89E3\u6790\u94FE\uFF1ASequentialChain\uFF08\u591A\u6B65\u9AA4\u89E3\u6790\uFF09</h3><p>\u5F53\u89E3\u6790\u4EFB\u52A1\u9700\u8981\u591A\u6B65\u9AA4\u5B8C\u6210\uFF08\u5982\u201C\u5148\u63D0\u53D6\u6587\u672C\u5173\u952E\u8BCD\u2192\u518D\u6839\u636E\u5173\u952E\u8BCD\u751F\u6210\u5546\u54C1\u4FE1\u606F\u2192\u6700\u540E\u89E3\u6790\u4E3A\u7ED3\u6784\u5316\u6570\u636E\u201D\uFF09\uFF0C\u53EF\u4F7F\u7528SequentialChain\uFF08\u987A\u5E8F\u94FE\uFF09\uFF0C\u5C06\u591A\u4E2ALLMChain\u6309\u987A\u5E8F\u4E32\u8054\uFF0C\u5B9E\u73B0\u591A\u6B65\u9AA4\u81EA\u52A8\u89E3\u6790\u3002</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain.chains import SequentialChain, LLMChain
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import CommaSeparatedListOutputParser, PydanticOutputParser
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os
from pydantic import BaseModel, Field
from typing import List

load_dotenv()

# \u6B65\u9AA41\uFF1A\u63D0\u53D6\u5546\u54C1\u5173\u952E\u8BCD\uFF08\u5217\u8868\u89E3\u6790\uFF09
keyword_parser = CommaSeparatedListOutputParser()
keyword_prompt = PromptTemplate(
    template=&quot;\u63D0\u53D6\u4EE5\u4E0B\u6587\u672C\u4E2D\u7684\u5546\u54C1\u5173\u952E\u8BCD\uFF08\u9017\u53F7\u5206\u9694\uFF09\uFF1A\\n\u6587\u672C\uFF1A{text}\\n{format_instructions}&quot;,
    input_variables=[&quot;text&quot;],
    partial_variables={&quot;format_instructions&quot;: keyword_parser.get_format_instructions()}
)
keyword_chain = LLMChain(
    llm=ChatOpenAI(api_key=os.getenv(&quot;OPENAI_API_KEY&quot;), temperature=0.5),
    prompt=keyword_prompt,
    output_parser=keyword_parser,
    output_key=&quot;keywords&quot;  # \u8F93\u51FA\u952E\uFF0C\u7528\u4E8E\u4F20\u9012\u7ED9\u4E0B\u4E00\u4E2A\u94FE
)

# \u6B65\u9AA42\uFF1A\u6839\u636E\u5173\u952E\u8BCD\u751F\u6210\u5546\u54C1\u5217\u8868\uFF08Pydantic\u89E3\u6790\uFF09
class ProductList(BaseModel):
    products: List[ProductInfo]

class ProductInfo(BaseModel):
    product_name: str = Field(description=&quot;\u5546\u54C1\u540D\u79F0&quot;)
    price: float = Field(description=&quot;\u5546\u54C1\u5355\u4EF7&quot;)

product_parser = PydanticOutputParser(pydantic_object=ProductList)
product_prompt = PromptTemplate(
    template=&quot;\u6839\u636E\u5173\u952E\u8BCD{keywords}\uFF0C\u751F\u62103\u4E2A\u76F8\u5173\u5546\u54C1\u4FE1\u606F\uFF0C\u6309\u8981\u6C42\u8F93\u51FA\uFF1A\\n{format_instructions}&quot;,
    input_variables=[&quot;keywords&quot;],
    partial_variables={&quot;format_instructions&quot;: product_parser.get_format_instructions()}
)
product_chain = LLMChain(
    llm=ChatOpenAI(api_key=os.getenv(&quot;OPENAI_API_KEY&quot;), temperature=0.7),
    prompt=product_prompt,
    output_parser=product_parser,
    output_key=&quot;product_list&quot;
)

# \u6784\u5EFA\u987A\u5E8F\u94FE\uFF08\u4E32\u8054\u4E24\u4E2A\u6B65\u9AA4\uFF09
sequential_chain = SequentialChain(
    chains=[keyword_chain, product_chain],
    input_variables=[&quot;text&quot;],  # \u521D\u59CB\u8F93\u5165
    output_variables=[&quot;keywords&quot;, &quot;product_list&quot;],  # \u6700\u7EC8\u8F93\u51FA
    verbose=True
)

# \u8C03\u7528\u987A\u5E8F\u94FE\uFF0C\u81EA\u52A8\u5B8C\u6210\u591A\u6B65\u9AA4\u89E3\u6790
text = &quot;\u63A8\u8350\u51E0\u6B3E\u5927\u8BED\u8A00\u6A21\u578B\u76F8\u5173\u7684\u5B66\u4E60\u8D44\u6599\uFF0C\u5305\u62EC\u6559\u7A0B\u3001\u5B9E\u6218\u9879\u76EE\u3001\u6307\u5357\u7B49\u3002&quot;
result = sequential_chain.invoke({&quot;text&quot;: text})

print(&quot;\u5173\u952E\u8BCD\uFF1A&quot;, result[&quot;keywords&quot;])
print(&quot;\u5546\u54C1\u5217\u8868\uFF1A&quot;, result[&quot;product_list&quot;].products)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u8FD0\u884C\u8BF4\u660E\uFF1A\u987A\u5E8F\u94FE\u5148\u8C03\u7528keyword_chain\u63D0\u53D6\u5173\u952E\u8BCD\uFF0C\u518D\u5C06\u5173\u952E\u8BCD\u4F20\u9012\u7ED9product_chain\u751F\u6210\u5546\u54C1\u5217\u8868\u5E76\u89E3\u6790\uFF0C\u5B9E\u73B0\u591A\u6B65\u9AA4\u81EA\u52A8\u89E3\u6790\uFF0C\u9002\u5408\u590D\u6742\u89E3\u6790\u573A\u666F\u3002</p><h3 id="_5-7-3-\u5B9E\u6218\u5EFA\u8BAE" tabindex="-1"><a class="header-anchor" href="#_5-7-3-\u5B9E\u6218\u5EFA\u8BAE" aria-hidden="true">#</a> 5.7.3 \u5B9E\u6218\u5EFA\u8BAE</h3><ul><li>\u7B80\u5355\u89E3\u6790\u7528LLMChain\uFF1A\u65E0\u9700\u591A\u6B65\u9AA4\uFF0C\u76F4\u63A5\u6574\u5408\u63D0\u793A\u3001\u6A21\u578B\u3001\u89E3\u6790\u5668\uFF0C\u7B80\u6D01\u9AD8\u6548\uFF1B</li></ul><p>\u89E3\u6790\u7528SequentialChain\uFF1A\u5F53\u89E3\u6790\u4EFB\u52A1\u6D89\u53CA\u591A\u6B65\u9AA4\u8054\u52A8\uFF08\u5982\u5148\u63D0\u53D6\u6838\u5FC3\u4FE1\u606F\u3001\u518D\u52A0\u5DE5\u5904\u7406\u3001\u6700\u540E\u89E3\u6790\u7ED3\u6784\u5316\u6570\u636E\uFF09\uFF0C\u4E32\u8054\u591A\u4E2ALLMChain\u5F62\u6210\u987A\u5E8F\u94FE\uFF0C\u80FD\u5B9E\u73B0\u7AEF\u5230\u7AEF\u7684\u81EA\u52A8\u5316\u89E3\u6790\uFF0C\u51CF\u5C11\u624B\u52A8\u5E72\u9884\uFF0C\u9002\u914D\u66F4\u590D\u6742\u7684\u4E1A\u52A1\u573A\u666F\u3002\u6B64\u5916\uFF0C\u5728\u5B9E\u9645\u5F00\u53D1\u4E2D\uFF0C\u53EF\u6839\u636E\u4EFB\u52A1\u9700\u6C42\u7075\u6D3B\u7EC4\u5408\u4E0D\u540C\u89E3\u6790\u5668\u4E0E\u8C03\u7528\u94FE\uFF0C\u6BD4\u5982\u5C06PydanticOutputParser\u4E0ESequentialChain\u7ED3\u5408\uFF0C\u65E2\u5B9E\u73B0\u591A\u6B65\u9AA4\u89E3\u6790\uFF0C\u53C8\u4FDD\u8BC1\u6570\u636E\u6821\u9A8C\u7684\u4E25\u8C28\u6027\uFF0C\u8BA9\u7ED3\u6784\u5316\u8F93\u51FA\u66F4\u53EF\u9760\u3001\u66F4\u9002\u914D\u4E0B\u6E38\u4E1A\u52A1\u9700\u6C42\u3002</p>`,8);function R(K,V){const e=a("ExternalLinkIcon");return l(),d("div",null,[i("blockquote",null,[i("p",null,[o,i("a",v,[c,t(e)])])]),m,i("p",null,[p,i("a",b,[_,t(e)])]),h,i("p",null,[q,i("a",f,[g,t(e)])]),P,i("p",null,[O,i("a",y,[x,t(e)])]),L,i("p",null,[C,i("a",S,[N,t(e)])]),k,i("p",null,[M,i("a",I,[E,t(e)])]),A,i("p",null,[J,i("a",B,[F,t(e)])]),T,i("p",null,[j,i("a",w,[X,t(e)])]),Y])}var z=r(u,[["render",R],["__file","ai-langchain-output-parser.html.vue"]]);export{z as default};
