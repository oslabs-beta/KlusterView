import {
  Request,
  Response,
  RequestHandler,
  NextFunction,
  Errback
} from 'express';
import { MethodError } from '../types';
import * as child from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { create } from 'domain';

type InitializationController = { [k: string]: RequestHandler };
const initializationController: InitializationController = {};

initializationController.initializeGrafana = async (): Promise<void> => {};
