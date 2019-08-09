import leagueHttp from "../../../../utils/league_http.js";
const Role = require("../../../../utils/role.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    team: 0,
    id:0,
    show:false,
    number:0,
    member:null,
    member_list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      type: parseInt(options.type),
      team:options.team_id,
      id:options.id
    });
    console.log(Role);
    
    this.loadPlayer();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onConfirm(event){

    console.log('改了2', this.data.number);
    this.data.member['number'] = this.data.number ? this.data.number+'号' : ''; 

    let item = this.data.member;
    let old_list = this.data.member_list;
    for (let index = 0; index < old_list.length; index++) {
      if (old_list[index].id == item.id) {
        old_list[index] = item;
      }
    }
    console.log('设置', this.data.number, this.data.member['number'], old_list);

    this.setData({ member_list:old_list, show: false });
  },
  onClose:function(){
  },

  onChange:function(e){
    this.data.number = e.detail.value;
    console.log('改了', this.data.number, e.detail.value);
  },

  otherItemsChanged:function(e){
    let item = e.detail;
    let old_list = this.data.member_list;
    for(let index = 0; index<old_list.length; index++){
      if(old_list[index].id == item.id){
        old_list[index] = item;
      }
    }
  },
  playerItemsChanged:function(e){
    let item = e.detail;
    let old_list = this.data.member_list;
    for (let index = 0; index < old_list.length; index++) {
      if (old_list[index].id == item.id) {
        old_list[index] = item;
      }
    }
  },

  editNumberActionCallBack:function(e){
    let item = e.detail;
    let number = item.number.replace('号', '');
    this.setData({
      show: true,
      number: number,
      member:item
    });
  },

  loadPlayer: function(){
    var self = this;
    wx.showLoading();
    leagueHttp.post("GET_ALL_LINEUP", 
    { id: this.data.id, team_id: this.data.team, rights: this.data.type }, 
    function (res) {
      wx.hideLoading();
      if (res.code != 200) {
        wx.showToast({
          title: res.err,
          icon: 'none',
          duration: 3000
        });
        return;
      }
      
      wx.getStorage({
        key: 'lineup',
        success: function (response) {
          let data = response.data;
          if (self.data.type == 1 && data.leader_list){
            self.checkData(data.leader_list, res.info);
          }else
          if (self.data.type == 2 && data.coach_list){
            self.checkData(data.coach_list, res.info);
          }else
          if (self.data.type == 3 && data.player_list){
            self.checkData(data.player_list, res.info);
          }else
          if (self.data.type == 4 && data.other_list){
            self.checkData(data.other_list, res.info);
          }else{
            self.checkData([], res.info);
          }
          
        },
        fail:function(e){
          self.checkData([], res.info);
        }
      }) 
    });
  },
  checkData:function(local_list, all_list){
    for(var index = 0; index<all_list.length; index ++) {
      all_list[index]['match_id'] = this.data.id;
      all_list[index]['l_player_id'] = all_list[index]['id'];
      for(var local_index =0; local_index<local_list.length; local_index ++){
        if (all_list[index].id == local_list[local_index].l_player_id){
          let keys = Object.keys(local_list[local_index]);
          for (let key in keys){
              all_list[index][keys[key]] = local_list[local_index][keys[key]]; 
          }
          all_list[index]['is_checked'] = 1;
        }
      }
    }
    console.log('checkdata', all_list);
    this.setData({
      member_list: all_list,
    })
  },
  //保存名单
  savelist:function(e){  
    let self = this;  
    let array = [];

    let has_team_leader = false;
    for (let index = 0; index < self.data.member_list.length; index ++){
      let member = self.data.member_list[index];
      if(member.is_checked){

        if(self.data.type == 3){

          if (!member.position || parseInt(member.position) <= 0) {
            wx.showToast({
              icon: 'none',
              title: member.name + '缺少场上位置',
            })
            return;
          }

          if (!member.is_first || parseInt(member.is_first) <= 0) {
            wx.showToast({
              icon: 'none',
              title: member.name + '缺少场上类型',
            })
            return;
          }

          if (!member.sub_rights || parseInt(member.sub_rights) <= 0) {
            wx.showToast({
              icon: 'none',
              title: member.name + '缺少场上身份',
            })
            return;
          }

          if (parseInt(member.sub_rights) == 2 && has_team_leader == true){
            wx.showToast({
              icon: 'none',
              title: '出场阵容只能有一个队长',
            })
            return;
          }

          if (parseInt(member.sub_rights) == 2){
            has_team_leader = true;
          }

        
          let number = member.number.replace('号', '');
          if (!number || parseInt(number) <= 0) {
            wx.showToast({
              icon: 'none',
              title: member.name + '缺少场上号码',
            })
            return;
          }
        }
        
        array.push(member);
      }
    }


    if(self.data.type == 3){
      let hash = {};
      for(let index = 0; index<array.length; index ++ ){
        let member = array[index];
        if (!hash[member.number]){
          hash[member.number] = member;
        }else{
          wx.showToast({
            icon: 'none',
            title: hash[member.number].name + '与' + member.name + '的号码重复',
          })
          return;
        }
      }
    }


    wx.getStorage({
      key: 'lineup',
      success: function (response) {
        let data = response.data;
        if (self.data.type == 1) {
          data['leader_list'] = array;
        } else 
        if (self.data.type == 2) {
          data['coach_list'] = array;
        } else
        if (self.data.type == 3) {
          data['player_list'] = array;
        } else
        if (self.data.type == 4) {
          data['other_list'] = array;
        } 
        
       

        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.updateData(data);

        wx.navigateBack({
          delta:1
        });

      },
      fail: function (e) {
        wx.showToast({
          title: '保存失败',
        });
      }
    })
   
  }
})