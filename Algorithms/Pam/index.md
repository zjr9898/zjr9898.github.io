## 回文树（回文自动机）讲解

## 简介

回文树能够高效地处理一些有关**回文子串**的问题，最初由 ` Mikhail Rubinchik ` 和 ` Arseny M. Shur ` 在 ` 2015 ` 年发表。

## 结构

字符串$$s$$的回文树是一个由两棵树构成的森林。每个非根节点与$$s$$中的回文子串一一对应（**相同的回文子串算一个**）。边上记录一个字符$$c$$，代表如果父节点$$f$$对应的字符串为$$s_f$$，那么子节点$$son$$对应的字符串为$$c+s_f+c$$。

两棵树的根节点分别为` 0 `，` 1 `。根节点为` 0 `代表$ s $中长度为**偶数**回文子串的非重集合，根节点为` 1 `代表$ s $中长度为**奇数**回文子串的非重集合。

对于一个树上节点$ i $，定义$ len_i $为$ i $所对应的字符串$ s_i $的长度。特别的，定义$ len_0 = 0 $，$ len_1 = -1 $，因为` 0 `节点的所有子节点对应的字符串形如$ cc $（两个字符），长度为$ len_0+2=2 $，` 1 `节点的所有子节点对应的字符串形如$c$（单个字符），长度为$ len_1+2=1 $。

对于一个树上节点$ i $，定义其失配指针$ fail_i $指向$ i $所对应的字符串$ s_i $的**最长回文后缀**在树上对应的节点。特别的，定义$ fail_0 $与$ fail_1 $均指向` 1 `。

举个例子（图片来自[OI wiki](https://oi-wiki.org//string/pam/)）

![aaa](https://cdn.luogu.com.cn/upload/image_hosting/g0gvfx0q.png?x-oss-process=image/resize,m_lfit,h_170,w_225)

## 定理

对于一个字符串 $ [s] $ ，它的本质不同回文子串个数最多只有$ [|s|] $个。

### 证明

使用数学归纳法。

- 当$ |s| = 1 $时，只有s[1..1]一个子串，并且他是回文的，所以结论成立。

- 当$ |s| > 1 $时，设$ s = s'+c $，其中$ c $为$ s $的最后一个字符，并且结论对$s'$ 成立。考虑以末尾字符$ c $为结尾的回文子串，假设他们的左端点从左到右依次为$ l_1 , l_2 , ... , l_k $，那么由于$ s[l_1 .. |s|] $为回文串，那么对于所有的位置$ l_1 ≤ p ≤ |s| $，都会有$ s[p..|s|] = s[l_1 ..l_1+|s|−p] $，所以对于回文子串$ s[l_i ..|s|] $，都会有$ s[l_i ..|s|] = s[l_1 ..l_1 + |s| − l_i ] $，当 i &ne; 1 时，总会有$ l_1 + |s| − l_i < |s| $，从而$ s[l_i ..|s|] $已经在$ s[1..|s| − 1] $中出现，因此每次不同的回文串最多新增一个，即$ s[l_1 ..|s|] $。因此结论对于s依然成立。

因此回文树的状态是$O(|s|)$级别的。考虑转移，对于一个状态，能转移到他的节点是唯一的，所以总转移数也是$O(|s|)$的。

## 实现

采用增量法来构造回文树，即每次从字符串$ s $末尾加入字符$ c $，并维护新字符串$ s+c $的回文树。

依据上述定理，新字符串所能贡献的回文串一定是$ s+c $ 的最长回文后缀。

于是我们可以记录$ s $未加入$ c $的最长回文后缀$ t $，看$ s[|s|-len_t] $是否等于$ c $，如果不等于或者$ t $的长度过长，那么使$ t= fail_t $，直到找到满足条件的$ t $，此时$ t $是$ s $未加入$ c $的最长回文后缀，或长度为` 0 `或` -1 `的字符串。

插入时，假如回文树上不存在一个节点代表$ c+t+c $，则需要新建一个新的节点来代表它。否则直接使用这个节点。假如新建了一个节点，还需要求出这个新节点的$ fail $指针对应的节点，$ t $顺着$ fail $指针向上跳的过程中第一个节点$ v $满足$ s[|s| − len_v ] = c $，先跳到的长度较大。这里需要注意假如$ len_t = −1 $，那么$ c+t+c $的$ fail $指针应当指向长度为` 0 `的节点，否则$ c+t+c $最长回文后缀必然在回文树上，直接将指针指向对应节点即可。

举个例子

在`babbab`后加入`a`。

![aaa](https://cdn.luogu.com.cn/upload/image_hosting/64yp0yjy.png?x-oss-process=image/resize,m_lfit,h_170,w_225)

模板题代码

```c++
const int MAXN=1e6+10;
char c[MAXN];
int l,tot=1,at,ans;
struct Node{
	int len,fail,num,to[30];
}tr[MAXN];
int Get(int x,int y){
	while(y-tr[x].len-1<1||c[y-tr[x].len-1]!=c[y]) x=tr[x].fail;
	return x;
}
void Push(int x){
	if(!tr[at].to[c[x]-'a']){
		tr[++tot].fail=tr[Get(tr[at].fail,x)].to[c[x]-'a'];
		tr[at].to[c[x]-'a']=tot;
		tr[tot].len=tr[at].len+2;
		tr[tot].num=tr[tr[tot].fail].num+1;
	}
	ans=tr[at].to[c[x]-'a'];
}
int main(){
	cin>>c+1;
	l=strlen(c+1);
	tr[0].fail=1,tr[1].len=-1;
	for(int i=1;i<=l;i++){
		at=Get(ans,i);
		Push(i);
		cout<<tr[ans].num<<" ";
	}
	return 0;
}
```

## 参考文献

[1] [OI wiki](https://oi-wiki.org//string/pam/)

[2] 翁文涛，《回文树及其应用》
