import React, { Component } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import WebGLCanvas from './Components/webglCanvas';
import commonFunctions from './Components/commonFunctions';

export default class App extends Component {

	getSceneFile() {
		commonFunctions.parseSceneFile("./SceneFiles/alienScene.json", this.outputSceneFile)
		
	}

	outputSceneFile(data) {
		console.log(data);
	}

	render() {
		return (
			<Grid textAlign='center'>
				<Grid.Row>
					<Grid.Column>
						Title here
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column>
						<WebGLCanvas />
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column>
						<Button onClick={() => this.getSceneFile()} >Parse File</Button>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		)
	}

}

