import React from 'react'
import { Menu } from 'semantic-ui-react'
import Link from 'next/link'

const Header = () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Menu.Item link>
        <Link href="/">Crowdcoin</Link>
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item link>
          <Link href="/">Campaigns</Link>
        </Menu.Item>
        <Menu.Item link>
          <Link href="/campaigns/new">+</Link>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  )
}

export default Header
