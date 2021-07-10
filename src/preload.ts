import random from './random'
import { copyPasteOut } from './utils/helper'

const enter = (action) => {  
  switch (action.code) {
    case 'phone':
      copyPasteOut(random.people.phone())
      break
    case 'address':
      copyPasteOut(random.address.county())
      break
    case 'school':
      copyPasteOut(random.school.school())
      break
    case 'username':
      copyPasteOut(random.people.name())
      break
    case 'idcard':
      copyPasteOut(random.people.idcard())
      break
    case 'text':
      copyPasteOut(random.saying.generator())
      break
    case 'email':
      copyPasteOut(random.web.email())
      break
    case 'quotes':
      copyPasteOut(random.saying.quotes())
      break
    case 'domain':
      copyPasteOut(random.web.domain())
      break
    case 'ip':
      copyPasteOut(random.web.ip())
      break
  }
}

window.exports = {
  phone: {
    mode: 'none',
    args: {
      enter: (action) => enter(action),
    },
  },
  address: {
    mode: 'none',
    args: {
      enter: (action) => enter(action),
    },
  },
  school: {
    mode: 'none',
    args: {
      enter: (action) => enter(action),
    },
  },
  username: {
    mode: 'none',
    args: {
      enter: (action) => enter(action),
    },
  },
  idcard: {
    mode: 'none',
    args: {
      enter: (action) => enter(action),
    },
  },
  text: {
    mode: 'none',
    args: {
      enter: (action) => enter(action),
    },
  },
  email: {
    mode: 'none',
    args: {
      enter: (action) => enter(action),
    },
  },
  quotes: {
    mode: 'none',
    args: {
      enter: (action) => enter(action),
    },
  },
  domain: {
    mode: 'none',
    args: {
      enter: (action) => enter(action),
    },
  },
  ip: {
    mode: 'none',
    args: {
      enter: (action) => enter(action),
    },
  },
}
