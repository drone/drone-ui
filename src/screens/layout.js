import BuildLogs, { BuildLogsTitle } from "screens/repo/screens/build";
import { DOCK_RIGHT, Drawer } from "shared/components/drawer/drawer";
import { Link, Route, Switch } from "react-router-dom";
import React, { Component } from "react";
import UserRepos, { UserRepoTitle } from "screens/user/screens/repos";

import BuildMenu from "screens/repo/screens/build/menu";
import Feed from "screens/feed";
import MenuIcon from "shared/components/icons/menu";
import RedirectRoot from "./redirect";
import RepoBuilds from "screens/repo/screens/builds";
import RepoHeader from "screens/repo/screens/builds/header";
import RepoMenu from "screens/repo/screens/builds/menu";
import RepoRegistry from "screens/repo/screens/registry";
import RepoSecrets from "screens/repo/screens/secrets";
import RepoSettings from "screens/repo/screens/settings";
import { Snackbar } from "shared/components/snackbar";
import UserReposMenu from "screens/user/screens/repos/menu";
import UserTokens from "screens/user/screens/tokens";
import { branch } from "baobab-react/higher-order";
import classnames from "classnames";
import { connectScreenSize } from "react-screen-size";
import { inject } from "config/client/inject";
import styles from "./layout.less";

const binding = (props, context) => {
	return {
		user: ["user"],
		message: ["message"],
		sidebar: ["sidebar"],
		menu: ["menu"],
	};
};

const mapScreenSizeToProps = screenSize => {
	return {
		isTablet: screenSize["small"],
		isMobile: screenSize["mobile"],
		isDesktop: screenSize["> small"],
	};
};

@inject
@branch(binding)
@connectScreenSize(mapScreenSizeToProps)
export default class Default extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			menu: false,
			feed: false,
		};

		this.openMenu = this.openMenu.bind(this);
		this.closeMenu = this.closeMenu.bind(this);
		this.closeSnackbar = this.closeSnackbar.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location !== this.props.location) {
			this.closeMenu(true);
		}
	}

	openMenu() {
		this.props.dispatch(tree => {
			tree.set(["menu"], true);
		});
	}

	closeMenu() {
		this.props.dispatch(tree => {
			tree.set(["menu"], false);
		});
	}

	render() {
		const { user, message, menu } = this.props;
		const isLoggedOut = !user || !user.data || user.data.login === "octocat";
		const classes = classnames(!user || !user.data ? styles.guest : null);
		if (isLoggedOut) {
			return (
				<div className={styles.classes}>
					<a href="/login" target="_self" className={styles.login}>
						Click to Login
					</a>
				</div>
			);
		}
		return (
			<div className={classes}>
				<div className={styles.left}>
					<Switch>
						<Route path={"/"} component={Feed} />
					</Switch>
				</div>
				<div className={styles.center}>
					<div className={styles.title}>
						<Switch>
							<Route path="/account/repos" component={UserRepoTitle} />
							<Route
								path="/:owner/:repo/:build(\d*)/:proc(\d*)"
								exact={true}
								component={BuildLogsTitle}
							/>
							<Route
								path="/:owner/:repo/:build(\d*)"
								component={BuildLogsTitle}
							/>
							<Route path="/:owner/:repo" component={RepoHeader} />
						</Switch>
						<div className={styles.avatar}>
							<img src={user.data.avatar_url} />
						</div>
						<button onClick={this.openMenu}>
							<MenuIcon />
						</button>
					</div>
					<Switch>
						<Route path="/account/token" exact={true} component={UserTokens} />
						<Route path="/account/repos" exact={true} component={UserRepos} />
						<Route
							path="/:owner/:repo/settings/secrets"
							exact={true}
							component={RepoSecrets}
						/>
						<Route
							path="/:owner/:repo/settings/registry"
							exact={true}
							component={RepoRegistry}
						/>
						<Route
							path="/:owner/:repo/settings"
							exact={true}
							component={RepoSettings}
						/>
						<Route
							path="/:owner/:repo/:build(\d*)"
							exact={true}
							component={BuildLogs}
						/>
						<Route
							path="/:owner/:repo/:build(\d*)/:proc(\d*)"
							exact={true}
							component={BuildLogs}
						/>
						<Route path="/:owner/:repo" exact={true} component={RepoBuilds} />
						<Route path="/" exact={true} component={RedirectRoot} />
					</Switch>
				</div>
				<Snackbar message={message.text} onClose={this.closeSnackbar} />

				<Drawer onClick={this.closeMenu} position={DOCK_RIGHT} open={menu}>
					<Switch>
						<Route
							path="/account/repos"
							exact={true}
							component={UserReposMenu}
						/>
						<Route
							path="/account/"
							exact={false}
							component={undefined}
						/>BuildMenu
						<Route
							path="/:owner/:repo/:build(\d*)/:proc(\d*)"
							exact={true}
							component={BuildMenu}
						/>
						<Route
							path="/:owner/:repo/:build(\d*)"
							exact={true}
							component={BuildMenu}
						/>
						<Route path="/:owner/:repo" exact={false} component={RepoMenu} />
					</Switch>
					<section>
						<ul>
							<li>
								<Link to="/account/repos">Repositories</Link>
							</li>
							<li>
								<Link to="/account/token">Token</Link>
							</li>
						</ul>
					</section>
					<section>
						<ul>
							<li>
								<a href="/logout" target="_self">
									Logout
								</a>
							</li>
						</ul>
					</section>
				</Drawer>
			</div>
		);
	}

	closeSnackbar() {
		this.props.dispatch(tree => {
			tree.unset(["message", "text"]);
		});
	}
}
