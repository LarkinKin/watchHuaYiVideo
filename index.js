const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

/*   只要修改这里-begin     */
//视频列表页面地址
let listurl = 'http://cme26.91huayi.com/pages/course.aspx?cid=dd0a8761-9d6a-465c-8898-de9856eb8a5a&dept_id=43d31c09-4306-49a8-97b5-a2cb00aec74b'
//登录后的cookie
let sessionId = ''
let userid = ''
//最长的视频时长，单位秒
let maxVideoLength = 7200
let provinceId = ''
let clientIp = ''
/*   只要修改这里-end    */
let cookies = `ASP.NET_SessionId=${sessionId}; userid=${userid}; shcy=user_id=${userid};`
fetch(listurl, {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "upgrade-insecure-requests": "1",
    "cookie": cookies
  },
  "referrer": "http://cme26.91huayi.com/pages/search_result.aspx?dept_id=&dept_name=%e5%85%a8%e9%83%a8%e5%ad%a6%e7%a7%91&key_words=%e7%a7%91%e6%8a%80%e5%88%9b%e6%96%b0",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors"
}).then(
    res => res.text()
).then(
    html => {
        const reg = /course_ware\/course_ware\.aspx\?cwid\=(.*?)'/mg
        let relationids = []
        while (relationid = reg.exec(html)) {
            relationids.push(relationid[1])
        }
        relationids.forEach(cwid => {
            let ran = new Date().getTime()
            let group = uuidv4()
            let updateUrl = 'http://cme26.91huayi.com/ashx/update_course_ware_process.ashx?ran=' + ran + '&group_id=' + group + '&relation_id=' + cwid + '&user_id=' + userid + '&province_id=' + provinceId + '&client_ip=' + clientIp + '&platformVersion=Windows+10%2FChrome91%2FMozilla%2F5.0+(Windows+NT+10.0%3B+Win64%3B+x64)+AppleWebKit%2F537.36+(KHTML%2C+like+Gecko)+Chrome%2F91.0.4472.106+Safari%2F537.36'

            fetch(updateUrl, {
                "headers": {
                    "cookie": cookies
                }
            }).then(res => {
                 return text = res.text()
                
            }).then(text=> {
                console.log(text, cwid)
                if (text.search('添加成功') < 0) {
                    return
                }
                setTimeout(() => {
                    let now = ran + maxVideoLength
                    let doneUrl = 'http://cme26.91huayi.com/ashx/update_course_ware_process.ashx?ran=' + now + '&group_id=' + group + '&relation_id=' + cwid + '&user_id=' + userid + '&province_id=' + provinceId + '&client_ip=' + clientIp + '&platformVersion=Windows+10%2FChrome91%2FMozilla%2F5.0+(Windows+NT+10.0%3B+Win64%3B+x64)+AppleWebKit%2F537.36+(KHTML%2C+like+Gecko)+Chrome%2F91.0.4472.106+Safari%2F537.36'
                    fetch(doneUrl, {
                        "headers": {
                        "cookie": cookies
                    }
                    }).then(res=>res.text()).then(text=>{
                        console.log(text)
                        let addRecordUrl = 'http://cme26.91huayi.com/ashx/add_course_ware_play_record.ashx?relation_id='+ cwid +'&user_id=' + userid
                        fetch(addRecordUrl, {
                            "headers": {
                            "cookie": cookies
                        }
                        }).then(res=>res.text()).then(text=>console.log(text))
                    })
                },maxVideoLength * 1000)
            })
        })
        
        console.log(relationids)
    }
);