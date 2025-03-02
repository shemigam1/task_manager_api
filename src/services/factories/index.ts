import Auth from '../classes/auth';
import Task from '../classes/task';

export const authFactory = () => {
	// define parameters for initialization here

	return new Auth();
};


export const taskFactory = () => {
	return new Task()
}