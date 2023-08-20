var areas = 
['110000',
'110101',
'110102',
'110103',
'110104',
'110105',
'110106',
'110107',
'110108',
'110109',
'110111',
'110112',
'110113',
'110114',
'110115',
'110116',
'110117',
'110228',
'110229',
'120000',
'120101',
'120102',
'120103',
'120104',
'120105',
'120106',
'120107',
'120108',
'120109',
'120110',
'120111',
'120112',
'120113',
'120114',
'120115',
'120221',
'120223',
'120225',
'130000',
'130100',
'130102',
'130103',
'130104',
'130105',
'130107',
'130108',
'130121',
'130123',
'130124',
'130125',
'130126',
'130127',
'130128',
'130129',
'130130',
'130131',
'130132',
'130133',
'130181',
'130182',
'130183',
'130184',
'130185',
'130200',
'130202',
'130203',
'130204',
'130205',
'130207',
'130208',
'130223',
'130224',
'130225',
'130227',
'130229',
'130230',
'130281',
'130283',
'130300',
'130302',
'130303',
'130304',
'130321',
'130322',
'130323',
'130324',
'130400',
'130402',
'130403',
'130404',
'130406',
'130421',
'130423',
'130424',
'130425',
'130426',
'130427',
'130428',
'130429',
'130430'];


  
  function getMapC(pa:string|number):number|undefined{
    let result;
    switch (pa) {
       case "0" :
            result=0;
            break;
         case "1" :
            result=1;
            break;
         case "2" :
            result=2;
            break;
         case "3" :
            result=3;
            break;
         case "4" :
            result=4;
            break;
         case "5" :
            result=5;
            break;
         case "6" :
            result=6;
            break;
         case "7" :
            result=7;
            break;
         case "8" :
            result=8;
            break;
         case "9" :
            result=9;
            break;
         case "A" :
            result=10;
            break;
         case "B" :
            result=11;
            break;
         case "C" :
            result=12;
            break;
         case "D" :
            result=13;
            break;
         case "E" :
            result=14;
            break;
         case "F" :
            result=15;
            break;
         case "G" :
            result=16;
            break;
         case "H" :
            result=17;
            break;
         case "J" :
            result=18;
            break;
         case "K" :
            result=19;
            break;
         case "L" :
            result=20;
            break;
         case "M" :
            result=21;
            break;
         case "N" :
            result=22;
            break;
         case "P" :
            result=23;
            break;
         case "Q" :
            result=24;
            break;
         case "R" :
            result=25;
            break;
         case "T" :
            result=26;
            break;
         case "U" :
            result=27;
            break;
         case "W" :
            result=28;
            break;
         case "X" :
            result=29;
            break;
         case "Y" :
            result=30;
            break;
    }
    return result;
  }
  
  function getMapW(pa:string|number):number|undefined{
    var result;
    switch (pa) {
       case "1" :
            result=1;
            break;
         case "2" :
            result=3;
            break;
         case "3" :
            result=9;
            break;
         case "4" :
            result=27;
            break;
         case "5" :
            result=19;
            break;
         case "6" :
            result=26;
            break;
         case "7" :
            result=16;
            break;
         case "8" :
            result=17;
            break;
         case "9" :
            result=20;
            break;
         case "10" :
            result=29;
            break;
         case "11" :
            result=25;
            break;
         case "12" :
            result=13;
            break;
         case "13" :
            result=8;
            break;
         case "14" :
            result=24;
            break;
         case "15" :
            result=10;
            break;
         case "16" :
            result=30;
            break;
         case "17" :
            result=28;
            break;
    }
    return result;
  }
  
  function getMapR(pa:string|number){
    var result;
    switch (pa) {
       case "0" :
            result="0";
            break;
         case "1" :
            result="1";
            break;
         case "2" :
            result="2";
            break;
         case "3" :
            result="3";
            break;
         case "4" :
            result="4";
            break;
         case "5" :
            result="5";
            break;
         case "6" :
            result="6";
            break;
         case "7" :
            result="7";
            break;
         case "8" :
            result="8";
            break;
         case "9" :
            result="9";
            break;
         case "10" :
            result="A";
            break;
         case "11" :
            result="B";
            break;
         case "12" :
            result="C";
            break;
         case "13" :
            result="D";
            break;
         case "14" :
            result="E";
            break;
         case "15" :
            result="F";
            break;
         case "16" :
            result="G";
            break;
         case "17" :
            result="H";
            break;
         case "18" :
            result="J";
            break;
         case "19" :
            result="K";
            break;
         case "20" :
            result="L";
            break;
         case "21" :
            result="M";
            break;
         case "22" :
            result="N";
            break;
         case "23" :
            result="P";
            break;
         case "24" :
            result="Q";
            break;
         case "25" :
            result="R";
            break;
         case "26" :
            result="T";
            break;
         case "27" :
            result="U";
            break;
         case "28" :
            result="W";
            break;
         case "29" :
            result="X";
            break;
         case "30" :
            result="Y";
            break;
         case "31" :
            result="0";
            break;
    }
    return result;
  }
  
  
  /*统一社会信用代码生成*/
  function generatorCreditCode():string{
  
    var regOrg = getRegOrgCode("9");//默认工商
    var orgtype = "1";//默认企业
    var num = Math.floor(Math.random()*99);
    var area = areas[num];
    var num = Math.floor(((Math.random()*(99999999-10000000))+10000000));
    var ws = [ 3, 7, 9, 10, 5, 8, 4, 2 ];
    var sum = 0;
    for (var i = 0; i < 8; i++) {

        sum += parseInt((num+"").charAt(i)) * ws[i];
    }
    var C9:string|number = 11 - (sum % 11);
    if (C9 == 11) {
      C9 = '0';
    } else if (C9 == 10) {
      C9 = 'X';
    } else {
      C9 = C9 + '';
    }
    var orgCode = num+""+C9;
    var code = regOrg+orgtype+area+orgCode;
    var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
    var wi =[1,3,9,27,19,26,16,17,20,29,25,13,8,24,10,30,28];
    var sum = 0;
      for (var i = 0; i < 17; i++) {
        const C = getMapC(code.charAt(i)) as number;
        const W = getMapW((i+1).toString()) as number;
        sum += C * W;
    }
    var C18:string|number = 31 - (sum % 31);
    if (C18 == 31) {
        C18 = '0';
    }
   return code+getMapR(C18.toString())
  }
  
  /*获得登记机构*/
  function getRegOrgCode(num:string){
      var result;
      switch(num){
          case "1":
            result=1; //机构编制
            break;
          case "2":
            result=2; //外交
            break;
          case "3":
            result=3; //教育
            break; 
          case "4":
            result=4; //公安
            break; 
          case "5":
            result=5; //民政
            break; 
          case "6":
            result=6; //司法
            break; 
          case "7":
            result=7; //交通运输
            break; 
          case "8":
            result=8; //文化
            break; 
          case "9":
            result=9; //工商
            break;
          case "10":
            result='A'; //旅游局
            break;
          case "11":
            result="B"; //宗教事务管理
            break;
          case "12":
            result="C"; //全国总工会
            break;
          case "13":
            result="D"; //人民解放军总后勤部
            break;
          case "14":
            result="E"; //省级人民政府
            break;
          case "15":
            result="F"; //地市级人民政府
            break;
          case "16":
            result="G"; //区县级人民政府
            break;
          case "17":
            result="Y"; //其他
            break;
       }
      return result;
   }

//导出生成的信用代码
export const genCreditCode = () => {
    return generatorCreditCode();
}