// components/player/select.js
const Role = require('../../utils/role.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    member:{
      type:Object,
      value:{},
    },
    name:{
      type: String,
      value:''
    },
    roletype:{
      type: Number,
      value:0
    },
    is_checked:{
      type:Boolean,
      value:false
    },
  },

  lifetimes: {
    attached() {

      if (this.data.roletype == 1) {
        this.setData({
          list: Role.Leader,
          is_checked:this.data.member.is_checked
        })
      }

      if (this.data.roletype == 2) {
        this.setData({
          list: Role.Coach,
          is_checked: this.data.member.is_checked
        })
      }

      if (this.data.roletype == 4) {
        this.setData({
          list: Role.Office,
          is_checked: this.data.member.is_checked
        })
      }

    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleCheck:function(){
      let new_member = this.data.member;

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

      if (this.data.roletype == 1) {
        new_member['sub_rights'] = e.target.dataset.rights.id;
        new_member['sub_rights_name'] = e.target.dataset.rights.name;
      }

      if (this.data.roletype == 2) {
        new_member['sub_rights'] = e.target.dataset.rights.id;
        new_member['sub_rights_name'] = e.target.dataset.rights.name;
      }

      if (this.data.roletype == 4) {
        new_member['sub_rights'] = e.target.dataset.rights.id;
        new_member['sub_rights_name'] = e.target.dataset.rights.name;
      }

      new_member['is_checked'] = 1;

      this.setData({
        member: new_member,
        is_checked:1
      })

      const myEventDetail = new_member;
      const myEventOption = {};
      this.triggerEvent('itemsChanged', myEventDetail, myEventOption)
    }
  }
})
