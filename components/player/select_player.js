// components/player/select.js
const Role = require('../../utils/role.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    member:{
      type: Object,
      value:{},
    },
    is_checked: {
      type: Boolean,
      value: false
    },
    roletype:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[],
    plist:[]
  },

  lifetimes: {
    attached() {
      if (this.data.roletype == 3) {
        this.setData({
          list: Role.Player,
          plist:Role.Position,
          is_checked: this.data.member.is_checked
        })
      }
    },
  },


  /**
   * 组件的方法列表
   */
  methods: {
    handleCheck: function (e) {
      console.log('eee', e);
    

      let new_member = this.data.member;

      if(this.data.is_checked == 0){
        //首发默认
        if (!new_member.is_first || parseInt(new_member.is_first) == 0) {
          new_member['is_first'] = 1
        }

        //身份默认
        if (!new_member.sub_rights || parseInt(new_member.sub_rights) == 0) {
          new_member.sub_rights = 1;
          new_member.sub_rights_name = '队员';
        }

        //位置默认
        if (!new_member.position || parseInt(new_member.position) == 0) {
          new_member['position'] = 1;
          new_member['position_name'] = '前锋';
        } 
      }
      new_member['is_checked'] = !this.data.is_checked;

      this.setData({
        member: new_member,
        is_checked: !this.data.is_checked
      })

      const myEventDetail = new_member;
      const myEventOption = {};
      this.triggerEvent('itemsChanged', myEventDetail, myEventOption)

    },
    buttonSelectAction(e) {
      let new_member = this.data.member;

      //首发默认
      if (!new_member.is_first || parseInt(new_member.is_first) == 0) {
        new_member['is_first'] = 1
      }

  
      //位置默认
      if (!new_member.position || parseInt(new_member.position) == 0) {
        new_member['position'] = 1;
        new_member['position_name'] = '前锋';
      } 

      if (this.data.roletype == 3) {
        new_member['sub_rights'] = e.target.dataset.rights.id;
        new_member['sub_rights_name'] = e.target.dataset.rights.name;
      }

      new_member['is_checked'] = true;

      this.setData({
        member: new_member,
        is_checked:true
      })

      const myEventDetail = new_member;
      const myEventOption = {};
      this.triggerEvent('itemsChanged', myEventDetail, myEventOption)
    },

    buttonSelectFirstAction:function(e){

      let new_member = this.data.member;

      //身份默认
      if (!new_member.sub_rights || parseInt(new_member.sub_rights) == 0) {
        new_member.sub_rights = 1;
        new_member.sub_rights_name = '队员';
      }

      //位置默认
      if (!new_member.position || parseInt(new_member.position) == 0) {
        new_member['position'] = 1;
        new_member['position_name'] = '前锋';
      } 

      new_member['is_first'] = e.target.dataset.first;
      new_member['is_checked'] = true;

      this.setData({
        member: new_member,
        is_checked:true
      })

      const myEventDetail = new_member;
      const myEventOption = {};
      this.triggerEvent('itemsChanged', myEventDetail, myEventOption)
    },
    buttonSelectPositionAction:function(e){
      
      let new_member = this.data.member;

      //首发默认
      if (!new_member.is_first || parseInt(new_member.is_first) == 0) {
        new_member.is_first = 1
      }

      //身份默认
      if(!new_member.sub_rights || parseInt(new_member.sub_rights) == 0){
        new_member.sub_rights = 1;
        new_member.sub_rights_name = '队员';
      }

      new_member['position'] = e.target.dataset.position.id;
      new_member['position_name'] = e.target.dataset.position.name;

      new_member['is_checked'] = true;

      this.setData({
        member: new_member,
        is_checked:true
      })

      const myEventDetail = new_member;
      const myEventOption = {};
      this.triggerEvent('itemsChanged', myEventDetail, myEventOption)
    },

    editNumberAction: function (e) {
      let new_member = this.data.member;
      const myEventDetail = new_member;
      const myEventOption = {};
      this.triggerEvent('editNumberActionCallBack', myEventDetail, myEventOption)
    }
  }
 
})
