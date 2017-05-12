/**
 * 农历（阴历）万年历
 * LunarCalendar
 * vervison : v0.1.4
 * Github : https://github.com/zzyss86/LunarCalendar
 * HomePage : http://www.tuijs.com/
 * Author : JasonZhou
 * Email : zzyss86@qq.com
 */

(function(){
  var extend = function(o, c){
    if(o && c && typeof c == "object"){
      for(var p in c){
        o[p] = c[p];
      }
    }
    return o;
  };
  
  var creatLenArr = function(year,month,len,start){
    var arr = [];
      start = start || 0;
    if(len<1)return arr;
    var k = start;
    for(var i=0;i<len;i++){
      arr.push({year:year,month:month,day:k});
      k++;
    }
    return arr;
  };
  
  var errorCode = {
    100 : '年份超出了可達的範圍，僅支持1891年至2100年',
    101 : '參數輸入錯誤，請查閱文檔'
  };
  
  var cache = null;
  var cacheUtil = {
    current : '',
    setCurrent : function(year){
      if(this.current != year){
        this.current = year;
        this.clear();
      }
    },
    set : function(key,value){
      if(!cache) cache = {};
      cache[key] = value;
      return cache[key];
    },
    get : function(key){
      if(!cache) cache = {};
      return cache[key];
    },
    clear : function(){
      cache = null;
    }
  };
  
  var formateDayD4 = function(month,day){
    month = month+1;
    month = month<10 ? '0'+month : month;
    day = day<10 ? '0'+day : day;
    return 'd'+month+day;
  };
  
  var minYear = 1890;
  var maxYear = 2100;
  var DATA = {
    solarTerm: ['小寒', '大寒', '立春', '雨水', '驚蟄', '春分', '清明', '穀雨', '立夏', '小滿', '芒種', '夏至', '小暑', '大暑', '立秋', '處暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'],
    heavenlyStems: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
    earthlyBranches: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
    zodiac: ['鼠','牛','虎','兔','龍','蛇','馬','羊','猴','雞','狗','豬'],
    monthCn: ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
    dateCn: ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', '卅一']
  };
  
  var solarFestival = {
    'd0101': [['元旦', '中華民國開國紀念日'], true],
    'd0111': [['司法節'], false],
    'd0115': [['藥師節'], false],
    'd0123': [['自由日'], false],
    'd0204': [['農民節'], false],
    'd0214': [['情人節'], false],
    'd0215': [['戲劇節'], false],
    'd0219': [['新生活運動紀念日'], false],
    'd0228': [['和平紀念日'], true],
    'd0301': [['兵役節'], false],
    'd0305': [['童子軍節'], false],
    'd0308': [['婦女節'], false],
    'd0312': [['植樹節', '國父逝世紀念日'], false],
    'd0317': [['國醫節'], false],
    'd0320': [['郵政節'], false],
    'd0321': [['氣象節'], false],
    'd0325': [['美術節'], false],
    'd0326': [['廣播節'], false],
    'd0329': [['青年節', '革命先烈紀念日'], false],
    'd0330': [['出版節'], false],
    'd0401': [['愚人節', '主計節'], false],
    'd0404': [['婦幼節'], false],
    'd0405': [['音樂節'], false],
    'd0407': [['衛生節'], false],
    'd0422': [['世界地球日'], false],
    'd0501': [['勞動節'], true],
    'd0504': [['文藝節'], false],
    'd0505': [['舞蹈節'], false],
    'd0510': [['珠算節'], false],
    'd0512': [['護士節'], false],
    'd0603': [['禁煙節'], false],
    'd0606': [['工程師節', '水利節'], false],
    'd0609': [['鐵路節'], false],
    'd0615': [['警察節'], false],
    'd0630': [['會計師節'], false],
    'd0701': [['漁民節', '公路節', '稅務節'], false],
    'd0711': [['航海節'], false],
    'd0712': [['聾啞節'], false],
    'd0808': [['父親節'], false],
    'd0814': [['空軍節'], false],
    'd0827': [['鄭成功誕辰'], false],
    'd0901': [['記者節'], false],
    'd0903': [['軍人節', '抗戰紀念'], false],
    'd0909': [['體育節', '律師節'], false],
    'd0913': [['法律日'], false],
    'd0928': [['教師節', '孔子誕辰'], false],
    'd1006': [['老人節'], false],
    'd1010': [['國慶紀念日'], true],
    'd1021': [['華僑節'], false],
    'd1025': [['台灣光復節'], false],
    'd1031': [['萬聖節', '蔣公誕辰紀念日', '榮民節'], false],
    'd1101': [['商人節'], false],
    'd1111': [['工業節', '地政節'], false],
    'd1117': [['自來水節'], false],
    'd1112': [['國父誕辰紀念日', '醫師節', '中華文化復興節'], false],
    'd1121': [['防空節'], false],
    'd1205': [['海員節', '盲人節'], false],
    'd1210': [['人權節'], false],
    'd1212': [['憲兵節'], false],
    'd1225': [['行憲紀念日', '民族復興節', '聖誕節'], false],
    'd1227': [['建築師節'], false],
    'd1228': [['電信節'], false],
    'd1231': [['受信節'], false]
  };
  
  var lunarFestival = {
    'd0101': [['春節'], true],
    'd0102': [['回娘家'], true],
    'd0103': [['祭祖'], true],
    'd0104': [['迎神'], false],
    'd0105': [['開市'], false],
    'd0109': [['天公生'], false],
    'd0115': [['元宵節', '觀光節'], false],
    'd0202': [['頭牙', '土地公生'], false],
    'd0323': [['媽祖生'], false],
    'd0408': [['浴佛節'], false],
    'd0505': [['端午節', '詩人節'], true],
    'd0701': [['開鬼門'], false],
    'd0707': [['七夕情人節'], false],
    'd0715': [['中元節'], false],
    'd0800': [['關鬼門'], false],
    'd0815': [['中秋節'], true],
    'd0909': [['重陽節'], false],
    'd1208': [['臘八節'], false],
    'd1216': [['尾牙'], false],
    'd1224': [['送神'], false],
    'd0100': [['除夕'], true],
  };
  /**
   * 1890 - 2100年的農曆數據
   * 數據格式：[0,2,9,21936]
   * [閏月所在月，0為沒有閏月*正月初一對應公曆月;*正月初一對應公曆日;*農曆每月的天數的數組（需轉換為二進制，得到每月大小，0 =小月（29日），1 =大月（30日））;]
   */
  var lunarInfo = [[2,1,21,22184],[0,2,9,21936],[6,1,30,9656],[0,2,17,9584],[0,2,6,21168],[5,1,26,43344],[0,2,13,59728],[0,2,2,27296],[3,1,22,44368],[0,2,10,43856],[8,1,30,19304],[0,2,19,19168],[0,2,8,42352],[5,1,29,21096],[0,2,16,53856],[0,2,4,55632],[4,1,25,27304],[0,2,13,22176],[0,2,2,39632],[2,1,22,19176],[0,2,10,19168],[6,1,30,42200],[0,2,18,42192],[0,2,6,53840],[5,1,26,54568],[0,2,14,46400],[0,2,3,54944],[2,1,23,38608],[0,2,11,38320],[7,2,1,18872],[0,2,20,18800],[0,2,8,42160],[5,1,28,45656],[0,2,16,27216],[0,2,5,27968],[4,1,24,44456],[0,2,13,11104],[0,2,2,38256],[2,1,23,18808],[0,2,10,18800],[6,1,30,25776],[0,2,17,54432],[0,2,6,59984],[5,1,26,27976],[0,2,14,23248],[0,2,4,11104],[3,1,24,37744],[0,2,11,37600],[7,1,31,51560],[0,2,19,51536],[0,2,8,54432],[6,1,27,55888],[0,2,15,46416],[0,2,5,22176],[4,1,25,43736],[0,2,13,9680],[0,2,2,37584],[2,1,22,51544],[0,2,10,43344],[7,1,29,46248],[0,2,17,27808],[0,2,6,46416],[5,1,27,21928],[0,2,14,19872],[0,2,3,42416],[3,1,24,21176],[0,2,12,21168],[8,1,31,43344],[0,2,18,59728],[0,2,8,27296],[6,1,28,44368],[0,2,15,43856],[0,2,5,19296],[4,1,25,42352],[0,2,13,42352],[0,2,2,21088],[3,1,21,59696],[0,2,9,55632],[7,1,30,23208],[0,2,17,22176],[0,2,6,38608],[5,1,27,19176],[0,2,15,19152],[0,2,3,42192],[4,1,23,53864],[0,2,11,53840],[8,1,31,54568],[0,2,18,46400],[0,2,7,46752],[6,1,28,38608],[0,2,16,38320],[0,2,5,18864],[4,1,25,42168],[0,2,13,42160],[10,2,2,45656],[0,2,20,27216],[0,2,9,27968],[6,1,29,44448],[0,2,17,43872],[0,2,6,38256],[5,1,27,18808],[0,2,15,18800],[0,2,4,25776],[3,1,23,27216],[0,2,10,59984],[8,1,31,27432],[0,2,19,23232],[0,2,7,43872],[5,1,28,37736],[0,2,16,37600],[0,2,5,51552],[4,1,24,54440],[0,2,12,54432],[0,2,1,55888],[2,1,22,23208],[0,2,9,22176],[7,1,29,43736],[0,2,18,9680],[0,2,7,37584],[5,1,26,51544],[0,2,14,43344],[0,2,3,46240],[4,1,23,46416],[0,2,10,44368],[9,1,31,21928],[0,2,19,19360],[0,2,8,42416],[6,1,28,21176],[0,2,16,21168],[0,2,5,43312],[4,1,25,29864],[0,2,12,27296],[0,2,1,44368],[2,1,22,19880],[0,2,10,19296],[6,1,29,42352],[0,2,17,42208],[0,2,6,53856],[5,1,26,59696],[0,2,13,54576],[0,2,3,23200],[3,1,23,27472],[0,2,11,38608],[11,1,31,19176],[0,2,19,19152],[0,2,8,42192],[6,1,28,53848],[0,2,15,53840],[0,2,4,54560],[5,1,24,55968],[0,2,12,46496],[0,2,1,22224],[2,1,22,19160],[0,2,10,18864],[7,1,30,42168],[0,2,17,42160],[0,2,6,43600],[5,1,26,46376],[0,2,14,27936],[0,2,2,44448],[3,1,23,21936],[0,2,11,37744],[8,2,1,18808],[0,2,19,18800],[0,2,8,25776],[6,1,28,27216],[0,2,15,59984],[0,2,4,27424],[4,1,24,43872],[0,2,12,43744],[0,2,2,37600],[3,1,21,51568],[0,2,9,51552],[7,1,29,54440],[0,2,17,54432],[0,2,5,55888],[5,1,26,23208],[0,2,14,22176],[0,2,3,42704],[4,1,23,21224],[0,2,11,21200],[8,1,31,43352],[0,2,19,43344],[0,2,7,46240],[6,1,27,46416],[0,2,15,44368],[0,2,5,21920],[4,1,24,42448],[0,2,12,42416],[0,2,2,21168],[3,1,22,43320],[0,2,9,26928],[7,1,29,29336],[0,2,17,27296],[0,2,6,44368],[5,1,26,19880],[0,2,14,19296],[0,2,3,42352],[4,1,24,21104],[0,2,10,53856],[8,1,30,59696],[0,2,18,54560],[0,2,7,55968],[6,1,27,27472],[0,2,15,22224],[0,2,5,19168],[4,1,25,42216],[0,2,12,42192],[0,2,1,53584],[2,1,21,55592],[0,2,9,54560]];
  
  /**
   * 二十四節氣數據，節氣點時間（單位是分鐘）
   * 從 0 小寒起算
   */
  var termInfo = [0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758];
  
  /**
   * 判斷農曆年閏月數
   * @param {Number} year 農曆年
   * return 閏月數（月份從 1 開始）
   */
  function getLunarLeapYear(year){
    var yearData = lunarInfo[year-minYear];
    return yearData[0];
  };
  
  /**
   * 獲取農曆年份一年的每月的天數及一年的總天數
   * @param {Number} year 農曆年
   */
  function getLunarYearDays(year){
    var yearData = lunarInfo[year-minYear];
    var leapMonth = yearData[0]; //閏月
    var monthData = yearData[3].toString(2);
    var monthDataArr = monthData.split('');
    
    //還原數據至16位，少於16位的在前面插入0（二進制存儲時前面的0被忽略）
    for(var i=0;i<16-monthDataArr.length;i++){
      monthDataArr.unshift(0);
    }
    
    var len = leapMonth ? 13 : 12; //該年有幾個月
    var yearDays = 0;
    var monthDays = [];
    for(var i=0;i<len;i++){
      if(monthDataArr[i]==0){
        yearDays += 29;
        monthDays.push(29);
      }else{
        yearDays += 30;
        monthDays.push(30);
      }
    }
    
    return {
      yearDays : yearDays,
      monthDays : monthDays
    };
  };
  
  /**
   * 通過間隔天數查找農曆日期
   * @param {Number} year,between 農曆年，間隔天數
   */
  function getLunarDateByBetween(year,between){
    var lunarYearDays = getLunarYearDays(year);
    var end = between>0 ? between : lunarYearDays.yearDays - Math.abs(between);
    var monthDays = lunarYearDays.monthDays;
    var tempDays = 0;
    var month = 0;
    for(var i=0;i<monthDays.length;i++){
      tempDays += monthDays[i];
      if(tempDays > end){
        month = i;
        tempDays = tempDays-monthDays[i];
        break;
      }
    }
    
    return [year,month,end - tempDays + 1];
  };

  /**
   * 根據距離正月初一的天數計算農曆日期
   * @param {Number} year 公歷年，月，日
   */
  function getLunarByBetween(year,month,day){
    var yearData = lunarInfo[year-minYear];
    var zenMonth = yearData[1];
    var zenDay = yearData[2];
    var between = getDaysBetweenSolar(year,zenMonth-1,zenDay,year,month,day);
    if(between==0){ //正月初一
      return [year,0,1];
    }else{
      var lunarYear = between>0 ? year : year-1;
      return getLunarDateByBetween(lunarYear,between);
    }
  };
  
  /**
   * 兩個公曆日期之間的天數
   */
  function getDaysBetweenSolar(year,month,day,year1,month1,day1){
    var date = new Date(year,month,day).getTime();
    var date1 = new Date(year1,month1,day1).getTime();
    return (date1-date) / 86400000;
  };
  
  /**
   * 計算農曆日期離正月初一有多少天
   * @param {Number} year,month,day 農年，月（0-12，有閏月），日
   */
  function getDaysBetweenZheng(year,month,day){
    var lunarYearDays = getLunarYearDays(year);
    var monthDays = lunarYearDays.monthDays;
    var days = 0;
    for(var i=0;i<monthDays.length;i++){
      if(i<month){
        days += monthDays[i];
      }else{
        break;
      }
    };
    return days+day-1;
  };
  
  /**
   * 某年的第 n 個節氣為幾日
   * 31556925974.7為地球公轉週期，是毫秒
   * 1890年的正小寒點：01-05 16:02:31，1890年為基準點
   * @param {Number} y 公歷年
   * @param {Number} n 第幾個節氣，從0小寒起算
   * 由於農曆24節氣交節時刻採用近似算法，可能存在少量誤差（30分鐘內）
   */
  function getTerm(y,n) {
    var offDate = new Date( ( 31556925974.7*(y-1890) + termInfo[n]*60000  ) + Date.UTC(1890,0,5,16,2,31) );
    return(offDate.getUTCDate());
  };
  
  /**
   * 獲取公歷年一年的二十四節氣
   * 返回key:日期，value:節氣中文名
   */
  function getYearTerm(year){
    var res = {};
    var month = 0;
    for(var i=0;i<24;i++){
      var day = getTerm(year,i);
      if(i%2==0)month++
      res[formateDayD4(month-1,day)] = DATA.solarTerm[i];
    }
    return res;
  };
  
  /**
   * 獲取生肖
   * @param {Number} year 干支所在年（默認以立春前的公歷年作為基數）
   */
  function getYearZodiac(year){
     var num = year-1890+25; //參考干支紀年的計算，生肖對應地支
     return DATA.zodiac[num%12];
  };
  
  /**
   * 計算天干地支
   * @param {Number} num 60進制中的位置（把60個天干地支，當成一個60進制的數）
   */
  function cyclical(num) {
    return(DATA.heavenlyStems[num%10]+DATA.earthlyBranches[num%12]);
  }
  
  /**
   * 獲取干支紀年
   * @param {Number} year 干支所在年
   * @param {Number} offset 偏移量，默認為0，便於查詢一個年跨兩個干支紀年（以立春為分界線）
   */
  function getLunarYearName(year,offset){
    offset = offset || 0;
    //1890年1月小寒（小寒一般是1月5或6日）以前為己丑年，在60進制中排25
    return cyclical(year-1890+25+offset);
  };
  
  /**
   * 獲取干支紀月
   * @param {Number} year,month 公歷年，干支所在月
   * @param {Number} offset 偏移量，默認為0，便於查詢一個月跨兩個干支紀月（有立春的2月）
   */
  function getLunarMonthName(year,month,offset){
    offset = offset || 0;
    //1890年1月小寒以前為丙子月，在60進制中排12
    return cyclical((year-1890)*12+month+12+offset);
  };
  
  /**
   * 獲取干支紀日
   * @param {Number} year,month,day 公歷年，月，日
   */
  function getLunarDayName(year,month,day){
    //當日與1890/1/1相差天數
    //1890/1/1與1970/1/1相差29219日，1890/1/1日柱為壬午日（60進制18）
    var dayCyclical = Date.UTC(year,month,day)/86400000+29219+18;
    return cyclical(dayCyclical);
  };
  
  /**
   * 獲取公曆月份的天數
   * @param {Number} year 公歷年
   * @param {Number} month 公歷月
   */
  function getSolarMonthDays(year,month){
     var monthDays = [31,isLeapYear(year)?29:28,31,30,31,30,31,31,30,31,30,31];
     return monthDays[month];
  };
  
  /**
   * 判斷公歷年是否是閏年
   * @param {Number} year 公歷年
   */
  function isLeapYear(year){
    return ((year%4==0 && year%100 !=0) || (year%400==0));
  };
    
  /*
   * 統一日期輸入參數（輸入月份從1開始，內部月份統一從0開始）
   */
  function formateDate(year,month,day,_minYear){
    var argsLen = arguments.length;
    var now = new Date();
    year = argsLen ? parseInt(year,10) : now.getFullYear();
    month = argsLen ? parseInt(month-1,10) : now.getMonth();
    day = argsLen ? parseInt(day,10) || now.getDate() : now.getDate();
    if(year < (_minYear ? _minYear : minYear+1) || year > maxYear)return {error:100, msg:errorCode[100]};
    return {
      year : year,
      month : month,
      day : day
    };
  };
  
  /**
   * 將農曆轉換為公曆
   * @param {Number} year,month,day 農曆年，月（1-13，有閏月），日
   */
  function lunarToSolar(_year,_month,_day){
    var inputDate = formateDate(_year,_month,_day);
    if(inputDate.error)return inputDate;
    var year = inputDate.year;
    var month = inputDate.month;
    var day = inputDate.day;
    
    var between = getDaysBetweenZheng(year,month,day); //離正月初一的天數
    var yearData = lunarInfo[year-minYear];
    var zenMonth = yearData[1];
    var zenDay = yearData[2];
    
    var offDate = new Date(year,zenMonth-1,zenDay).getTime() + between * 86400000;
      offDate = new Date(offDate);
    return {
      year : offDate.getFullYear(),
      month : offDate.getMonth()+1,
      day : offDate.getDate()
    };
  };
  
  /**
   * 將公曆轉換為農曆
   * @param {Number} year,month,day 公歷年，月，日
   */
  function solarToLunar(_year,_month,_day){
    var inputDate = formateDate(_year,_month,_day,minYear);
    if(inputDate.error)return inputDate;
    var year = inputDate.year;
    var month = inputDate.month;
    var day = inputDate.day;
    
    cacheUtil.setCurrent(year);
    //立春日期
    var term2 = cacheUtil.get('term2') ? cacheUtil.get('term2') : cacheUtil.set('term2',getTerm(year,2));
    //二十四節氣
    var termList = cacheUtil.get('termList') ? cacheUtil.get('termList') : cacheUtil.set('termList',getYearTerm(year));
    
    var firstTerm = getTerm(year,month*2); //某月第一個節氣開始日期
    var GanZhiYear = (month>1 || month==1 && day>=term2) ? year+1 : year;//干支所在年份
    var GanZhiMonth = day>=firstTerm ? month+1 : month; //干支所在月份（以節氣為界）
    
    var lunarDate = getLunarByBetween(year,month,day);
    var lunarLeapMonth = getLunarLeapYear(lunarDate[0]);
    var lunarMonthName = '';
    if(lunarLeapMonth>0 && lunarLeapMonth==lunarDate[1]){
      lunarMonthName = '閏'+DATA.monthCn[lunarDate[1]-1]+'月';
    }else if(lunarLeapMonth>0 && lunarDate[1]>lunarLeapMonth){
      lunarMonthName = DATA.monthCn[lunarDate[1]-1]+'月';
    }else{
      lunarMonthName = DATA.monthCn[lunarDate[1]]+'月';
    }
    
    var solarFtv = solarFestival[formateDayD4(month,day)] ? solarFestival[formateDayD4(month,day)] : [];
    var lunarFtv = false;
    var lunarMonthDays = getLunarYearDays(lunarDate[0]).monthDays;

    if(lunarDate[1] == lunarMonthDays.length-1 && lunarDate[2]==lunarMonthDays[lunarMonthDays.length-1]){
      lunarFtv = lunarFestival['d0100'];
    }else if(lunarLeapMonth>0 && lunarDate[1]>lunarLeapMonth){
      lunarFtv = lunarFestival[formateDayD4(lunarDate[1]-1,lunarDate[2])] ? lunarFestival[formateDayD4(lunarDate[1]-1,lunarDate[2])] : [];
    }else{
      // lunarFtv = lunarFestival[formateDayD4(lunarDate[1],lunarDate[2])] ? lunarFestival[formateDayD4(lunarDate[1],lunarDate[2])] : [];
    }

    var res = {
      zodiac : getYearZodiac(GanZhiYear),
      GanZhiYear : getLunarYearName(GanZhiYear),
      GanZhiMonth : getLunarMonthName(year,GanZhiMonth),
      GanZhiDay : getLunarDayName(year,month,day),
      worktime : (termList[formateDayD4(month,day)] == '清明') || (solarFtv.length ? solarFtv[1] : false) || (lunarFtv.length ? lunarFtv[1] : false),
      term : termList[formateDayD4(month,day)],
      
      lunarYear : lunarDate[0],
      lunarMonth : lunarDate[1]+1,
      lunarDay : lunarDate[2],
      lunarMonthName : lunarMonthName,
      lunarDayName : DATA.dateCn[lunarDate[2]-1],
      lunarLeapMonth : lunarLeapMonth,
      
      solarFestival : solarFtv.length ? solarFtv[0] : [],
      lunarFestival : lunarFtv.length ? lunarFtv[0] : []
    };

    return res;
  }
  
  /**
   * 獲取指定公曆月份的農曆數據
   * return res{Object}
   * @param {Number} year,month 公歷年，月
   * @param {Boolean} fill 是否用上下月數據補齊首尾空缺，首例數據從週日開始
   */
  function calendar(_year,_month,fill){
    var inputDate = formateDate(_year,_month);
    if(inputDate.error)return inputDate;
    var year = inputDate.year;
    var month = inputDate.month;
    
    var calendarData = solarCalendar(year,month+1,fill);
    for(var i=0;i<calendarData.monthData.length;i++){
      var cData = calendarData.monthData[i];
      var lunarData = solarToLunar(cData.year,cData.month,cData.day);
      extend(calendarData.monthData[i],lunarData);
    }
    return calendarData;
  }
  
  /**
   * 公曆某月日曆
   * return res{Object}
   * @param {Number} year,month 公歷年，月
   * @param {Boolean} fill 是否用上下數據補齊首尾空缺，首例數據從周日開始（7 * 6陣列）
   */
  function solarCalendar(_year,_month,fill){
    var inputDate = formateDate(_year,_month);
    if(inputDate.error)return inputDate;
    var year = inputDate.year;
    var month = inputDate.month;
    
    var firstDate = new Date(year,month,1);
    var preMonthDays,preMonthData,nextMonthData;
    
    var res = {
      firstDay : firstDate.getDay(), //該月1號星期幾
      monthDays : getSolarMonthDays(year,month), //該月天数
      monthData : []
    };
    
    res.monthData = creatLenArr(year,month+1,res.monthDays,1);

    if(fill){
      if(res.firstDay > 0){ //前補
        var preYear = month-1<0 ? year-1 : year;
        var preMonth = month-1<0 ? 11 : month-1;
        preMonthDays = getSolarMonthDays(preYear,preMonth);
        preMonthData = creatLenArr(preYear,preMonth+1,res.firstDay,preMonthDays-res.firstDay+1);
        res.monthData = preMonthData.concat(res.monthData);
      }
      
      if(7*6 - res.monthData.length!=0){ //後補
        var nextYear = month+1>11 ? year+1 : year;
        var nextMonth = month+1>11 ? 0 : month+1;
        var fillLen = 7*6 - res.monthData.length;
        nextMonthData = creatLenArr(nextYear,nextMonth+1,fillLen,1);
        res.monthData = res.monthData.concat(nextMonthData);
      }
    }
    
    return res;
  };
  
  var LunarCalendar = {
    solarToLunar : solarToLunar,
    lunarToSolar : lunarToSolar,
    calendar : calendar,
    solarCalendar : solarCalendar,
    getSolarMonthDays : getSolarMonthDays,
    setSolarFestival : function (d) {
      extend(solarFestival, d);
    },
    setLunarFestival : function (d) {
      extend(lunarFestival, d);
    },
  };
  
  if (typeof define === 'function'){
    define (function (){
      return LunarCalendar;
    });
  }else if(typeof exports === 'object'){
    module.exports = LunarCalendar;
  }else{
    window.LunarCalendar = LunarCalendar;
  };
})();
