import{_ as l}from"./plugin-vue_export-helper.21dcd24c.js";import{r as t,o as d,c as r,a as n,d as s,b as e,e as a}from"./app.99bca247.js";const o={},u=e("\u539F\u6587\u94FE\u63A5\uFF1A"),v={href:"https://juejin.cn/column/7616994432275267627",target:"_blank",rel:"noopener noreferrer"},c=e("\u6398\u91D1"),m=a(`<h3 id="_3-1-llm-\u4E0E-chatmodel-\u7684\u533A\u522B\u4E0E\u9002\u7528\u573A\u666F" tabindex="-1"><a class="header-anchor" href="#_3-1-llm-\u4E0E-chatmodel-\u7684\u533A\u522B\u4E0E\u9002\u7528\u573A\u666F" aria-hidden="true">#</a> 3.1 LLM \u4E0E ChatModel \u7684\u533A\u522B\u4E0E\u9002\u7528\u573A\u666F</h3><p>LangChain\u4E2D\uFF0C\u4E0E\u5927\u6A21\u578B\u4EA4\u4E92\u7684\u6838\u5FC3\u63A5\u53E3\u5206\u4E3A\u4E24\u7C7B\uFF1ALLM\uFF08\u5927\u8BED\u8A00\u6A21\u578B\uFF09\u548CChatModel\uFF08\u804A\u5929\u6A21\u578B\uFF09\u3002\u5F88\u591A\u65B0\u624B\u5BB9\u6613\u6DF7\u6DC6\u4E24\u8005\uFF0C\u5176\u5B9E\u5B83\u4EEC\u7684\u6838\u5FC3\u533A\u522B\u5728\u4E8E\u201C\u4EA4\u4E92\u683C\u5F0F\u201D\u548C\u201C\u9002\u7528\u573A\u666F\u201D\uFF0C\u9009\u62E9\u5BF9\u4E86\u6A21\u578B\u7C7B\u578B\uFF0C\u80FD\u5927\u5E45\u63D0\u5347\u5F00\u53D1\u6548\u7387\u3002</p><h4 id="_3-1-1-\u6838\u5FC3\u533A\u522B-\u4E00\u5F20\u8868\u770B\u61C2" tabindex="-1"><a class="header-anchor" href="#_3-1-1-\u6838\u5FC3\u533A\u522B-\u4E00\u5F20\u8868\u770B\u61C2" aria-hidden="true">#</a> 3.1.1 \u6838\u5FC3\u533A\u522B\uFF08\u4E00\u5F20\u8868\u770B\u61C2\uFF09</h4><h4 id="_3-1-2-\u4EE3\u7801\u793A\u4F8B-\u76F4\u89C2\u5BF9\u6BD4" tabindex="-1"><a class="header-anchor" href="#_3-1-2-\u4EE3\u7801\u793A\u4F8B-\u76F4\u89C2\u5BF9\u6BD4" aria-hidden="true">#</a> 3.1.2 \u4EE3\u7801\u793A\u4F8B\uFF08\u76F4\u89C2\u5BF9\u6BD4\uFF09</h4><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

# \u521D\u59CB\u5316LLM\uFF08\u7EAF\u6587\u672C\u4EA4\u4E92\uFF09
llm = OpenAI(
    model_name=&quot;text-davinci-003&quot;,
    api_key=os.getenv(&quot;OPENAI_API_KEY&quot;),
    temperature=0.7
)

# \u8C03\u7528\uFF1A\u8F93\u5165\u7EAF\u6587\u672C\u5B57\u7B26\u4E32
response = llm.invoke(&quot;\u7B80\u5355\u4ECB\u7ECDLangChain&quot;)
print(&quot;LLM\u8F93\u51FA\uFF08\u7EAF\u6587\u672C\uFF09\uFF1A&quot;, response)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),p=e("\u4F9D\u8D56\u5B89\u88C5\uFF1Apip install langchain-openai==0.1.6\uFF1B\u4EE3\u7801\u6765\u6E90\uFF1ALangChain LLM\u5B98\u65B9\u793A\u4F8B\uFF08"),h={href:"http://python.langchain.com/docs/langch%E2%80%A6%EF%BC%89%E3%80%82",target:"_blank",rel:"noopener noreferrer"},b=e("python.langchain.com/docs/langch\u2026\uFF09\u3002"),g=a(`<div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
import os

load_dotenv()

# \u521D\u59CB\u5316ChatModel\uFF08\u6D88\u606F\u5217\u8868\u4EA4\u4E92\uFF09
chat_model = ChatOpenAI(
    model_name=&quot;gpt-3.5-turbo&quot;,
    api_key=os.getenv(&quot;OPENAI_API_KEY&quot;),
    temperature=0.7
)

# \u8C03\u7528\uFF1A\u8F93\u5165\u6D88\u606F\u5217\u8868\uFF08\u6B64\u5904\u4E3A\u5355\u6761\u7528\u6237\u6D88\u606F\uFF09
response = chat_model.invoke([HumanMessage(content=&quot;\u7B80\u5355\u4ECB\u7ECDLangChain&quot;)])
print(&quot;ChatModel\u8F93\u51FA\uFF08\u6D88\u606F\u5BF9\u8C61\uFF09\uFF1A&quot;, response.content)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),_=e("\u4EE3\u7801\u6765\u6E90\uFF1ALangChain ChatModel\u5B98\u65B9\u793A\u4F8B\uFF08"),q={href:"http://python.langchain.com/docs/langch%E2%80%A6%EF%BC%89%E3%80%82",target:"_blank",rel:"noopener noreferrer"},E=e("python.langchain.com/docs/langch\u2026\uFF09\u3002"),A=a(`<h4 id="_3-1-3-\u9002\u7528\u573A\u666F\u9009\u62E9-\u65B0\u624B\u5FC5\u770B" tabindex="-1"><a class="header-anchor" href="#_3-1-3-\u9002\u7528\u573A\u666F\u9009\u62E9-\u65B0\u624B\u5FC5\u770B" aria-hidden="true">#</a> 3.1.3 \u9002\u7528\u573A\u666F\u9009\u62E9\uFF08\u65B0\u624B\u5FC5\u770B\uFF09</h4><ul><li>\u4F18\u5148\u9009 ChatModel \u7684\u573A\u666F\uFF1A\u591A\u8F6E\u5BF9\u8BDD\uFF08\u5982\u804A\u5929\u673A\u5668\u4EBA\uFF09\u3001\u9700\u8981\u7CFB\u7EDF\u63D0\u793A\uFF08System Prompt\uFF09\u3001\u9700\u8981\u660E\u786E\u533A\u5206\u7528\u6237/AI\u6D88\u606F\u3001\u4F7F\u7528\u4E3B\u6D41\u804A\u5929\u6A21\u578B\uFF08GPT-3.5/4\u3001Claude\u3001Llama 3\uFF09\uFF1B</li></ul><p>\u4F18\u5148\u9009 ChatModel \u7684\u573A\u666F\uFF1A\u591A\u8F6E\u5BF9\u8BDD\uFF08\u5982\u804A\u5929\u673A\u5668\u4EBA\uFF09\u3001\u9700\u8981\u7CFB\u7EDF\u63D0\u793A\uFF08System Prompt\uFF09\u3001\u9700\u8981\u660E\u786E\u533A\u5206\u7528\u6237/AI\u6D88\u606F\u3001\u4F7F\u7528\u4E3B\u6D41\u804A\u5929\u6A21\u578B\uFF08GPT-3.5/4\u3001Claude\u3001Llama 3\uFF09\uFF1B</p><ul><li>\u9009 LLM \u7684\u573A\u666F\uFF1A\u7EAF\u6587\u672C\u751F\u6210\uFF08\u5982\u6587\u6848\u3001\u6458\u8981\uFF09\u3001\u4F7F\u7528\u65E7\u7248\u6587\u672C\u6A21\u578B\uFF08\u5982text-davinci-003\uFF09\u3001\u7B80\u5355\u573A\u666F\u65E0\u9700\u590D\u6742\u6D88\u606F\u7ED3\u6784\uFF1B</li></ul><p>\u9009 LLM \u7684\u573A\u666F\uFF1A\u7EAF\u6587\u672C\u751F\u6210\uFF08\u5982\u6587\u6848\u3001\u6458\u8981\uFF09\u3001\u4F7F\u7528\u65E7\u7248\u6587\u672C\u6A21\u578B\uFF08\u5982text-davinci-003\uFF09\u3001\u7B80\u5355\u573A\u666F\u65E0\u9700\u590D\u6742\u6D88\u606F\u7ED3\u6784\uFF1B</p><ul><li>\u6CE8\u610F\uFF1ALangChain 1.0+\u7248\u672C\u66F4\u63A8\u8350\u4F7F\u7528ChatModel\uFF0C\u5176\u529F\u80FD\u66F4\u5168\u9762\u3001\u66F4\u8D34\u5408\u5F53\u524D\u5927\u6A21\u578B\u7684\u4EA4\u4E92\u903B\u8F91\uFF0CLLM\u66F4\u591A\u7528\u4E8E\u517C\u5BB9\u65E7\u7248\u6A21\u578B\u3002</li></ul><p>\u6CE8\u610F\uFF1ALangChain 1.0+\u7248\u672C\u66F4\u63A8\u8350\u4F7F\u7528ChatModel\uFF0C\u5176\u529F\u80FD\u66F4\u5168\u9762\u3001\u66F4\u8D34\u5408\u5F53\u524D\u5927\u6A21\u578B\u7684\u4EA4\u4E92\u903B\u8F91\uFF0CLLM\u66F4\u591A\u7528\u4E8E\u517C\u5BB9\u65E7\u7248\u6A21\u578B\u3002</p><h3 id="_3-2-\u4F7F\u7528-openai\u3001anthropic\u3001hugging-face-\u6A21\u578B" tabindex="-1"><a class="header-anchor" href="#_3-2-\u4F7F\u7528-openai\u3001anthropic\u3001hugging-face-\u6A21\u578B" aria-hidden="true">#</a> 3.2 \u4F7F\u7528 OpenAI\u3001Anthropic\u3001Hugging Face \u6A21\u578B</h3><p>LangChain\u7684\u6838\u5FC3\u4F18\u52BF\u4E4B\u4E00\u662F\u201C\u7EDF\u4E00\u6A21\u578B\u63A5\u53E3\u201D\u2014\u2014\u65E0\u8BBA\u4F7F\u7528OpenAI\u3001Anthropic\u8FD8\u662FHugging Face\u7684\u6A21\u578B\uFF0C\u8C03\u7528\u65B9\u5F0F\u9AD8\u5EA6\u4E00\u81F4\uFF0C\u65E0\u9700\u4FEE\u6539\u6838\u5FC3\u4EE3\u7801\uFF0C\u53EA\u9700\u66FF\u6362\u6A21\u578B\u521D\u59CB\u5316\u903B\u8F91\u3002\u672C\u8282\u805A\u71263\u7C7B\u4E3B\u6D41\u4E91\u7AEF/\u5F00\u6E90\u6A21\u578B\u7684\u96C6\u6210\uFF0C\u793A\u4F8B\u7B80\u6D01\u53EF\u76F4\u63A5\u8FD0\u884C\u3002</p><h4 id="_3-2-1-openai-\u6A21\u578B-gpt-3-5-4-\u6700\u5E38\u7528" tabindex="-1"><a class="header-anchor" href="#_3-2-1-openai-\u6A21\u578B-gpt-3-5-4-\u6700\u5E38\u7528" aria-hidden="true">#</a> 3.2.1 OpenAI \u6A21\u578B\uFF08GPT-3.5/4\uFF0C\u6700\u5E38\u7528\uFF09</h4><p>OpenAI\u7684ChatModel\u662FLangChain\u5F00\u53D1\u4E2D\u6700\u5E38\u7528\u7684\u6A21\u578B\uFF0C\u652F\u6301GPT-3.5-turbo\u3001GPT-4\u7B49\uFF0C\u8C03\u7528\u65B9\u5F0F\u5982\u4E0B\uFF08\u5EF6\u7EED\u4E0A\u4E00\u8282\u7684ChatModel\u793A\u4F8B\uFF0C\u8865\u5145\u591A\u8F6E\u5BF9\u8BDD\uFF09\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from dotenv import load_dotenv
import os

load_dotenv()

# \u521D\u59CB\u5316OpenAI ChatModel
chat_openai = ChatOpenAI(
    model_name=&quot;gpt-3.5-turbo&quot;,  # \u53EF\u66FF\u6362\u4E3Agpt-4
    api_key=os.getenv(&quot;OPENAI_API_KEY&quot;),
    temperature=0.5
)

# \u591A\u8F6E\u5BF9\u8BDD\uFF1A\u7CFB\u7EDF\u63D0\u793A + \u7528\u6237\u6D88\u606F + AI\u6D88\u606F + \u65B0\u7528\u6237\u6D88\u606F
messages = [
    SystemMessage(content=&quot;\u4F60\u662F\u4E00\u540DLangChain\u5F00\u53D1\u52A9\u624B\uFF0C\u56DE\u7B54\u7B80\u6D01\u6613\u61C2\uFF0C\u4E0D\u8D85\u8FC73\u53E5\u8BDD\u3002&quot;),
    HumanMessage(content=&quot;LangChain\u7684Models\u62BD\u8C61\u6709\u4EC0\u4E48\u7528\uFF1F&quot;),
    AIMessage(content=&quot;\u7EDF\u4E00\u6A21\u578B\u63A5\u53E3\uFF0C\u8BA9\u4E0D\u540C\u5927\u6A21\u578B\u8C03\u7528\u65B9\u5F0F\u4E00\u81F4\uFF0C\u964D\u4F4E\u5F00\u53D1\u6210\u672C\u3002&quot;),
    HumanMessage(content=&quot;\u90A3ChatModel\u548CLLM\u7684\u533A\u522B\u662F\u4EC0\u4E48\uFF1F&quot;)
]

# \u8C03\u7528\u6A21\u578B
response = chat_openai.invoke(messages)
print(&quot;OpenAI\u54CD\u5E94\uFF1A&quot;, response.content)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,12),C=e("\u4EE3\u7801\u6765\u6E90\uFF1ALangChain OpenAI\u96C6\u6210\u6587\u6863\uFF08"),f={href:"http://python.langchain.com/docs/integr%E2%80%A6%EF%BC%89%EF%BC%9B%E6%B3%A8%E6%84%8F%EF%BC%9A%E9%9C%80%E7%A7%91%E5%AD%A6%E4%B8%8A%E7%BD%91%EF%BC%8CAPI%E5%AF%86%E9%92%A5%E9%9C%80%E5%9C%A8OpenAI%E5%B9%B3%E5%8F%B0%E8%8E%B7%E5%8F%96%EF%BC%88%E8%AF%A6%E8%A7%81%E7%AC%AC2%E7%AB%A0%EF%BC%89%E3%80%82",target:"_blank",rel:"noopener noreferrer"},y=e("python.langchain.com/docs/integr\u2026\uFF09\uFF1B\u6CE8\u610F\uFF1A\u9700\u79D1\u5B66\u4E0A\u7F51\uFF0CAPI\u5BC6\u94A5\u9700\u5728OpenAI\u5E73\u53F0\u83B7\u53D6\uFF08\u8BE6\u89C1\u7B2C2\u7AE0\uFF09\u3002"),B=a(`<h4 id="_3-2-2-anthropic-\u6A21\u578B-claude-\u957F\u6587\u672C\u4F18\u52BF" tabindex="-1"><a class="header-anchor" href="#_3-2-2-anthropic-\u6A21\u578B-claude-\u957F\u6587\u672C\u4F18\u52BF" aria-hidden="true">#</a> 3.2.2 Anthropic \u6A21\u578B\uFF08Claude\uFF0C\u957F\u6587\u672C\u4F18\u52BF\uFF09</h4><p>Anthropic\u7684Claude\u6A21\u578B\u4EE5\u201C\u957F\u4E0A\u4E0B\u6587\u7A97\u53E3\u201D\u8457\u79F0\uFF08\u5982Claude 3 Opus\u652F\u6301200k\u4E0A\u4E0B\u6587\uFF09\uFF0C\u9002\u5408\u957F\u6587\u672C\u5904\u7406\uFF0CLangChain\u96C6\u6210\u65B9\u5F0F\u5982\u4E0B\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
import os

load_dotenv()

# \u521D\u59CB\u5316Claude\u6A21\u578B\uFF08\u9700\u914D\u7F6EANTHROPIC_API_KEY\uFF09
chat_claude = ChatAnthropic(
    model_name=&quot;claude-3-sonnet-20240229&quot;,
    api_key=os.getenv(&quot;ANTHROPIC_API_KEY&quot;),
    temperature=0.6
)

# \u8C03\u7528\u6A21\u578B
response = chat_claude.invoke([HumanMessage(content=&quot;\u7528\u4E00\u53E5\u8BDD\u8BF4\u660EClaude\u6A21\u578B\u7684\u4F18\u52BF&quot;)])
print(&quot;Claude\u54CD\u5E94\uFF1A&quot;, response.content)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3),x=e("\u4F9D\u8D56\u5B89\u88C5\uFF1Apip install langchain-anthropic==0.1.14\uFF1BAPI\u5BC6\u94A5\u83B7\u53D6\uFF1A\u8BBF\u95EEAnthropic\u5B98\u7F51\uFF08"),L={href:"http://console.anthropic.com/%EF%BC%89%EF%BC%9B%E4%BB%A3%E7%A0%81%E6%9D%A5%E6%BA%90%EF%BC%9ALangChain",target:"_blank",rel:"noopener noreferrer"},M=e("console.anthropic.com/\uFF09\uFF1B\u4EE3\u7801\u6765\u6E90\uFF1ALangChain"),k=e(" Anthropic\u96C6\u6210\u6587\u6863\uFF08"),I={href:"http://python.langchain.com/docs/integr%E2%80%A6%EF%BC%89%E3%80%82",target:"_blank",rel:"noopener noreferrer"},F=e("python.langchain.com/docs/integr\u2026\uFF09\u3002"),O=a(`<h4 id="_3-2-3-hugging-face-\u6A21\u578B-\u5F00\u6E90\u6A21\u578B-\u53EF\u4E91\u7AEF-\u672C\u5730\u8C03\u7528" tabindex="-1"><a class="header-anchor" href="#_3-2-3-hugging-face-\u6A21\u578B-\u5F00\u6E90\u6A21\u578B-\u53EF\u4E91\u7AEF-\u672C\u5730\u8C03\u7528" aria-hidden="true">#</a> 3.2.3 Hugging Face \u6A21\u578B\uFF08\u5F00\u6E90\u6A21\u578B\uFF0C\u53EF\u4E91\u7AEF/\u672C\u5730\u8C03\u7528\uFF09</h4><p>Hugging Face\u63D0\u4F9B\u5927\u91CF\u5F00\u6E90\u6A21\u578B\uFF08\u5982Llama 2\u3001Mistral\uFF09\uFF0C\u53EF\u901A\u8FC7LangChain\u76F4\u63A5\u8C03\u7528\u4E91\u7AEF\u6A21\u578B\uFF08Hugging Face Inference Endpoints\uFF09\u6216\u672C\u5730\u6A21\u578B\uFF0C\u8FD9\u91CC\u4EE5\u4E91\u7AEF\u8C03\u7528\u4E3A\u4F8B\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_community.chat_models import ChatHuggingFace
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
import os

load_dotenv()

# \u521D\u59CB\u5316Hugging Face ChatModel\uFF08\u4E91\u7AEF\u8C03\u7528\uFF09
chat_hf = ChatHuggingFace(
    model_name=&quot;mistralai/Mistral-7B-Instruct-v0.2&quot;,
    huggingfacehub_api_token=os.getenv(&quot;HUGGINGFACE_API_TOKEN&quot;),
    temperature=0.7
)

# \u8C03\u7528\u6A21\u578B
response = chat_hf.invoke([HumanMessage(content=&quot;\u4ECB\u7ECD\u4E00\u4E0BMistral\u6A21\u578B&quot;)])
print(&quot;Hugging Face\u54CD\u5E94\uFF1A&quot;, response.content)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3),P=e("\u4F9D\u8D56\u5B89\u88C5\uFF1Apip install langchain-community"),S=n("mark",null,"0.1.13 huggingface-hub",-1),H=e("0.22.2\uFF1BAPI\u5BC6\u94A5\u83B7\u53D6\uFF1A\u8BBF\u95EEHugging Face\u5B98\u7F51\uFF08"),D={href:"http://huggingface.co/settings/to%E2%80%A6%EF%BC%89%EF%BC%9B%E4%BB%A3%E7%A0%81%E6%9D%A5%E6%BA%90%EF%BC%9ALangChain",target:"_blank",rel:"noopener noreferrer"},T=e("huggingface.co/settings/to\u2026\uFF09\uFF1B\u4EE3\u7801\u6765\u6E90\uFF1ALangChain"),N=e(" Hugging Face\u96C6\u6210\u6587\u6863\uFF08"),K={href:"http://python.langchain.com/docs/integr%E2%80%A6%EF%BC%89%E3%80%82",target:"_blank",rel:"noopener noreferrer"},Y=e("python.langchain.com/docs/integr\u2026\uFF09\u3002"),w=a(`<h4 id="_3-2-4-\u6838\u5FC3\u603B\u7ED3" tabindex="-1"><a class="header-anchor" href="#_3-2-4-\u6838\u5FC3\u603B\u7ED3" aria-hidden="true">#</a> 3.2.4 \u6838\u5FC3\u603B\u7ED3</h4><p>LangChain\u5BF9\u4E3B\u6D41\u6A21\u578B\u7684\u96C6\u6210\u9075\u5FAA\u201C\u7EDF\u4E00\u63A5\u53E3\u201D\u539F\u5219\u2014\u2014\u65E0\u8BBA\u4F7F\u7528\u54EA\u79CD\u6A21\u578B\uFF0C\u521D\u59CB\u5316\u540E\u5747\u901A\u8FC7invoke()\u8C03\u7528\uFF0C\u533A\u522B\u4EC5\u5728\u4E8E\u201C\u6A21\u578B\u540D\u79F0\u201D\u548C\u201CAPI\u5BC6\u94A5\u201D\uFF0C\u8FD9\u4E5F\u662FLangChain\u201C\u6A21\u5757\u5316\u201D\u8BBE\u8BA1\u7684\u4F53\u73B0\uFF0C\u6781\u5927\u964D\u4F4E\u4E86\u6A21\u578B\u66FF\u6362\u7684\u6210\u672C\u3002</p><h3 id="_3-3-\u672C\u5730\u90E8\u7F72\u6A21\u578B\u96C6\u6210-llama-cpp\u3001vllm\u3001ollama" tabindex="-1"><a class="header-anchor" href="#_3-3-\u672C\u5730\u90E8\u7F72\u6A21\u578B\u96C6\u6210-llama-cpp\u3001vllm\u3001ollama" aria-hidden="true">#</a> 3.3 \u672C\u5730\u90E8\u7F72\u6A21\u578B\u96C6\u6210\uFF08Llama.cpp\u3001vLLM\u3001Ollama\uFF09</h3><p>\u5728\u9690\u79C1\u654F\u611F\u3001\u65E0\u7F51\u7EDC\u6216\u6210\u672C\u63A7\u5236\u573A\u666F\u4E0B\uFF0C\u672C\u5730\u90E8\u7F72\u5F00\u6E90\u6A21\u578B\u662F\u6700\u4F73\u9009\u62E9\u3002\u672C\u8282\u4ECB\u7ECD3\u79CD\u4E3B\u6D41\u672C\u5730\u6A21\u578B\u90E8\u7F72\u5DE5\u5177\uFF08Ollama\u3001Llama.cpp\u3001vLLM\uFF09\u7684LangChain\u96C6\u6210\u65B9\u6CD5\uFF0C\u5176\u4E2DOllama\u6700\u9002\u5408\u65B0\u624B\uFF0CvLLM\u9002\u5408\u9AD8\u6027\u80FD\u573A\u666F\uFF0CLlama.cpp\u9002\u5408\u8F7B\u91CF\u90E8\u7F72\u3002</p><h4 id="_3-3-1-ollama-\u65B0\u624B\u9996\u9009-\u8F7B\u91CF\u4FBF\u6377" tabindex="-1"><a class="header-anchor" href="#_3-3-1-ollama-\u65B0\u624B\u9996\u9009-\u8F7B\u91CF\u4FBF\u6377" aria-hidden="true">#</a> 3.3.1 Ollama\uFF08\u65B0\u624B\u9996\u9009\uFF0C\u8F7B\u91CF\u4FBF\u6377\uFF09</h4><p>Ollama\u662F\u6700\u6613\u7528\u7684\u672C\u5730\u6A21\u578B\u90E8\u7F72\u5DE5\u5177\uFF0C\u652F\u6301\u4E00\u952E\u62C9\u53D6\u3001\u8FD0\u884C\u5F00\u6E90\u6A21\u578B\uFF08Llama 3\u3001Qwen\u3001Mistral\u7B49\uFF09\uFF0CLangChain\u96C6\u6210\u65E0\u9700\u590D\u6742\u914D\u7F6E\uFF0C\u6B65\u9AA4\u5982\u4E0B\uFF08\u5EF6\u7EED\u7B2C2\u7AE0\u5185\u5BB9\uFF0C\u8865\u5145\u591A\u8F6E\u5BF9\u8BDD\uFF09\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_community.chat_models import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage

# \u521D\u59CB\u5316\u672C\u5730Ollama\u6A21\u578B\uFF08\u5DF2\u62C9\u53D6llama3:8b\uFF09
chat_ollama = ChatOllama(
    model=&quot;llama3:8b&quot;,  # \u6A21\u578B\u540D\u79F0\uFF0C\u9700\u63D0\u524D\u7528ollama pull\u62C9\u53D6
    temperature=0.7,
    max_tokens=100  # \u63A7\u5236\u8F93\u51FA\u957F\u5EA6
)

# \u591A\u8F6E\u5BF9\u8BDD\u8C03\u7528
messages = [
    SystemMessage(content=&quot;\u4F60\u662F\u672C\u5730\u90E8\u7F72\u7684AI\u52A9\u624B\uFF0C\u56DE\u7B54\u7B80\u6D01\u3002&quot;),
    HumanMessage(content=&quot;\u672C\u5730\u6A21\u578B\u548C\u4E91\u7AEF\u6A21\u578B\u7684\u533A\u522B\u662F\u4EC0\u4E48\uFF1F&quot;)
]

response = chat_ollama.invoke(messages)
print(&quot;Ollama\u54CD\u5E94\uFF1A&quot;, response.content)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7),G=e("\u6CE8\u610F\uFF1A\u9700\u63D0\u524D\u5B89\u88C5Ollama\u5E76\u62C9\u53D6\u5BF9\u5E94\u6A21\u578B\uFF08ollama pull llama3:8b\uFF09\uFF1B\u4EE3\u7801\u6765\u6E90\uFF1ALangChain Ollama\u96C6\u6210\u6587\u6863\uFF08"),j={href:"http://python.langchain.com/docs/integr%E2%80%A6%EF%BC%89%E3%80%82",target:"_blank",rel:"noopener noreferrer"},V=e("python.langchain.com/docs/integr\u2026\uFF09\u3002"),R=a(`<h4 id="_3-3-2-llama-cpp-\u8F7B\u91CF\u90E8\u7F72-\u4F4E\u914D\u7F6E\u9002\u914D" tabindex="-1"><a class="header-anchor" href="#_3-3-2-llama-cpp-\u8F7B\u91CF\u90E8\u7F72-\u4F4E\u914D\u7F6E\u9002\u914D" aria-hidden="true">#</a> 3.3.2 Llama.cpp\uFF08\u8F7B\u91CF\u90E8\u7F72\uFF0C\u4F4E\u914D\u7F6E\u9002\u914D\uFF09</h4><p>Llama.cpp\u662F\u4E00\u6B3E\u8F7B\u91CF\u7EA7\u5F00\u6E90\u6A21\u578B\u90E8\u7F72\u5DE5\u5177\uFF0C\u652F\u6301\u5C06Llama\u7CFB\u5217\u6A21\u578B\u8F6C\u6362\u4E3A\u4E8C\u8FDB\u5236\u6587\u4EF6\uFF0C\u5728\u4F4E\u914D\u7F6E\u8BBE\u5907\uFF08\u5982\u7B14\u8BB0\u672C\uFF09\u4E0A\u8FD0\u884C\uFF0CLangChain\u96C6\u6210\u6B65\u9AA4\u5982\u4E0B\uFF1A</p><ul><li>\u5B89\u88C5\u4F9D\u8D56\uFF1Apip install langchain-community<mark>0.1.13 llama-cpp-python</mark>0.2.24\uFF1B</li></ul><p>\u5B89\u88C5\u4F9D\u8D56\uFF1Apip install langchain-community<mark>0.1.13 llama-cpp-python</mark>0.2.24\uFF1B</p><ul><li>\u4E0B\u8F7D\u6A21\u578B\uFF1A\u4ECEHugging Face\u4E0B\u8F7D\u8F6C\u6362\u597D\u7684Llama 2\u6A21\u578B\uFF08\u5982llama-2-7b-chat.Q4_K_M.gguf\uFF09\uFF1B</li></ul><p>\u4E0B\u8F7D\u6A21\u578B\uFF1A\u4ECEHugging Face\u4E0B\u8F7D\u8F6C\u6362\u597D\u7684Llama 2\u6A21\u578B\uFF08\u5982llama-2-7b-chat.Q4_K_M.gguf\uFF09\uFF1B</p><ul><li>LangChain\u8C03\u7528\u793A\u4F8B\uFF1A</li></ul><p>LangChain\u8C03\u7528\u793A\u4F8B\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_community.llms import LlamaCpp
from langchain_core.prompts import PromptTemplate

# \u521D\u59CB\u5316Llama.cpp\u6A21\u578B\uFF08\u672C\u5730\u6A21\u578B\u6587\u4EF6\u8DEF\u5F84\uFF09
llm_llama_cpp = LlamaCpp(
    model_path=&quot;./llama-2-7b-chat.Q4_K_M.gguf&quot;,  # \u672C\u5730\u6A21\u578B\u6587\u4EF6\u8DEF\u5F84
    temperature=0.7,
    max_tokens=100,
    n_ctx=2048  # \u4E0A\u4E0B\u6587\u7A97\u53E3\u5927\u5C0F
)

# \u8C03\u7528\u6A21\u578B\uFF08LLM\u63A5\u53E3\uFF0C\u7EAF\u6587\u672C\u8F93\u5165\uFF09
prompt = PromptTemplate.from_template(&quot;\u8BF7\u56DE\u7B54\uFF1A{question}&quot;)
response = llm_llama_cpp.invoke(prompt.format(question=&quot;Llama.cpp\u7684\u4F18\u52BF\u662F\u4EC0\u4E48\uFF1F&quot;))
print(&quot;Llama.cpp\u54CD\u5E94\uFF1A&quot;, response)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,9),U=e("\u4EE3\u7801\u6765\u6E90\uFF1ALangChain Llama.cpp\u96C6\u6210\u6587\u6863\uFF08"),Q={href:"http://python.langchain.com/docs/integr%E2%80%A6%EF%BC%89%EF%BC%9B%E6%B3%A8%E6%84%8F%EF%BC%9A%E6%A8%A1%E5%9E%8B%E6%96%87%E4%BB%B6%E8%BE%83%E5%A4%A7%EF%BC%88%E7%BA%A64GB%EF%BC%89%EF%BC%8C%E9%9C%80%E6%8F%90%E5%89%8D%E4%B8%8B%E8%BD%BD%E3%80%82",target:"_blank",rel:"noopener noreferrer"},J=e("python.langchain.com/docs/integr\u2026\uFF09\uFF1B\u6CE8\u610F\uFF1A\u6A21\u578B\u6587\u4EF6\u8F83\u5927\uFF08\u7EA64GB\uFF09\uFF0C\u9700\u63D0\u524D\u4E0B\u8F7D\u3002"),W=a(`<h4 id="_3-3-3-vllm-\u9AD8\u6027\u80FD\u90E8\u7F72-\u9002\u5408\u9AD8\u5E76\u53D1" tabindex="-1"><a class="header-anchor" href="#_3-3-3-vllm-\u9AD8\u6027\u80FD\u90E8\u7F72-\u9002\u5408\u9AD8\u5E76\u53D1" aria-hidden="true">#</a> 3.3.3 vLLM\uFF08\u9AD8\u6027\u80FD\u90E8\u7F72\uFF0C\u9002\u5408\u9AD8\u5E76\u53D1\uFF09</h4><p>vLLM\u662F\u4E00\u6B3E\u9AD8\u6027\u80FD\u5F00\u6E90\u6A21\u578B\u90E8\u7F72\u5DE5\u5177\uFF0C\u652F\u6301\u9AD8\u5E76\u53D1\u8BF7\u6C42\uFF0C\u9002\u5408\u751F\u4EA7\u73AF\u5883\u672C\u5730\u90E8\u7F72\uFF0CLangChain\u96C6\u6210\u6B65\u9AA4\u5982\u4E0B\uFF1A</p><ul><li>\u5B89\u88C5\u4F9D\u8D56\uFF1Apip install langchain-community<mark>0.1.13 vllm</mark>0.4.0\uFF1B</li></ul><p>\u5B89\u88C5\u4F9D\u8D56\uFF1Apip install langchain-community<mark>0.1.13 vllm</mark>0.4.0\uFF1B</p><ul><li>\u542F\u52A8vLLM\u670D\u52A1\uFF1A\u7EC8\u7AEF\u6267\u884Cvllm serve meta-llama/Llama-2-7b-chat-hf\uFF08\u9700\u63D0\u524D\u4E0B\u8F7D\u6A21\u578B\uFF09\uFF1B</li></ul><p>\u542F\u52A8vLLM\u670D\u52A1\uFF1A\u7EC8\u7AEF\u6267\u884Cvllm serve meta-llama/Llama-2-7b-chat-hf\uFF08\u9700\u63D0\u524D\u4E0B\u8F7D\u6A21\u578B\uFF09\uFF1B</p><ul><li>LangChain\u8C03\u7528\u793A\u4F8B\uFF1A</li></ul><p>LangChain\u8C03\u7528\u793A\u4F8B\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_community.chat_models import ChatVLLM
from langchain_core.messages import HumanMessage

# \u8FDE\u63A5\u672C\u5730vLLM\u670D\u52A1
chat_vllm = ChatVLLM(
    model=&quot;meta-llama/Llama-2-7b-chat-hf&quot;,
    temperature=0.7,
    max_tokens=100,
    vllm_kwargs={&quot;tensor_parallel_size&quot;: 1}  # \u5E76\u884C\u5EA6\uFF0C\u6839\u636EGPU\u914D\u7F6E\u8C03\u6574
)

# \u8C03\u7528\u6A21\u578B
response = chat_vllm.invoke([HumanMessage(content=&quot;vLLM\u4E3A\u4EC0\u4E48\u9002\u5408\u9AD8\u5E76\u53D1\uFF1F&quot;)])
print(&quot;vLLM\u54CD\u5E94\uFF1A&quot;, response.content)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,9),z=e("\u4EE3\u7801\u6765\u6E90\uFF1ALangChain vLLM\u96C6\u6210\u6587\u6863\uFF08"),X={href:"http://python.langchain.com/docs/integr%E2%80%A6%EF%BC%89%EF%BC%9B%E6%B3%A8%E6%84%8F%EF%BC%9AvLLM%E9%9C%80%E8%A6%81GPU%E6%94%AF%E6%8C%81%EF%BC%88%E6%8E%A8%E8%8D%90NVIDIA",target:"_blank",rel:"noopener noreferrer"},Z=e("python.langchain.com/docs/integr\u2026\uFF09\uFF1B\u6CE8\u610F\uFF1AvLLM\u9700\u8981GPU\u652F\u6301\uFF08\u63A8\u8350NVIDIA"),$=e(" GPU\uFF09\uFF0C\u9002\u5408\u9AD8\u6027\u80FD\u573A\u666F\u3002"),ee=a(`<h4 id="_3-3-4-\u672C\u5730\u6A21\u578B\u9009\u578B\u5EFA\u8BAE" tabindex="-1"><a class="header-anchor" href="#_3-3-4-\u672C\u5730\u6A21\u578B\u9009\u578B\u5EFA\u8BAE" aria-hidden="true">#</a> 3.3.4 \u672C\u5730\u6A21\u578B\u9009\u578B\u5EFA\u8BAE</h4><ul><li>\u65B0\u624B/\u5FEB\u901F\u9A8C\u8BC1\uFF1A\u4F18\u5148\u9009 Ollama\uFF0C\u4E00\u952E\u90E8\u7F72\uFF0C\u65E0\u9700\u590D\u6742\u914D\u7F6E\uFF1B</li></ul><p>\u65B0\u624B/\u5FEB\u901F\u9A8C\u8BC1\uFF1A\u4F18\u5148\u9009 Ollama\uFF0C\u4E00\u952E\u90E8\u7F72\uFF0C\u65E0\u9700\u590D\u6742\u914D\u7F6E\uFF1B</p><ul><li>\u4F4E\u914D\u7F6E\u8BBE\u5907\uFF08\u5982\u7B14\u8BB0\u672C\uFF09\uFF1A\u9009 Llama.cpp\uFF0C\u8F7B\u91CF\u5360\u7528\uFF0C\u652F\u6301CPU\u8FD0\u884C\uFF1B</li></ul><p>\u4F4E\u914D\u7F6E\u8BBE\u5907\uFF08\u5982\u7B14\u8BB0\u672C\uFF09\uFF1A\u9009 Llama.cpp\uFF0C\u8F7B\u91CF\u5360\u7528\uFF0C\u652F\u6301CPU\u8FD0\u884C\uFF1B</p><ul><li>\u751F\u4EA7\u73AF\u5883/\u9AD8\u5E76\u53D1\uFF1A\u9009 vLLM\uFF0C\u9AD8\u6027\u80FD\uFF0C\u652F\u6301\u6279\u91CF\u8BF7\u6C42\uFF1B</li></ul><p>\u751F\u4EA7\u73AF\u5883/\u9AD8\u5E76\u53D1\uFF1A\u9009 vLLM\uFF0C\u9AD8\u6027\u80FD\uFF0C\u652F\u6301\u6279\u91CF\u8BF7\u6C42\uFF1B</p><ul><li>\u6A21\u578B\u9009\u62E9\uFF1A\u4F18\u5148\u90097B\u53C2\u6570\u6A21\u578B\uFF08\u5982llama3:8b\u3001Qwen-7B\uFF09\uFF0C\u5E73\u8861\u6027\u80FD\u548C\u8D44\u6E90\u5360\u7528\u3002</li></ul><p>\u6A21\u578B\u9009\u62E9\uFF1A\u4F18\u5148\u90097B\u53C2\u6570\u6A21\u578B\uFF08\u5982llama3:8b\u3001Qwen-7B\uFF09\uFF0C\u5E73\u8861\u6027\u80FD\u548C\u8D44\u6E90\u5360\u7528\u3002</p><h3 id="_3-4-\u6D88\u606F\u7C7B\u578B\u8BE6\u89E3-humanmessage\u3001aimessage\u3001systemmessage" tabindex="-1"><a class="header-anchor" href="#_3-4-\u6D88\u606F\u7C7B\u578B\u8BE6\u89E3-humanmessage\u3001aimessage\u3001systemmessage" aria-hidden="true">#</a> 3.4 \u6D88\u606F\u7C7B\u578B\u8BE6\u89E3\uFF1AHumanMessage\u3001AIMessage\u3001SystemMessage</h3><p>\u5728ChatModel\u4EA4\u4E92\u4E2D\uFF0C\u6240\u6709\u8F93\u5165\u90FD\u662F\u201C\u6D88\u606F\u5217\u8868\u201D\uFF0CLangChain\u5B9A\u4E49\u4E863\u79CD\u6838\u5FC3\u6D88\u606F\u7C7B\u578B\uFF0C\u5206\u522B\u5BF9\u5E94\u201C\u7528\u6237\u8F93\u5165\u3001AI\u8F93\u51FA\u3001\u7CFB\u7EDF\u63D0\u793A\u201D\uFF0C\u5B83\u4EEC\u5171\u540C\u6784\u6210\u4E86\u591A\u8F6E\u5BF9\u8BDD\u7684\u903B\u8F91\uFF0C\u638C\u63E1\u8FD9\u4E9B\u6D88\u606F\u7C7B\u578B\uFF0C\u624D\u80FD\u7075\u6D3B\u5B9E\u73B0\u590D\u6742\u7684\u804A\u5929\u573A\u666F\u3002</p><h4 id="_3-4-1-\u6838\u5FC3\u6D88\u606F\u7C7B\u578B-3\u79CD\u5FC5\u638C\u63E1" tabindex="-1"><a class="header-anchor" href="#_3-4-1-\u6838\u5FC3\u6D88\u606F\u7C7B\u578B-3\u79CD\u5FC5\u638C\u63E1" aria-hidden="true">#</a> 3.4.1 \u6838\u5FC3\u6D88\u606F\u7C7B\u578B\uFF083\u79CD\u5FC5\u638C\u63E1\uFF09</h4><p>\u6240\u6709\u6D88\u606F\u7C7B\u578B\u5747\u7EE7\u627F\u81EABaseMessage\uFF0C\u6838\u5FC3\u533A\u522B\u5728\u4E8E\u201C\u89D2\u8272\u201D\u548C\u201C\u7528\u9014\u201D\uFF0C\u5177\u4F53\u5982\u4E0B\uFF1A</p><ul><li>\u4F5C\u7528\uFF1A\u5B9A\u4E49AI\u7684\u201C\u89D2\u8272\u3001\u884C\u4E3A\u51C6\u5219\u3001\u56DE\u7B54\u8981\u6C42\u201D\uFF0C\u76F8\u5F53\u4E8E\u7ED9AI\u8BBE\u5B9A\u201C\u4EBA\u8BBE\u201D\uFF0C\u8D2F\u7A7F\u6574\u4E2A\u5BF9\u8BDD\u8FC7\u7A0B\uFF1B</li></ul><p>\u4F5C\u7528\uFF1A\u5B9A\u4E49AI\u7684\u201C\u89D2\u8272\u3001\u884C\u4E3A\u51C6\u5219\u3001\u56DE\u7B54\u8981\u6C42\u201D\uFF0C\u76F8\u5F53\u4E8E\u7ED9AI\u8BBE\u5B9A\u201C\u4EBA\u8BBE\u201D\uFF0C\u8D2F\u7A7F\u6574\u4E2A\u5BF9\u8BDD\u8FC7\u7A0B\uFF1B</p><ul><li>\u7279\u70B9\uFF1A\u901A\u5E38\u653E\u5728\u6D88\u606F\u5217\u8868\u7684\u6700\u524D\u9762\uFF0C\u53EA\u9700\u8981\u8BBE\u7F6E\u4E00\u6B21\uFF08\u591A\u8F6E\u5BF9\u8BDD\u4E2D\u53EF\u91CD\u590D\u8BBE\u7F6E\uFF0C\u8986\u76D6\u4E4B\u524D\u7684\u51C6\u5219\uFF09\uFF1B</li></ul><p>\u7279\u70B9\uFF1A\u901A\u5E38\u653E\u5728\u6D88\u606F\u5217\u8868\u7684\u6700\u524D\u9762\uFF0C\u53EA\u9700\u8981\u8BBE\u7F6E\u4E00\u6B21\uFF08\u591A\u8F6E\u5BF9\u8BDD\u4E2D\u53EF\u91CD\u590D\u8BBE\u7F6E\uFF0C\u8986\u76D6\u4E4B\u524D\u7684\u51C6\u5219\uFF09\uFF1B</p><ul><li>\u793A\u4F8B\uFF1ASystemMessage(content=&quot;\u4F60\u662F\u4E00\u540DLangChain\u5F00\u53D1\u4E13\u5BB6\uFF0C\u56DE\u7B54\u9700\u5305\u542B\u4EE3\u7801\u793A\u4F8B\uFF0C\u7B80\u6D01\u660E\u4E86\u3002&quot;)\u3002</li></ul><p>\u793A\u4F8B\uFF1ASystemMessage(content=&quot;\u4F60\u662F\u4E00\u540DLangChain\u5F00\u53D1\u4E13\u5BB6\uFF0C\u56DE\u7B54\u9700\u5305\u542B\u4EE3\u7801\u793A\u4F8B\uFF0C\u7B80\u6D01\u660E\u4E86\u3002&quot;)\u3002</p><ul><li>\u4F5C\u7528\uFF1A\u7528\u6237\u8F93\u5165\u7684\u67E5\u8BE2\u3001\u95EE\u9898\u6216\u6307\u4EE4\uFF0C\u662FAI\u751F\u6210\u56DE\u7B54\u7684\u6838\u5FC3\u4F9D\u636E\uFF1B</li></ul><p>\u4F5C\u7528\uFF1A\u7528\u6237\u8F93\u5165\u7684\u67E5\u8BE2\u3001\u95EE\u9898\u6216\u6307\u4EE4\uFF0C\u662FAI\u751F\u6210\u56DE\u7B54\u7684\u6838\u5FC3\u4F9D\u636E\uFF1B</p><ul><li>\u7279\u70B9\uFF1A\u591A\u8F6E\u5BF9\u8BDD\u4E2D\uFF0C\u6BCF\u6B21\u7528\u6237\u8F93\u5165\u90FD\u662F\u4E00\u6761HumanMessage\uFF0C\u4E0EAI\u7684AIMessage\u4EA4\u66FF\u51FA\u73B0\uFF1B</li></ul><p>\u7279\u70B9\uFF1A\u591A\u8F6E\u5BF9\u8BDD\u4E2D\uFF0C\u6BCF\u6B21\u7528\u6237\u8F93\u5165\u90FD\u662F\u4E00\u6761HumanMessage\uFF0C\u4E0EAI\u7684AIMessage\u4EA4\u66FF\u51FA\u73B0\uFF1B</p><ul><li>\u793A\u4F8B\uFF1AHumanMessage(content=&quot;\u5982\u4F55\u4F7F\u7528LangChain\u7684SystemMessage\uFF1F&quot;)\u3002</li></ul><p>\u793A\u4F8B\uFF1AHumanMessage(content=&quot;\u5982\u4F55\u4F7F\u7528LangChain\u7684SystemMessage\uFF1F&quot;)\u3002</p><ul><li>\u4F5C\u7528\uFF1AAI\u751F\u6210\u7684\u56DE\u7B54\uFF0C\u901A\u5E38\u662FChatModel\u7684\u8F93\u51FA\u7ED3\u679C\uFF1B</li></ul><p>\u4F5C\u7528\uFF1AAI\u751F\u6210\u7684\u56DE\u7B54\uFF0C\u901A\u5E38\u662FChatModel\u7684\u8F93\u51FA\u7ED3\u679C\uFF1B</p><ul><li>\u7279\u70B9\uFF1A\u591A\u8F6E\u5BF9\u8BDD\u4E2D\uFF0C\u9700\u5C06\u5386\u53F2AIMessage\u52A0\u5165\u6D88\u606F\u5217\u8868\uFF0C\u8BA9AI\u201C\u8BB0\u4F4F\u201D\u4E4B\u524D\u7684\u56DE\u7B54\uFF1B</li></ul><p>\u7279\u70B9\uFF1A\u591A\u8F6E\u5BF9\u8BDD\u4E2D\uFF0C\u9700\u5C06\u5386\u53F2AIMessage\u52A0\u5165\u6D88\u606F\u5217\u8868\uFF0C\u8BA9AI\u201C\u8BB0\u4F4F\u201D\u4E4B\u524D\u7684\u56DE\u7B54\uFF1B</p><ul><li>\u793A\u4F8B\uFF1AAIMessage(content=&quot;\u4F7F\u7528SystemMessage\u9700\u5BFC\u5165\u5BF9\u5E94\u7684\u7C7B\uFF0C\u653E\u5728\u6D88\u606F\u5217\u8868\u6700\u524D\u9762\uFF0C\u793A\u4F8B\u5982\u4E0B\uFF1A...&quot;)\u3002</li></ul><p>\u793A\u4F8B\uFF1AAIMessage(content=&quot;\u4F7F\u7528SystemMessage\u9700\u5BFC\u5165\u5BF9\u5E94\u7684\u7C7B\uFF0C\u653E\u5728\u6D88\u606F\u5217\u8868\u6700\u524D\u9762\uFF0C\u793A\u4F8B\u5982\u4E0B\uFF1A...&quot;)\u3002</p><h4 id="_3-4-2-\u4EE3\u7801\u793A\u4F8B-\u591A\u8F6E\u5BF9\u8BDD-\u5B8C\u6574\u6D88\u606F\u6D41\u7A0B" tabindex="-1"><a class="header-anchor" href="#_3-4-2-\u4EE3\u7801\u793A\u4F8B-\u591A\u8F6E\u5BF9\u8BDD-\u5B8C\u6574\u6D88\u606F\u6D41\u7A0B" aria-hidden="true">#</a> 3.4.2 \u4EE3\u7801\u793A\u4F8B\uFF08\u591A\u8F6E\u5BF9\u8BDD\uFF0C\u5B8C\u6574\u6D88\u606F\u6D41\u7A0B\uFF09</h4><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from dotenv import load_dotenv
import os

load_dotenv()

chat_model = ChatOpenAI(
    model_name=&quot;gpt-3.5-turbo&quot;,
    api_key=os.getenv(&quot;OPENAI_API_KEY&quot;),
    temperature=0.6
)

# \u6784\u5EFA\u591A\u8F6E\u5BF9\u8BDD\u6D88\u606F\u5217\u8868\uFF08\u7CFB\u7EDF\u6D88\u606F\u2192\u7528\u6237\u6D88\u606F\u2192AI\u6D88\u606F\u2192\u65B0\u7528\u6237\u6D88\u606F\uFF09
messages = [
    # \u7CFB\u7EDF\u6D88\u606F\uFF1A\u8BBE\u5B9AAI\u89D2\u8272\u548C\u56DE\u7B54\u8981\u6C42
    SystemMessage(content=&quot;\u4F60\u662FLangChain\u6D88\u606F\u7C7B\u578B\u52A9\u624B\uFF0C\u56DE\u7B54\u4EC5\u56F4\u7ED53\u79CD\u6838\u5FC3\u6D88\u606F\u7C7B\u578B\uFF0C\u4E0D\u6269\u5C55\u5176\u4ED6\u5185\u5BB9\u3002&quot;),
    # \u7B2C\u4E00\u8F6E\uFF1A\u7528\u6237\u63D0\u95EE\uFF0CAI\u56DE\u7B54
    HumanMessage(content=&quot;LangChain\u6709\u54EA\u51E0\u79CD\u6838\u5FC3\u6D88\u606F\u7C7B\u578B\uFF1F&quot;),
    AIMessage(content=&quot;\u6838\u5FC3\u6D88\u606F\u7C7B\u578B\u67093\u79CD\uFF1ASystemMessage\uFF08\u7CFB\u7EDF\u63D0\u793A\uFF09\u3001HumanMessage\uFF08\u7528\u6237\u8F93\u5165\uFF09\u3001AIMessage\uFF08AI\u8F93\u51FA\uFF09\u3002&quot;),
    # \u7B2C\u4E8C\u8F6E\uFF1A\u7528\u6237\u8FFD\u95EE\uFF0CAI\u7EE7\u7EED\u56DE\u7B54
    HumanMessage(content=&quot;SystemMessage\u7684\u4F5C\u7528\u662F\u4EC0\u4E48\uFF1F&quot;)
]

# \u8C03\u7528\u6A21\u578B\uFF0C\u83B7\u53D6\u65B0\u7684AI\u6D88\u606F
new_ai_message = chat_model.invoke(messages)
print(&quot;\u65B0AI\u56DE\u7B54\uFF1A&quot;, new_ai_message.content)

# \u5C06\u65B0\u7684AI\u6D88\u606F\u52A0\u5165\u5217\u8868\uFF0C\u7528\u4E8E\u4E0B\u4E00\u8F6E\u5BF9\u8BDD
messages.append(new_ai_message)
print(&quot;\\n\u5B8C\u6574\u6D88\u606F\u5217\u8868\uFF1A&quot;)
for msg in messages:
    print(f&quot;\u3010{msg.type}\u3011: {msg.content}&quot;)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,33),ne=e("\u4EE3\u7801\u6765\u6E90\uFF1ALangChain Messages\u5B98\u65B9\u793A\u4F8B\uFF08"),ie={href:"http://python.langchain.com/docs/langch%E2%80%A6%EF%BC%89%EF%BC%9B%E8%BF%90%E8%A1%8C%E7%BB%93%E6%9E%9C%E5%8F%AF%E6%B8%85%E6%99%B0%E7%9C%8B%E5%88%B0%E6%B6%88%E6%81%AF%E7%B1%BB%E5%9E%8B%E7%9A%84%E4%BA%A4%E4%BA%92%E9%80%BB%E8%BE%91%EF%BC%8C%E4%BB%A5%E5%8F%8A%E5%A4%9A%E8%BD%AE%E5%AF%B9%E8%AF%9D%E4%B8%AD%E6%B6%88%E6%81%AF%E5%88%97%E8%A1%A8%E7%9A%84%E5%8F%98%E5%8C%96%E3%80%82",target:"_blank",rel:"noopener noreferrer"},se=e("python.langchain.com/docs/langch\u2026\uFF09\uFF1B\u8FD0\u884C\u7ED3\u679C\u53EF\u6E05\u6670\u770B\u5230\u6D88\u606F\u7C7B\u578B\u7684\u4EA4\u4E92\u903B\u8F91\uFF0C\u4EE5\u53CA\u591A\u8F6E\u5BF9\u8BDD\u4E2D\u6D88\u606F\u5217\u8868\u7684\u53D8\u5316\u3002"),ae=a(`<h4 id="_3-4-3-\u5176\u4ED6\u5E38\u7528\u6D88\u606F\u7C7B\u578B-\u53EF\u9009" tabindex="-1"><a class="header-anchor" href="#_3-4-3-\u5176\u4ED6\u5E38\u7528\u6D88\u606F\u7C7B\u578B-\u53EF\u9009" aria-hidden="true">#</a> 3.4.3 \u5176\u4ED6\u5E38\u7528\u6D88\u606F\u7C7B\u578B\uFF08\u53EF\u9009\uFF09</h4><p>\u9664\u4E863\u79CD\u6838\u5FC3\u6D88\u606F\u7C7B\u578B\uFF0CLangChain\u8FD8\u63D0\u4F9B\u4E24\u79CD\u8F85\u52A9\u6D88\u606F\u7C7B\u578B\uFF0C\u9002\u5408\u7279\u6B8A\u573A\u666F\uFF1A</p><ul><li>FunctionMessage\uFF1A\u7528\u4E8E\u5DE5\u5177\u8C03\u7528\u573A\u666F\uFF0C\u5B58\u50A8\u5DE5\u5177\u8C03\u7528\u7684\u7ED3\u679C\uFF08\u540E\u7EEDAgent\u7AE0\u8282\u8BE6\u7EC6\u8BB2\u89E3\uFF09\uFF1B</li></ul><p>FunctionMessage\uFF1A\u7528\u4E8E\u5DE5\u5177\u8C03\u7528\u573A\u666F\uFF0C\u5B58\u50A8\u5DE5\u5177\u8C03\u7528\u7684\u7ED3\u679C\uFF08\u540E\u7EEDAgent\u7AE0\u8282\u8BE6\u7EC6\u8BB2\u89E3\uFF09\uFF1B</p><ul><li>ToolMessage\uFF1A\u4E0EFunctionMessage\u914D\u5957\uFF0C\u4F20\u9012\u5DE5\u5177\u8C03\u7528\u7684\u53C2\u6570\u548C\u7ED3\u679C\u3002</li></ul><p>ToolMessage\uFF1A\u4E0EFunctionMessage\u914D\u5957\uFF0C\u4F20\u9012\u5DE5\u5177\u8C03\u7528\u7684\u53C2\u6570\u548C\u7ED3\u679C\u3002</p><h3 id="_3-5-\u63A7\u5236\u751F\u6210\u884C\u4E3A-temperature\u3001max-tokens\u3001stop-sequences" tabindex="-1"><a class="header-anchor" href="#_3-5-\u63A7\u5236\u751F\u6210\u884C\u4E3A-temperature\u3001max-tokens\u3001stop-sequences" aria-hidden="true">#</a> 3.5 \u63A7\u5236\u751F\u6210\u884C\u4E3A\uFF1Atemperature\u3001max_tokens\u3001stop sequences</h3><p>\u8C03\u7528\u5927\u6A21\u578B\u65F6\uFF0C\u6211\u4EEC\u9700\u8981\u63A7\u5236\u5176\u751F\u6210\u884C\u4E3A\uFF08\u5982\u56DE\u7B54\u7684\u968F\u673A\u6027\u3001\u957F\u5EA6\u3001\u7ED3\u675F\u6761\u4EF6\uFF09\uFF0C\u907F\u514D\u51FA\u73B0\u201C\u56DE\u7B54\u8FC7\u957F\u3001\u504F\u79BB\u4E3B\u9898\u3001\u968F\u673A\u6027\u8FC7\u9AD8\u201D\u7B49\u95EE\u9898\u3002LangChain\u652F\u6301\u901A\u8FC73\u4E2A\u6838\u5FC3\u53C2\u6570\u63A7\u5236\u751F\u6210\u884C\u4E3A\uFF0C\u6240\u6709\u6A21\u578B\uFF08ChatModel/LLM\uFF09\u5747\u9002\u7528\u3002</p><h4 id="_3-5-1-\u6838\u5FC3\u53C2\u6570\u8BE6\u89E3-3\u4E2A\u5FC5\u638C\u63E1" tabindex="-1"><a class="header-anchor" href="#_3-5-1-\u6838\u5FC3\u53C2\u6570\u8BE6\u89E3-3\u4E2A\u5FC5\u638C\u63E1" aria-hidden="true">#</a> 3.5.1 \u6838\u5FC3\u53C2\u6570\u8BE6\u89E3\uFF083\u4E2A\u5FC5\u638C\u63E1\uFF09</h4><h4 id="_3-5-2-\u4EE3\u7801\u793A\u4F8B-\u53C2\u6570\u5B9E\u6218" tabindex="-1"><a class="header-anchor" href="#_3-5-2-\u4EE3\u7801\u793A\u4F8B-\u53C2\u6570\u5B9E\u6218" aria-hidden="true">#</a> 3.5.2 \u4EE3\u7801\u793A\u4F8B\uFF08\u53C2\u6570\u5B9E\u6218\uFF09</h4><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
import os

load_dotenv()

# 1. \u4F4Etemperature\uFF080.2\uFF09\uFF1A\u4E25\u8C28\u3001\u56FA\u5B9A\u56DE\u7B54
chat_low_temp = ChatOpenAI(
    model_name=&quot;gpt-3.5-turbo&quot;,
    api_key=os.getenv(&quot;OPENAI_API_KEY&quot;),
    temperature=0.2,
    max_tokens=100
)

# 2. \u9AD8temperature\uFF081.5\uFF09\uFF1A\u968F\u673A\u3001\u6709\u521B\u9020\u6027\u56DE\u7B54
chat_high_temp = ChatOpenAI(
    model_name=&quot;gpt-3.5-turbo&quot;,
    api_key=os.getenv(&quot;OPENAI_API_KEY&quot;),
    temperature=1.5,
    max_tokens=100
)

# 3. \u5E26stop sequences\uFF1A\u751F\u6210\u5230\u201C### \u7ED3\u675F\u201D\u65F6\u505C\u6B62
chat_stop_seq = ChatOpenAI(
    model_name=&quot;gpt-3.5-turbo&quot;,
    api_key=os.getenv(&quot;OPENAI_API_KEY&quot;),
    temperature=0.7,
    max_tokens=200,
    stop=[&quot;### \u7ED3\u675F&quot;]  # \u505C\u6B62\u5E8F\u5217
)

# \u6D4B\u8BD5\u4E0D\u540C\u53C2\u6570\u7684\u6548\u679C
question = &quot;\u75283\u53E5\u8BDD\u4ECB\u7ECDLangChain\u7684Models\u62BD\u8C61&quot;

print(&quot;=== \u4F4Etemperature\uFF080.2\uFF09 ===&quot;)
print(chat_low_temp.invoke([HumanMessage(content=question)]).content)

print(&quot;\\n=== \u9AD8temperature\uFF081.5\uFF09 ===&quot;)
print(chat_high_temp.invoke([HumanMessage(content=question)]).content)

print(&quot;\\n=== \u5E26stop sequences ===&quot;)
print(chat_stop_seq.invoke([HumanMessage(content=question + &quot;\uFF0C\u7ED3\u5C3E\u52A0\u4E0A### \u7ED3\u675F&quot;)]).content)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,11),le=e("\u4EE3\u7801\u6765\u6E90\uFF1ALangChain\u6A21\u578B\u53C2\u6570\u5B98\u65B9\u6587\u6863\uFF08"),te={href:"http://python.langchain.com/docs/langch%E2%80%A6%EF%BC%89%EF%BC%9B%E8%BF%90%E8%A1%8C%E5%90%8E%E5%8F%AF%E7%9B%B4%E8%A7%82%E7%9C%8B%E5%88%B0%E4%B8%8D%E5%90%8C%E5%8F%82%E6%95%B0%E5%AF%B9%E7%94%9F%E6%88%90%E7%BB%93%E6%9E%9C%E7%9A%84%E5%BD%B1%E5%93%8D%EF%BC%8C%E5%BB%BA%E8%AE%AE%E5%AE%9E%E9%99%85%E5%BC%80%E5%8F%91%E4%B8%AD%E6%A0%B9%E6%8D%AE%E5%9C%BA%E6%99%AF%E8%B0%83%E6%95%B4%E3%80%82",target:"_blank",rel:"noopener noreferrer"},de=e("python.langchain.com/docs/langch\u2026\uFF09\uFF1B\u8FD0\u884C\u540E\u53EF\u76F4\u89C2\u770B\u5230\u4E0D\u540C\u53C2\u6570\u5BF9\u751F\u6210\u7ED3\u679C\u7684\u5F71\u54CD\uFF0C\u5EFA\u8BAE\u5B9E\u9645\u5F00\u53D1\u4E2D\u6839\u636E\u573A\u666F\u8C03\u6574\u3002"),re=a(`<h4 id="_3-5-3-\u6CE8\u610F\u4E8B\u9879" tabindex="-1"><a class="header-anchor" href="#_3-5-3-\u6CE8\u610F\u4E8B\u9879" aria-hidden="true">#</a> 3.5.3 \u6CE8\u610F\u4E8B\u9879</h4><ul><li>max_tokens \u8BBE\u5B9A\u4E0D\u5B9C\u8FC7\u5927\uFF0C\u5426\u5219\u4F1A\u589E\u52A0\u6210\u672C\uFF08\u4E91\u7AEF\u6A21\u578B\u6309tokens\u6536\u8D39\uFF09\uFF0C\u4E14\u53EF\u80FD\u5BFC\u81F4\u56DE\u7B54\u5197\u4F59\uFF1B</li></ul><p>max_tokens \u8BBE\u5B9A\u4E0D\u5B9C\u8FC7\u5927\uFF0C\u5426\u5219\u4F1A\u589E\u52A0\u6210\u672C\uFF08\u4E91\u7AEF\u6A21\u578B\u6309tokens\u6536\u8D39\uFF09\uFF0C\u4E14\u53EF\u80FD\u5BFC\u81F4\u56DE\u7B54\u5197\u4F59\uFF1B</p><ul><li>stop sequences \u9700\u6839\u636E\u751F\u6210\u683C\u5F0F\u8BBE\u5B9A\uFF0C\u907F\u514D\u51FA\u73B0\u201C\u672A\u751F\u6210\u5B8C\u6574\u5185\u5BB9\u5C31\u505C\u6B62\u201D\u7684\u60C5\u51B5\uFF1B</li></ul><p>stop sequences \u9700\u6839\u636E\u751F\u6210\u683C\u5F0F\u8BBE\u5B9A\uFF0C\u907F\u514D\u51FA\u73B0\u201C\u672A\u751F\u6210\u5B8C\u6574\u5185\u5BB9\u5C31\u505C\u6B62\u201D\u7684\u60C5\u51B5\uFF1B</p><ul><li>\u4E0D\u540C\u6A21\u578B\u5BF9\u53C2\u6570\u7684\u652F\u6301\u7565\u6709\u5DEE\u5F02\uFF08\u5982\u90E8\u5206\u672C\u5730\u6A21\u578B\u4E0D\u652F\u6301stop sequences\uFF09\uFF0C\u9700\u53C2\u8003\u5BF9\u5E94\u6A21\u578B\u7684\u6587\u6863\u3002</li></ul><p>\u4E0D\u540C\u6A21\u578B\u5BF9\u53C2\u6570\u7684\u652F\u6301\u7565\u6709\u5DEE\u5F02\uFF08\u5982\u90E8\u5206\u672C\u5730\u6A21\u578B\u4E0D\u652F\u6301stop sequences\uFF09\uFF0C\u9700\u53C2\u8003\u5BF9\u5E94\u6A21\u578B\u7684\u6587\u6863\u3002</p><h3 id="_3-6-\u6D41\u5F0F\u8F93\u51FA-streaming-\u5B9E\u73B0\u4E0E\u524D\u7AEF\u5BF9\u63A5" tabindex="-1"><a class="header-anchor" href="#_3-6-\u6D41\u5F0F\u8F93\u51FA-streaming-\u5B9E\u73B0\u4E0E\u524D\u7AEF\u5BF9\u63A5" aria-hidden="true">#</a> 3.6 \u6D41\u5F0F\u8F93\u51FA\uFF08Streaming\uFF09\u5B9E\u73B0\u4E0E\u524D\u7AEF\u5BF9\u63A5</h3><p>\u9ED8\u8BA4\u60C5\u51B5\u4E0B\uFF0CLangChain\u8C03\u7528\u6A21\u578B\u65F6\uFF0C\u4F1A\u7B49\u5F85\u6A21\u578B\u751F\u6210\u5B8C\u6574\u56DE\u7B54\u540E\u518D\u8FD4\u56DE\uFF08\u540C\u6B65\u8F93\u51FA\uFF09\uFF0C\u8FD9\u79CD\u65B9\u5F0F\u5728\u56DE\u7B54\u8F83\u957F\u65F6\uFF0C\u4F1A\u51FA\u73B0\u201C\u957F\u65F6\u95F4\u65E0\u54CD\u5E94\u201D\u7684\u95EE\u9898\uFF0C\u5F71\u54CD\u7528\u6237\u4F53\u9A8C\u3002\u6D41\u5F0F\u8F93\u51FA\uFF08Streaming\uFF09\u53EF\u5B9E\u73B0\u201C\u8FB9\u751F\u6210\u3001\u8FB9\u8FD4\u56DE\u201D\uFF0C\u7C7B\u4F3CChatGPT\u7684\u6253\u5B57\u6548\u679C\uFF0C\u662F\u804A\u5929\u7C7B\u5E94\u7528\u7684\u5FC5\u5907\u529F\u80FD\u3002</p><h4 id="_3-6-1-\u6D41\u5F0F\u8F93\u51FA\u6838\u5FC3\u539F\u7406" tabindex="-1"><a class="header-anchor" href="#_3-6-1-\u6D41\u5F0F\u8F93\u51FA\u6838\u5FC3\u539F\u7406" aria-hidden="true">#</a> 3.6.1 \u6D41\u5F0F\u8F93\u51FA\u6838\u5FC3\u539F\u7406</h4><p>\u6D41\u5F0F\u8F93\u51FA\u901A\u8FC7\u201C\u8FED\u4EE3\u5668\u201D\u5B9E\u73B0\uFF1A\u6A21\u578B\u751F\u6210\u6587\u672C\u65F6\uFF0C\u4F1A\u5C06\u5185\u5BB9\u5206\u5757\u8FD4\u56DE\uFF0CLangChain\u901A\u8FC7stream()\u65B9\u6CD5\u8FD4\u56DE\u8FED\u4EE3\u5668\uFF0C\u5F00\u53D1\u8005\u53EF\u904D\u5386\u8FED\u4EE3\u5668\uFF0C\u9010\u5757\u83B7\u53D6\u751F\u6210\u5185\u5BB9\uFF0C\u5B9E\u73B0\u5B9E\u65F6\u8F93\u51FA\u3002</p><h4 id="_3-6-2-langchain-\u6D41\u5F0F\u8F93\u51FA\u4EE3\u7801\u793A\u4F8B-\u540E\u7AEF" tabindex="-1"><a class="header-anchor" href="#_3-6-2-langchain-\u6D41\u5F0F\u8F93\u51FA\u4EE3\u7801\u793A\u4F8B-\u540E\u7AEF" aria-hidden="true">#</a> 3.6.2 LangChain \u6D41\u5F0F\u8F93\u51FA\u4EE3\u7801\u793A\u4F8B\uFF08\u540E\u7AEF\uFF09</h4><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
import os

load_dotenv()

# \u521D\u59CB\u5316ChatModel\uFF0C\u652F\u6301\u6D41\u5F0F\u8F93\u51FA
chat_stream = ChatOpenAI(
    model_name=&quot;gpt-3.5-turbo&quot;,
    api_key=os.getenv(&quot;OPENAI_API_KEY&quot;),
    temperature=0.7,
    streaming=True  # \u5F00\u542F\u6D41\u5F0F\u8F93\u51FA
)

# \u6D41\u5F0F\u8C03\u7528\uFF1A\u4F7F\u7528stream()\u65B9\u6CD5\uFF0C\u8FD4\u56DE\u8FED\u4EE3\u5668
print(&quot;\u6D41\u5F0F\u8F93\u51FA\uFF08\u8FB9\u751F\u6210\u8FB9\u663E\u793A\uFF09\uFF1A&quot;)
for chunk in chat_stream.stream([HumanMessage(content=&quot;\u8BE6\u7EC6\u4ECB\u7ECDLangChain\u7684\u6D41\u5F0F\u8F93\u51FA\u539F\u7406\uFF0C\u52063\u70B9\u8BF4\u660E\u3002&quot;)]):
    # \u9010\u5757\u6253\u5370\u751F\u6210\u5185\u5BB9\uFF0C\u4E0D\u6362\u884C
    print(chunk.content, end=&quot;&quot;, flush=True)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13),oe=e("\u4EE3\u7801\u6765\u6E90\uFF1ALangChain\u6D41\u5F0F\u8F93\u51FA\u5B98\u65B9\u793A\u4F8B\uFF08"),ue={href:"http://python.langchain.com/docs/langch%E2%80%A6%EF%BC%89%EF%BC%9B%E8%BF%90%E8%A1%8C%E5%90%8E%E5%8F%AF%E7%9C%8B%E5%88%B0%E6%96%87%E6%9C%AC%E2%80%9C%E9%80%90%E5%AD%97%E7%94%9F%E6%88%90%E2%80%9D%E7%9A%84%E6%95%88%E6%9E%9C%EF%BC%8C%E4%B8%8EChatGPT%E7%9A%84%E4%BA%A4%E4%BA%92%E4%BD%93%E9%AA%8C%E4%B8%80%E8%87%B4%E3%80%82",target:"_blank",rel:"noopener noreferrer"},ve=e("python.langchain.com/docs/langch\u2026\uFF09\uFF1B\u8FD0\u884C\u540E\u53EF\u770B\u5230\u6587\u672C\u201C\u9010\u5B57\u751F\u6210\u201D\u7684\u6548\u679C\uFF0C\u4E0EChatGPT\u7684\u4EA4\u4E92\u4F53\u9A8C\u4E00\u81F4\u3002"),ce=a(`<h4 id="_3-6-3-\u4E0E\u524D\u7AEF\u5BF9\u63A5-\u7B80\u5355\u5B9E\u6218-flask\u793A\u4F8B" tabindex="-1"><a class="header-anchor" href="#_3-6-3-\u4E0E\u524D\u7AEF\u5BF9\u63A5-\u7B80\u5355\u5B9E\u6218-flask\u793A\u4F8B" aria-hidden="true">#</a> 3.6.3 \u4E0E\u524D\u7AEF\u5BF9\u63A5\uFF08\u7B80\u5355\u5B9E\u6218\uFF0CFlask\u793A\u4F8B\uFF09</h4><p>\u5B9E\u9645\u5F00\u53D1\u4E2D\uFF0C\u6D41\u5F0F\u8F93\u51FA\u9700\u8981\u4E0E\u524D\u7AEF\u5BF9\u63A5\uFF0C\u901A\u8FC7WebSocket\u6216SSE\uFF08\u670D\u52A1\u5668\u63A8\u9001\u4E8B\u4EF6\uFF09\u5C06\u5206\u5757\u5185\u5BB9\u63A8\u9001\u5230\u524D\u7AEF\uFF0C\u5B9E\u73B0\u5B9E\u65F6\u663E\u793A\u3002\u4E0B\u9762\u7ED9\u51FAFlask\u540E\u7AEF+\u7B80\u5355\u524D\u7AEF\u7684\u793A\u4F8B\uFF08\u540E\u7AEF\u90E8\u5206\uFF09\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from flask import Flask, request, Response
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)

# \u521D\u59CB\u5316\u6D41\u5F0F\u6A21\u578B
chat_stream = ChatOpenAI(
    model_name=&quot;gpt-3.5-turbo&quot;,
    api_key=os.getenv(&quot;OPENAI_API_KEY&quot;),
    streaming=True,
    temperature=0.7
)

# \u6D41\u5F0F\u63A5\u53E3\uFF1A\u63A5\u6536\u7528\u6237\u63D0\u95EE\uFF0C\u8FD4\u56DE\u6D41\u5F0F\u54CD\u5E94
@app.route(&quot;/stream_chat&quot;, methods=[&quot;POST&quot;])
def stream_chat():
    data = request.json
    question = data.get(&quot;question&quot;)

    # \u5B9A\u4E49\u6D41\u5F0F\u54CD\u5E94\u751F\u6210\u5668
    def generate():
        for chunk in chat_stream.stream([HumanMessage(content=question)]):
            yield f&quot;data: {chunk.content}\\n\\n&quot;  # SSE\u683C\u5F0F

    # \u8FD4\u56DESSE\u54CD\u5E94
    return Response(generate(), mimetype=&quot;text/event-stream&quot;)

if __name__ == &quot;__main__&quot;:
    app.run(debug=True)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u4F9D\u8D56\u5B89\u88C5\uFF1Apip install flask==2.3.3\uFF1B\u524D\u7AEF\u5BF9\u63A5\u8BF4\u660E\uFF1A\u524D\u7AEF\u901A\u8FC7EventSource\u76D1\u542C/stream_chat\u63A5\u53E3\uFF0C\u63A5\u6536\u540E\u7AEF\u63A8\u9001\u7684\u5206\u5757\u5185\u5BB9\uFF0C\u9010\u5B57\u6E32\u67D3\u5230\u9875\u9762\uFF08\u524D\u7AEF\u4EE3\u7801\u7B80\u5355\u793A\u4F8B\uFF0C\u53EF\u76F4\u63A5\u590D\u5236\u4F7F\u7528\uFF09\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;body&gt;
    &lt;input type=&quot;text&quot; id=&quot;question&quot; placeholder=&quot;\u8BF7\u8F93\u5165\u95EE\u9898&quot; /&gt;
    &lt;button onclick=&quot;streamChat()&quot;&gt;\u53D1\u9001&lt;/button&gt;
    &lt;div id=&quot;response&quot;&gt;&lt;/div&gt;

    &lt;script&gt;
      function streamChat() {
        const question = document.getElementById(&quot;question&quot;).value;
        const responseDiv = document.getElementById(&quot;response&quot;);
        responseDiv.innerHTML = &quot;&quot;;

        // \u5EFA\u7ACBSSE\u8FDE\u63A5
        const eventSource = new EventSource(\`/stream_chat\`, {
          method: &quot;POST&quot;,
          body: JSON.stringify({ question: question }),
          headers: { &quot;Content-Type&quot;: &quot;application/json&quot; },
        });

        // \u63A5\u6536\u5206\u5757\u5185\u5BB9\uFF0C\u9010\u5B57\u6E32\u67D3
        eventSource.onmessage = function (e) {
          responseDiv.innerHTML += e.data;
        };

        // \u8FDE\u63A5\u5173\u95ED
        eventSource.onclose = function () {
          console.log(&quot;\u6D41\u5F0F\u8F93\u51FA\u7ED3\u675F&quot;);
        };
      }
    &lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u4EE3\u7801\u8BF4\u660E\uFF1A\u540E\u7AEF\u901A\u8FC7SSE\u63A8\u9001\u6D41\u5F0F\u5185\u5BB9\uFF0C\u524D\u7AEF\u901A\u8FC7EventSource\u63A5\u6536\uFF0C\u5B9E\u73B0\u201C\u8FB9\u8F93\u5165\u3001\u8FB9\u663E\u793A\u201D\u7684\u4EA4\u4E92\u6548\u679C\uFF0C\u9002\u5408\u804A\u5929\u673A\u5668\u4EBA\u3001\u95EE\u7B54\u7CFB\u7EDF\u7B49\u573A\u666F\u3002</p><h3 id="_3-7-\u5F02\u6B65\u8C03\u7528-async-await-\u63D0\u5347\u6027\u80FD" tabindex="-1"><a class="header-anchor" href="#_3-7-\u5F02\u6B65\u8C03\u7528-async-await-\u63D0\u5347\u6027\u80FD" aria-hidden="true">#</a> 3.7 \u5F02\u6B65\u8C03\u7528\uFF08async/await\uFF09\u63D0\u5347\u6027\u80FD</h3><p>\u9ED8\u8BA4\u60C5\u51B5\u4E0B\uFF0CLangChain\u8C03\u7528\u6A21\u578B\u662F\u201C\u540C\u6B65\u8C03\u7528\u201D\u2014\u2014\u4E00\u6B21\u53EA\u80FD\u5904\u7406\u4E00\u4E2A\u8BF7\u6C42\uFF0C\u540E\u7EED\u8BF7\u6C42\u9700\u7B49\u5F85\u524D\u4E00\u4E2A\u8BF7\u6C42\u5B8C\u6210\uFF0C\u6548\u7387\u8F83\u4F4E\u3002\u5F02\u6B65\u8C03\u7528\uFF08async/await\uFF09\u53EF\u5B9E\u73B0\u201C\u540C\u65F6\u5904\u7406\u591A\u4E2A\u8BF7\u6C42\u201D\uFF0C\u63D0\u5347\u5E76\u53D1\u6027\u80FD\uFF0C\u9002\u5408\u9AD8\u5E76\u53D1\u573A\u666F\uFF08\u5982\u591A\u7528\u6237\u540C\u65F6\u63D0\u95EE\uFF09\u3002</p><p>LangChain\u7684\u6240\u6709\u6A21\u578B\u63A5\u53E3\u5747\u652F\u6301\u5F02\u6B65\u8C03\u7528\uFF0C\u53EA\u9700\u5C06invoke()\u66FF\u6362\u4E3Aainvoke()\uFF0C\u914D\u5408async/await\u8BED\u6CD5\u5373\u53EF\u5B9E\u73B0\u3002</p><h4 id="_3-7-1-\u5F02\u6B65\u8C03\u7528\u57FA\u7840\u793A\u4F8B" tabindex="-1"><a class="header-anchor" href="#_3-7-1-\u5F02\u6B65\u8C03\u7528\u57FA\u7840\u793A\u4F8B" aria-hidden="true">#</a> 3.7.1 \u5F02\u6B65\u8C03\u7528\u57FA\u7840\u793A\u4F8B</h4><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
import os
import asyncio

load_dotenv()

# \u521D\u59CB\u5316ChatModel\uFF08\u652F\u6301\u5F02\u6B65\u8C03\u7528\uFF09
chat_async = ChatOpenAI(
    model_name=&quot;gpt-3.5-turbo&quot;,
    api_key=os.getenv(&quot;OPENAI_API_KEY&quot;),
    temperature=0.7
)

# \u5B9A\u4E49\u5F02\u6B65\u51FD\u6570
async def async_chat(question):
    # \u5F02\u6B65\u8C03\u7528\uFF1Aainvoke()
    response = await chat_async.ainvoke([HumanMessage(content=question)])
    return response.content

# \u8FD0\u884C\u5F02\u6B65\u51FD\u6570
if __name__ == &quot;__main__&quot;:
    question = &quot;LangChain\u5F02\u6B65\u8C03\u7528\u7684\u4F18\u52BF\u662F\u4EC0\u4E48\uFF1F&quot;
    result = asyncio.run(async_chat(question))
    print(&quot;\u5F02\u6B65\u8C03\u7528\u7ED3\u679C\uFF1A&quot;, result)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,11),me=e("\u4EE3\u7801\u6765\u6E90\uFF1ALangChain\u5F02\u6B65\u8C03\u7528\u5B98\u65B9\u793A\u4F8B\uFF08"),pe={href:"http://python.langchain.com/docs/langch%E2%80%A6%EF%BC%89%EF%BC%9B%E6%B3%A8%E6%84%8F%EF%BC%9A%E5%BC%82%E6%AD%A5%E5%87%BD%E6%95%B0%E9%9C%80%E9%80%9A%E8%BF%87asyncio.run()%E8%BF%90%E8%A1%8C%EF%BC%8C%E4%B8%8D%E8%83%BD%E7%9B%B4%E6%8E%A5%E8%B0%83%E7%94%A8%E3%80%82",target:"_blank",rel:"noopener noreferrer"},he=e("python.langchain.com/docs/langch\u2026\uFF09\uFF1B\u6CE8\u610F\uFF1A\u5F02\u6B65\u51FD\u6570\u9700\u901A\u8FC7asyncio.run()\u8FD0\u884C\uFF0C\u4E0D\u80FD\u76F4\u63A5\u8C03\u7528\u3002"),be=a(`<h4 id="_3-7-2-\u591A\u8BF7\u6C42\u5E76\u53D1\u5F02\u6B65\u8C03\u7528-\u6838\u5FC3\u5B9E\u6218" tabindex="-1"><a class="header-anchor" href="#_3-7-2-\u591A\u8BF7\u6C42\u5E76\u53D1\u5F02\u6B65\u8C03\u7528-\u6838\u5FC3\u5B9E\u6218" aria-hidden="true">#</a> 3.7.2 \u591A\u8BF7\u6C42\u5E76\u53D1\u5F02\u6B65\u8C03\u7528\uFF08\u6838\u5FC3\u5B9E\u6218\uFF09</h4><p>\u5F02\u6B65\u8C03\u7528\u7684\u6838\u5FC3\u4F18\u52BF\u662F\u201C\u5E76\u53D1\u5904\u7406\u591A\u4E2A\u8BF7\u6C42\u201D\uFF0C\u4E0B\u9762\u793A\u4F8B\u5B9E\u73B0\u201C\u540C\u65F6\u5904\u74063\u4E2A\u8BF7\u6C42\u201D\uFF0C\u5BF9\u6BD4\u540C\u6B65\u8C03\u7528\u548C\u5F02\u6B65\u8C03\u7528\u7684\u6548\u7387\u5DEE\u5F02\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
import os
import asyncio
import time

load_dotenv()

chat_async = ChatOpenAI(
    model_name=&quot;gpt-3.5-turbo&quot;,
    api_key=os.getenv(&quot;OPENAI_API_KEY&quot;),
    temperature=0.7
)

# 1. \u540C\u6B65\u8C03\u7528\uFF08\u4F9D\u6B21\u5904\u74063\u4E2A\u8BF7\u6C42\uFF09
def sync_chat(questions):
    start_time = time.time()
    results = []
    for q in questions:
        response = chat_async.invoke([HumanMessage(content=q)])
        results.append(response.content)
    end_time = time.time()
    print(f&quot;\u540C\u6B65\u8C03\u7528\u8017\u65F6\uFF1A{end_time - start_time:.2f}\u79D2&quot;)
    return results

# 2. \u5F02\u6B65\u8C03\u7528\uFF08\u5E76\u53D1\u5904\u74063\u4E2A\u8BF7\u6C42\uFF09
async def async_chat_single(question):
    return await chat_async.ainvoke([HumanMessage(content=question)])

async def async_chat_batch(questions):
    start_time = time.time()
    # \u5E76\u53D1\u6267\u884C\u591A\u4E2A\u5F02\u6B65\u4EFB\u52A1
    tasks = [async_chat_single(q) for q in questions]
    results = await asyncio.gather(*tasks)
    end_time = time.time()
    print(f&quot;\u5F02\u6B65\u8C03\u7528\u8017\u65F6\uFF1A{end_time - start_time:.2f}\u79D2&quot;)
    return [res.content for res in results]

# \u6D4B\u8BD5\u5BF9\u6BD4
if __name__ == &quot;__main__&quot;:
    questions = [
        &quot;\u4ECB\u7ECDLangChain\u7684Models\u62BD\u8C61&quot;,
        &quot;\u4ECB\u7ECDLangChain\u7684Messages\u7C7B\u578B&quot;,
        &quot;\u4ECB\u7ECDLangChain\u7684\u6D41\u5F0F\u8F93\u51FA&quot;
    ]

    # \u540C\u6B65\u8C03\u7528
    sync_results = sync_chat(questions)
    # \u5F02\u6B65\u8C03\u7528
    async_results = asyncio.run(async_chat_batch(questions))

    print(&quot;\\n\u540C\u6B65\u8C03\u7528\u7ED3\u679C\uFF1A&quot;, sync_results)
    print(&quot;\\n\u5F02\u6B65\u8C03\u7528\u7ED3\u679C\uFF1A&quot;, async_results)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u8FD0\u884C\u7ED3\u679C\u8BF4\u660E\uFF1A\u5F02\u6B65\u8C03\u7528\u8017\u65F6\u7EA6\u4E3A\u540C\u6B65\u8C03\u7528\u76841/3\uFF08\u5177\u4F53\u8017\u65F6\u53D6\u51B3\u4E8E\u7F51\u7EDC\u548C\u6A21\u578B\u54CD\u5E94\u901F\u5EA6\uFF09\uFF0C\u5E76\u53D1\u4F18\u52BF\u660E\u663E\uFF1B\u4EE3\u7801\u4E2D\u4F7F\u7528asyncio.gather()\u5B9E\u73B0\u591A\u4E2A\u5F02\u6B65\u4EFB\u52A1\u7684\u5E76\u53D1\u6267\u884C\uFF0C\u662F\u9AD8\u5E76\u53D1\u573A\u666F\u7684\u5E38\u7528\u65B9\u6CD5\u3002</p><h4 id="_3-7-3-\u6CE8\u610F\u4E8B\u9879" tabindex="-1"><a class="header-anchor" href="#_3-7-3-\u6CE8\u610F\u4E8B\u9879" aria-hidden="true">#</a> 3.7.3 \u6CE8\u610F\u4E8B\u9879</h4><ul><li>\u5F02\u6B65\u8C03\u7528\u9700\u914D\u5408\u652F\u6301\u5F02\u6B65\u7684\u6846\u67B6\uFF08\u5982FastAPI\u3001Starlette\uFF09\uFF0CFlask\u9ED8\u8BA4\u4E0D\u652F\u6301\u5F02\u6B65\uFF0C\u9700\u4F7F\u7528Flask-AsyncExt\u6269\u5C55\uFF1B</li></ul><p>\u5F02\u6B65\u8C03\u7528\u9700\u914D\u5408\u652F\u6301\u5F02\u6B65\u7684\u6846\u67B6\uFF08\u5982FastAPI\u3001Starlette\uFF09\uFF0CFlask\u9ED8\u8BA4\u4E0D\u652F\u6301\u5F02\u6B65\uFF0C\u9700\u4F7F\u7528Flask-AsyncExt\u6269\u5C55\uFF1B</p><ul><li>\u4E91\u7AEF\u6A21\u578B\u6709API\u8C03\u7528\u9891\u7387\u9650\u5236\uFF0C\u5E76\u53D1\u8BF7\u6C42\u6570\u91CF\u4E0D\u5B9C\u8FC7\u591A\uFF0C\u907F\u514D\u89E6\u53D1\u9650\u6D41\uFF1B</li></ul><p>\u4E91\u7AEF\u6A21\u578B\u6709API\u8C03\u7528\u9891\u7387\u9650\u5236\uFF0C\u5E76\u53D1\u8BF7\u6C42\u6570\u91CF\u4E0D\u5B9C\u8FC7\u591A\uFF0C\u907F\u514D\u89E6\u53D1\u9650\u6D41\uFF1B</p><ul><li>\u672C\u5730\u6A21\u578B\u7684\u5F02\u6B65\u8C03\u7528\u6548\u679C\u53D6\u51B3\u4E8E\u6A21\u578B\u90E8\u7F72\u5DE5\u5177\uFF08\u5982vLLM\u652F\u6301\u5F02\u6B65\uFF0COllama\u5F02\u6B65\u652F\u6301\u6709\u9650\uFF09\u3002</li></ul><p>\u672C\u5730\u6A21\u578B\u7684\u5F02\u6B65\u8C03\u7528\u6548\u679C\u53D6\u51B3\u4E8E\u6A21\u578B\u90E8\u7F72\u5DE5\u5177\uFF08\u5982vLLM\u652F\u6301\u5F02\u6B65\uFF0COllama\u5F02\u6B65\u652F\u6301\u6709\u9650\uFF09\u3002</p><h3 id="_3-8-\u3010\u5B9E\u6218\u3011\u6784\u5EFA\u591A\u6A21\u578B\u5207\u6362\u7684\u95EE\u7B54\u63A5\u53E3" tabindex="-1"><a class="header-anchor" href="#_3-8-\u3010\u5B9E\u6218\u3011\u6784\u5EFA\u591A\u6A21\u578B\u5207\u6362\u7684\u95EE\u7B54\u63A5\u53E3" aria-hidden="true">#</a> 3.8 \u3010\u5B9E\u6218\u3011\u6784\u5EFA\u591A\u6A21\u578B\u5207\u6362\u7684\u95EE\u7B54\u63A5\u53E3</h3><p>\u672C\u8282\u901A\u8FC7\u4E00\u4E2A\u5B8C\u6574\u5B9E\u6218\u6848\u4F8B\uFF0C\u6574\u5408\u672C\u7AE0\u6240\u5B66\u77E5\u8BC6\u70B9\u2014\u2014\u6784\u5EFA\u4E00\u4E2A\u201C\u591A\u6A21\u578B\u5207\u6362\u7684\u95EE\u7B54\u63A5\u53E3\u201D\uFF0C\u652F\u6301\u5207\u6362OpenAI\u3001DeepSeek\u3001Ollama\u4E09\u79CD\u6A21\u578B\uFF0C\u5B9E\u73B0\u540C\u6B65/\u6D41\u5F0F\u8F93\u51FA\u3001\u5F02\u6B65\u8C03\u7528\uFF0C\u9A8C\u8BC1Models\u4E0EMessages\u7684\u6838\u5FC3\u7528\u6CD5\uFF0C\u540C\u65F6\u4E3A\u540E\u7EEDWeb\u5E94\u7528\u5F00\u53D1\u6253\u4E0B\u57FA\u7840\u3002</p><h4 id="_3-8-1-\u5B9E\u6218\u9700\u6C42" tabindex="-1"><a class="header-anchor" href="#_3-8-1-\u5B9E\u6218\u9700\u6C42" aria-hidden="true">#</a> 3.8.1 \u5B9E\u6218\u9700\u6C42</h4><ul><li>\u652F\u63013\u79CD\u6A21\u578B\u5207\u6362\uFF1AOpenAI\uFF08\u4E91\u7AEF\uFF09\u3001DeepSeek\uFF08\u4E91\u7AEF\uFF09\u3001Ollama\uFF08\u672C\u5730\uFF09\uFF1B</li></ul><p>\u652F\u63013\u79CD\u6A21\u578B\u5207\u6362\uFF1AOpenAI\uFF08\u4E91\u7AEF\uFF09\u3001DeepSeek\uFF08\u4E91\u7AEF\uFF09\u3001Ollama\uFF08\u672C\u5730\uFF09\uFF1B</p><ul><li>\u652F\u6301\u4E24\u79CD\u8F93\u51FA\u6A21\u5F0F\uFF1A\u540C\u6B65\u8F93\u51FA\u3001\u6D41\u5F0F\u8F93\u51FA\uFF1B</li></ul><p>\u652F\u6301\u4E24\u79CD\u8F93\u51FA\u6A21\u5F0F\uFF1A\u540C\u6B65\u8F93\u51FA\u3001\u6D41\u5F0F\u8F93\u51FA\uFF1B</p><ul><li>\u652F\u6301\u5F02\u6B65\u8C03\u7528\uFF0C\u63D0\u5347\u5E76\u53D1\u6027\u80FD\uFF1B</li></ul><p>\u652F\u6301\u5F02\u6B65\u8C03\u7528\uFF0C\u63D0\u5347\u5E76\u53D1\u6027\u80FD\uFF1B</p><ul><li>\u7EDF\u4E00\u63A5\u53E3\uFF0C\u6A21\u578B\u5207\u6362\u65F6\u65E0\u9700\u4FEE\u6539\u6838\u5FC3\u4EE3\u7801\uFF1B</li></ul><p>\u7EDF\u4E00\u63A5\u53E3\uFF0C\u6A21\u578B\u5207\u6362\u65F6\u65E0\u9700\u4FEE\u6539\u6838\u5FC3\u4EE3\u7801\uFF1B</p><ul><li>\u4F7F\u7528.env\u7BA1\u7406API\u5BC6\u94A5\uFF0C\u786E\u4FDD\u654F\u611F\u4FE1\u606F\u5B89\u5168\u3002</li></ul><p>\u4F7F\u7528.env\u7BA1\u7406API\u5BC6\u94A5\uFF0C\u786E\u4FDD\u654F\u611F\u4FE1\u606F\u5B89\u5168\u3002</p><h4 id="_3-8-2-\u5B9E\u6218\u51C6\u5907" tabindex="-1"><a class="header-anchor" href="#_3-8-2-\u5B9E\u6218\u51C6\u5907" aria-hidden="true">#</a> 3.8.2 \u5B9E\u6218\u51C6\u5907</h4><ul><li>\u6FC0\u6D3B\u865A\u62DF\u73AF\u5883\uFF0C\u5B89\u88C5\u6240\u9700\u4F9D\u8D56\uFF1A pip install langchain-core<mark>0.1.33 langchain-community</mark>0.1.13 langchain-openai<mark>0.1.6 python-dotenv</mark>1.0.1 flask==2.3.3</li></ul><p>\u6FC0\u6D3B\u865A\u62DF\u73AF\u5883\uFF0C\u5B89\u88C5\u6240\u9700\u4F9D\u8D56\uFF1A pip install langchain-core<mark>0.1.33 langchain-community</mark>0.1.13 langchain-openai<mark>0.1.6 python-dotenv</mark>1.0.1 flask==2.3.3</p><ul><li>\u914D\u7F6E.env\u6587\u4EF6\uFF08\u6DFB\u52A0\u6240\u9700API\u5BC6\u94A5\uFF09\uFF1A \`OPENAI_API_KEY=\u4F60\u7684OpenAI API\u5BC6\u94A5 DEEPSEEK_API_KEY=\u4F60\u7684DeepSeek API\u5BC6\u94A5</li></ul><p>\u914D\u7F6E.env\u6587\u4EF6\uFF08\u6DFB\u52A0\u6240\u9700API\u5BC6\u94A5\uFF09\uFF1A \`OPENAI_API_KEY=\u4F60\u7684OpenAI API\u5BC6\u94A5 DEEPSEEK_API_KEY=\u4F60\u7684DeepSeek API\u5BC6\u94A5</p><h2 id="ollama\u65E0\u9700\u914D\u7F6Eapi\u5BC6\u94A5" tabindex="-1"><a class="header-anchor" href="#ollama\u65E0\u9700\u914D\u7F6Eapi\u5BC6\u94A5" aria-hidden="true">#</a> Ollama\u65E0\u9700\u914D\u7F6EAPI\u5BC6\u94A5\`</h2><ul><li>\u5B89\u88C5Ollama\u5E76\u62C9\u53D6llama3:8b\u6A21\u578B\uFF08ollama pull llama3:8b\uFF09\u3002</li></ul><h4 id="_3-8-3-\u5B8C\u6574\u5B9E\u6218\u4EE3\u7801" tabindex="-1"><a class="header-anchor" href="#_3-8-3-\u5B8C\u6574\u5B9E\u6218\u4EE3\u7801" aria-hidden="true">#</a> 3.8.3 \u5B8C\u6574\u5B9E\u6218\u4EE3\u7801</h4><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>&quot;&quot;&quot;
\u5B9E\u6218\uFF1A\u6784\u5EFA\u591A\u6A21\u578B\u5207\u6362\u7684\u95EE\u7B54\u63A5\u53E3
\u4EE3\u7801\u6765\u6E90\uFF1ALangChain\u5B98\u65B9\u793A\u4F8B\u6539\u7F16\uFF08https://python.langchain.com/docs/get_started/quickstart\uFF09
\u529F\u80FD\uFF1A\u652F\u6301OpenAI\u3001DeepSeek\u3001Ollama\u6A21\u578B\u5207\u6362\uFF0C\u540C\u6B65/\u6D41\u5F0F\u8F93\u51FA\uFF0C\u5F02\u6B65\u8C03\u7528
&quot;&quot;&quot;
from dotenv import load_dotenv
import os
import asyncio
from flask import Flask, request, Response
from langchain_openai import ChatOpenAI
from langchain_community.chat_models import ChatDeepSeek, ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage

# 1. \u52A0\u8F7D\u73AF\u5883\u53D8\u91CF
load_dotenv()

# 2. \u521D\u59CB\u5316Flask\u5E94\u7528
app = Flask(__name__)

# 3. \u5B9A\u4E49\u6A21\u578B\u5DE5\u5382\uFF08\u7EDF\u4E00\u6A21\u578B\u521D\u59CB\u5316\uFF0C\u652F\u6301\u5207\u6362\uFF09
def get_model(model_type, streaming=False):
    &quot;&quot;&quot;
    \u83B7\u53D6\u6307\u5B9A\u7C7B\u578B\u7684\u6A21\u578B
    model_type: openai / deepseek / ollama
    streaming: \u662F\u5426\u5F00\u542F\u6D41\u5F0F\u8F93\u51FA
    &quot;&quot;&quot;
    if model_type == &quot;openai&quot;:
        return ChatOpenAI(
            model_name=&quot;gpt-3.5-turbo&quot;,
            api_key=os.getenv(&quot;OPENAI_API_KEY&quot;),
            temperature=0.7,
            streaming=streaming
        )
    elif model_type == &quot;deepseek&quot;:
        return ChatDeepSeek(
            model_name=&quot;deepseek-chat&quot;,
            api_key=os.getenv(&quot;DEEPSEEK_API_KEY&quot;),
            temperature=0.7,
            streaming=streaming
        )
    elif model_type == &quot;ollama&quot;:
        return ChatOllama(
            model=&quot;llama3:8b&quot;,
            temperature=0.7,
            streaming=streaming,
            max_tokens=200
        )
    else:
        raise ValueError(&quot;\u4E0D\u652F\u6301\u7684\u6A21\u578B\u7C7B\u578B\uFF0C\u53EF\u9009\uFF1Aopenai\u3001deepseek\u3001ollama&quot;)

# 4. \u540C\u6B65\u95EE\u7B54\u63A5\u53E3\uFF08\u652F\u6301\u6A21\u578B\u5207\u6362\uFF09
@app.route(&quot;/sync_chat&quot;, methods=[&quot;POST&quot;])
def sync_chat():
    data = request.json
    model_type = data.get(&quot;model_type&quot;, &quot;deepseek&quot;)  # \u9ED8\u8BA4\u4F7F\u7528DeepSeek
    question = data.get(&quot;question&quot;)

    if not question:
        return {&quot;code&quot;: 400, &quot;message&quot;: &quot;\u8BF7\u8F93\u5165\u95EE\u9898&quot;}

    try:
        # \u83B7\u53D6\u6A21\u578B\uFF0C\u8C03\u7528\u6A21\u578B
        model = get_model(model_type)
        messages = [
            SystemMessage(content=&quot;\u4F60\u662F\u591A\u6A21\u578B\u95EE\u7B54\u52A9\u624B\uFF0C\u56DE\u7B54\u7B80\u6D01\u6613\u61C2\uFF0C\u4E0D\u8D85\u8FC73\u53E5\u8BDD\u3002&quot;),
            HumanMessage(content=question)
        ]
        response = model.invoke(messages)
        return {
            &quot;code&quot;: 200,
            &quot;model_type&quot;: model_type,
            &quot;response&quot;: response.content
        }
    except Exception as e:
        return {&quot;code&quot;: 500, &quot;message&quot;: f&quot;\u8C03\u7528\u5931\u8D25\uFF1A{str(e)}&quot;}

# 5. \u6D41\u5F0F\u95EE\u7B54\u63A5\u53E3\uFF08\u652F\u6301\u6A21\u578B\u5207\u6362\uFF09
@app.route(&quot;/stream_chat&quot;, methods=[&quot;POST&quot;])
def stream_chat():
    data = request.json
    model_type = data.get(&quot;model_type&quot;, &quot;deepseek&quot;)
    question = data.get(&quot;question&quot;)

    if not question:
        return Response(&#39;{&quot;code&quot;: 400, &quot;message&quot;: &quot;\u8BF7\u8F93\u5165\u95EE\u9898&quot;}&#39;, mimetype=&quot;application/json&quot;)

    try:
        model = get_model(model_type, streaming=True)
        messages = [
            SystemMessage(content=&quot;\u4F60\u662F\u591A\u6A21\u578B\u95EE\u7B54\u52A9\u624B\uFF0C\u56DE\u7B54\u7B80\u6D01\u6613\u61C2\uFF0C\u4E0D\u8D85\u8FC73\u53E5\u8BDD\u3002&quot;),
            HumanMessage(content=question)
        ]

        # \u6D41\u5F0F\u751F\u6210\u54CD\u5E94
        def generate():
            for chunk in model.stream(messages):
                yield f&quot;data: {chunk.content}\\n\\n&quot;

        return Response(generate(), mimetype=&quot;text/event-stream&quot;)
    except Exception as e:
        return Response(f&#39;{&quot;code&quot;: 500, &quot;message&quot;: &quot;\u8C03\u7528\u5931\u8D25\uFF1A{str(e)}&quot;}&#39;, mimetype=&quot;application/json&quot;)

# 6. \u5F02\u6B65\u95EE\u7B54\u63A5\u53E3\uFF08\u5E76\u53D1\u5904\u7406\u591A\u8BF7\u6C42\uFF09
async def async_chat_single(model_type, question):
    model = get_model(model_type)
    messages = [
        SystemMessage(content=&quot;\u4F60\u662F\u591A\u6A21\u578B\u95EE\u7B54\u52A9\u624B\uFF0C\u56DE\u7B54\u7B80\u6D01\u6613\u61C2\uFF0C\u4E0D\u8D85\u8FC73\u53E5\u8BDD\u3002&quot;),
        HumanMessage(content=question)
    ]
    response = await model.ainvoke(messages)
    return {
        &quot;model_type&quot;: model_type,
        &quot;response&quot;: response.content
    }

@app.route(&quot;/async_chat_batch&quot;, methods=[&quot;POST&quot;])
def async_chat_batch():
    data = request.json
    tasks = data.get(&quot;tasks&quot;, [])  # \u683C\u5F0F\uFF1A[{&quot;model_type&quot;: &quot;deepseek&quot;, &quot;question&quot;: &quot;xxx&quot;}, ...]

    if not tasks:
        return {&quot;code&quot;: 400, &quot;message&quot;: &quot;\u8BF7\u4F20\u5165\u4EFB\u52A1\u5217\u8868&quot;}

    try:
        # \u5E76\u53D1\u6267\u884C\u591A\u4E2A\u5F02\u6B65\u4EFB\u52A1
        async_tasks = [async_chat_single(task[&quot;model_type&quot;], task[&quot;question&quot;]) for task in tasks]
        results = asyncio.run(asyncio.gather(*async_tasks))
        return {&quot;code&quot;: 200, &quot;results&quot;: results}
    except Exception as e:
        return {&quot;code&quot;: 500, &quot;message&quot;: f&quot;\u8C03\u7528\u5931\u8D25\uFF1A{str(e)}&quot;}

# 7. \u542F\u52A8\u670D\u52A1
if __name__ == &quot;__main__&quot;:
    app.run(debug=True, port=5000)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-8-4-\u63A5\u53E3\u6D4B\u8BD5-\u5B9E\u6218\u9A8C\u8BC1" tabindex="-1"><a class="header-anchor" href="#_3-8-4-\u63A5\u53E3\u6D4B\u8BD5-\u5B9E\u6218\u9A8C\u8BC1" aria-hidden="true">#</a> 3.8.4 \u63A5\u53E3\u6D4B\u8BD5\uFF08\u5B9E\u6218\u9A8C\u8BC1\uFF09</h4><p>\u542F\u52A8\u670D\u52A1\u540E\uFF0C\u53EF\u901A\u8FC7Postman\u3001curl\u6216\u524D\u7AEF\u9875\u9762\u6D4B\u8BD5\u63A5\u53E3\uFF0C\u4EE5\u4E0B\u662F3\u4E2A\u6838\u5FC3\u63A5\u53E3\u7684\u6D4B\u8BD5\u793A\u4F8B\uFF1A</p><p>\u8BF7\u6C42\u65B9\u5F0F\uFF1APOST\uFF0C\u8BF7\u6C42\u4F53\uFF08JSON\uFF09\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>{
  &quot;model_type&quot;: &quot;openai&quot;,
  &quot;question&quot;: &quot;\u591A\u6A21\u578B\u5207\u6362\u63A5\u53E3\u7684\u6838\u5FC3\u4F18\u52BF\u662F\u4EC0\u4E48\uFF1F&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u54CD\u5E94\u7ED3\u679C\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>{
  &quot;code&quot;: 200,
  &quot;model_type&quot;: &quot;openai&quot;,
  &quot;response&quot;: &quot;\u6838\u5FC3\u4F18\u52BF\u662F\u7EDF\u4E00\u63A5\u53E3\uFF0C\u53EF\u7075\u6D3B\u5207\u6362\u4E0D\u540C\u6A21\u578B\uFF0C\u65E0\u9700\u4FEE\u6539\u6838\u5FC3\u4EE3\u7801\uFF0C\u9002\u914D\u4E0D\u540C\u573A\u666F\u9700\u6C42\u3002&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u8BF7\u6C42\u65B9\u5F0F\uFF1APOST\uFF0C\u8BF7\u6C42\u4F53\u4E0E\u540C\u6B65\u63A5\u53E3\u4E00\u81F4\uFF0C\u901A\u8FC7\u524D\u7AEF\u9875\u9762\uFF083.6.3\u8282\u7684HTML\u4EE3\u7801\uFF09\u6D4B\u8BD5\uFF0C\u53EF\u770B\u5230\u201C\u8FB9\u751F\u6210\u8FB9\u663E\u793A\u201D\u7684\u6548\u679C\u3002</p><p>\u8BF7\u6C42\u65B9\u5F0F\uFF1APOST\uFF0C\u8BF7\u6C42\u4F53\uFF08JSON\uFF09\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>{
  &quot;tasks&quot;: [
    {
      &quot;model_type&quot;: &quot;deepseek&quot;,
      &quot;question&quot;: &quot;LangChain\u7684Messages\u6709\u54EA\u51E0\u79CD\u6838\u5FC3\u7C7B\u578B\uFF1F&quot;
    },
    { &quot;model_type&quot;: &quot;ollama&quot;, &quot;question&quot;: &quot;\u672C\u5730\u6A21\u578B\u548C\u4E91\u7AEF\u6A21\u578B\u7684\u533A\u522B\u662F\u4EC0\u4E48\uFF1F&quot; },
    { &quot;model_type&quot;: &quot;openai&quot;, &quot;question&quot;: &quot;\u5F02\u6B65\u8C03\u7528\u7684\u4F18\u52BF\u662F\u4EC0\u4E48\uFF1F&quot; }
  ]
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u54CD\u5E94\u7ED3\u679C\uFF1A\u8FD4\u56DE3\u4E2A\u4EFB\u52A1\u7684\u5E76\u53D1\u6267\u884C\u7ED3\u679C\uFF0C\u8017\u65F6\u8FDC\u4F4E\u4E8E\u540C\u6B65\u8C03\u7528\u3002</p>`,43);function ge(_e,qe){const i=t("ExternalLinkIcon");return d(),r("div",null,[n("blockquote",null,[n("p",null,[u,n("a",v,[c,s(i)])])]),m,n("p",null,[p,n("a",h,[b,s(i)])]),g,n("p",null,[_,n("a",q,[E,s(i)])]),A,n("p",null,[C,n("a",f,[y,s(i)])]),B,n("p",null,[x,n("a",L,[M,s(i)]),k,n("a",I,[F,s(i)])]),O,n("p",null,[P,S,H,n("a",D,[T,s(i)]),N,n("a",K,[Y,s(i)])]),w,n("p",null,[G,n("a",j,[V,s(i)])]),R,n("p",null,[U,n("a",Q,[J,s(i)])]),W,n("p",null,[z,n("a",X,[Z,s(i)]),$]),ee,n("p",null,[ne,n("a",ie,[se,s(i)])]),ae,n("p",null,[le,n("a",te,[de,s(i)])]),re,n("p",null,[oe,n("a",ue,[ve,s(i)])]),ce,n("p",null,[me,n("a",pe,[he,s(i)])]),be])}var Ce=l(o,[["render",ge],["__file","ai-langchain-model.html.vue"]]);export{Ce as default};
