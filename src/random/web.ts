import { character, pick, random, word } from '../utils/helper'

/*
    ## Web
*/
export default {
  /*
      随机生成一个 URL。

      [URL 规范](http://www.w3.org/Addressing/URL/url-spec.txt)
          http                    Hypertext Transfer Protocol 
          ftp                     File Transfer protocol 
          gopher                  The Gopher protocol 
          mailto                  Electronic mail address 
          mid                     Message identifiers for electronic mail 
          cid                     Content identifiers for MIME body part 
          news                    Usenet news 
          nntp                    Usenet news for local NNTP access only 
          prospero                Access using the prospero protocols 
          telnet rlogin tn3270    Reference to interactive sessions
          wais                    Wide Area Information Servers 
  */
  url: function (protocol, host) {
    return (
      (protocol || this.protocol()) +
      '://' + // protocol?
      (host || this.domain()) + // host?
      '/' +
      word()
    )
  },
  // 随机生成一个 URL 协议。
  protocol: function () {
    return pick(
      // 协议簇
      'http ftp gopher mailto mid cid news nntp prospero telnet rlogin tn3270 wais'.split(' '),
    )
  },
  // 随机生成一个域名。
  domain: function (tld = '') {
    return word() + '.' + (tld || this.tld())
  },
  /*
      随机生成一个顶级域名。
      国际顶级域名 international top-level domain-names, iTLDs
      国家顶级域名 national top-level domainnames, nTLDs
      [域名后缀大全](http://www.163ns.com/zixun/post/4417.html)
  */
  tld: function () {
    // Top Level Domain
    return pick(
      // 域名后缀
      (
        'com net org edu gov int mil cn ' +
        // 国内域名
        'com.cn net.cn gov.cn org.cn ' +
        // 新国际域名
        'tel biz cc tv info name hk mobi asia cd pro'
      ).split(' '),
    )
  },
  // 随机生成一个邮件地址。
  email: function (domain = '') {
    return character('lower') + '.' + word() + '@' + (domain || word() + '.' + this.tld())
    // return character('lower') + '.' + this.last().toLowerCase() + '@' + this.last().toLowerCase() + '.' + this.tld()
    // return word() + '@' + (domain || this.domain())
  },
  // 随机生成一个 IP 地址。
  ip: function () {
    return random(0, 255) + '.' + random(0, 255) + '.' + random(0, 255) + '.' + random(0, 255)
  },
}
