import { Sidenav, Sidebar, Nav, Icon, Avatar, Tooltip, Whisper } from 'rsuite';
import React from 'react';
import { Link } from 'react-router-dom';
import cogoToast from 'cogo-toast';
import { connect } from 'react-redux';

const headerStyles = {
  padding: 18,
  fontSize: 16,
  height: 56,
  // background: '#34c3ff',
  color: ' #fff',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

function DiscordAvatar(props) {
  return (
    <Avatar
      style={{
        position: 'absolute',
        left: '8px',
        bottom: '47px',
      }}
      circle
      src={props.discordAvatar}
      alt="RU"
    />
  );
}

function SidebarReact(props) {
  function capitalizeFirstLetter(string) {
    try {
      return string.charAt(0).toUpperCase() + string.slice(1);
    } catch (e) {
      return '';
    }
  }
  const pages = [
    { link: 'dashboard', name: 'Dashboard', icon: 'dashboard' },
    { link: 'tasks', name: 'Tasks', icon: 'task' },
    { link: 'profiles', name: 'Profiles', icon: 'group' },
    { link: 'proxies', name: 'Proxies', icon: 'wifi' },
    { link: 'captcha', name: 'Captcha', icon: 'google' },
    { link: 'accounts', name: 'Accounts', icon: 'file-text' },
    { link: 'sessions', name: 'Sessions', icon: 'web' },
    { link: 'settings', name: 'Settings', icon: 'cogs' },
  ];

  return (
    <div style={{ height: '100%' }} className="navbar">
      <Sidebar style={{ display: 'flex', flexDirection: 'column' }}>
        <Sidenav
          // onSelect={handleSelect}
          expanded={false}
          defaultOpenKeys={['3']}
          appearance="subtle"
        >
          <Sidenav.Header>
            <div style={headerStyles}>
              <img
                style={{ position: 'absolute', left: '5px', top: '5px' }}
                src="./assets/logo_transparent.png"
                alt="logo"
                width="50"
              />
            </div>
          </Sidenav.Header>
          <Sidenav.Body>
            <Nav>
              {pages.map((page) => (
                <Link key={page.link} to={page.link}>
                  <Whisper
                    placement="right"
                    trigger="hover"
                    speaker={<Tooltip>{page.name}</Tooltip>}
                  >
                    <Nav.Item eventKey="1" icon={<Icon icon={page.icon} />}>
                      {capitalizeFirstLetter(page.link)}
                    </Nav.Item>
                  </Whisper>
                </Link>
              ))}
            </Nav>
            <Whisper
              placement="right"
              trigger="hover"
              speaker={<Tooltip>{props.state.discordUsername}</Tooltip>}
            >
              <DiscordAvatar discordAvatar={props.state.discordAvatar} />
            </Whisper>
          </Sidenav.Body>
        </Sidenav>
      </Sidebar>
    </div>
  );
}

const mapStateToProps = (state) => ({ state });
export default connect(mapStateToProps)(SidebarReact);
