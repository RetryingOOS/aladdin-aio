// import { Avatar, Tooltip, Whisper } from 'rsuite';
// import React from 'react';
// import { Link } from 'react-router-dom';
// import cogoToast from 'cogo-toast';
// import { connect } from 'react-redux';

// const headerStyles = {
//   padding: 18,
//   fontSize: 16,
//   height: 56,
//   // background: '#34c3ff',
//   color: ' #fff',
//   whiteSpace: 'nowrap',
//   overflow: 'hidden',
// };

// function DiscordAvatar(props) {
//   return (
//     <Avatar
//       style={{
//         position: 'absolute',
//         left: '8px',
//         bottom: '47px',
//       }}
//       circle
//       src={props.discordAvatar}
//       alt="RU"
//     />
//   );
// }

// function SidebarReact(props) {
//   function capitalizeFirstLetter(string) {
//     try {
//       return string.charAt(0).toUpperCase() + string.slice(1);
//     } catch (e) {
//       return '';
//     }
//   }
//   const pages = [
//     { link: 'dashboard', name: 'Dashboard', icon: 'dashboard' },
//     { link: 'tasks', name: 'Tasks', icon: 'task' },
//     { link: 'profiles', name: 'Profiles', icon: 'group' },
//     { link: 'proxies', name: 'Proxies', icon: 'wifi' },
//     { link: 'captcha', name: 'Captcha', icon: 'google' },
//     { link: 'accounts', name: 'Accounts', icon: 'file-text' },
//     { link: 'sessions', name: 'Sessions', icon: 'web' },
//     { link: 'settings', name: 'Settings', icon: 'cogs' },
//   ];

//   return (
//     <div className="sidebar">
//       <div className="logo-details">
//         <i className="bx bxl-c-plus-plus icon" />
//         <div className="logo_name">Aladdin AIO</div>
//         <i className="bx bx-menu" id="btn" />
//       </div>
//       <ul className="nav-list">
//         <li>
//           <i className="bx bx-search" />
//           <input type="text" placeholder="Search..." />
//           <span className="tooltip">Search</span>
//         </li>
//         <li>
//           <a href="#">
//             <i className="bx bx-grid-alt" />
//             <span className="links_name">Dashboard</span>
//           </a>
//           <span className="tooltip">Dashboard</span>
//         </li>
//         <li>
//           <a href="#">
//             <i className="bx bx-user" />
//             <span className="links_name">User</span>
//           </a>
//           <span className="tooltip">User</span>
//         </li>
//         <li>
//           <a href="#">
//             <i className="bx bx-chat" />
//             <span className="links_name">Messages</span>
//           </a>
//           <span className="tooltip">Messages</span>
//         </li>
//         <li>
//           <a href="#">
//             <i className="bx bx-pie-chart-alt-2" />
//             <span className="links_name">Analytics</span>
//           </a>
//           <span className="tooltip">Analytics</span>
//         </li>
//         <li>
//           <a href="#">
//             <i className="bx bx-folder" />
//             <span className="links_name">File Manager</span>
//           </a>
//           <span className="tooltip">Files</span>
//         </li>
//         <li>
//           <a href="#">
//             <i className="bx bx-cart-alt" />
//             <span className="links_name">Order</span>
//           </a>
//           <span className="tooltip">Order</span>
//         </li>
//         <li>
//           <a href="#">
//             <i className="bx bx-heart" />
//             <span className="links_name">Saved</span>
//           </a>
//           <span className="tooltip">Saved</span>
//         </li>
//         <li>
//           <a href="#">
//             <i className="bx bx-cog" />
//             <span className="links_name">Setting</span>
//           </a>
//           <span className="tooltip">Setting</span>
//         </li>
//         <li className="profile">
//           <div className="profile-details">
//             <img src="profile.jpg" alt="profileImg" />
//             <div className="name_job">
//               <div className="name">Prem Shahi</div>
//               <div className="job">Web designer</div>
//             </div>
//           </div>
//           <i className="bx bx-log-out" id="log_out" />
//         </li>
//       </ul>
//     </div>
//   );
// }

// const mapStateToProps = (state) => ({ state });
// export default connect(mapStateToProps)(SidebarReact);
