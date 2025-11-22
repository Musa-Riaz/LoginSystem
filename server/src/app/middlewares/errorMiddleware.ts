import { Request, Response, NextFunction } from 'express';
/**
 * Universal Express error middleware
 * - Normalizes different error shapes into a consistent JSON response
 * - Avoids leaking sensitive details in production
 * - Logs error server-side (console by default)
 *
 * Response shape:
 * {
 *   success: false,
 *   message: string,
 *   details?: any,
 *   stack?: string // only in non-production
 * }
 */

export default function errorMiddleware(err: unknown, req: Request, res: Response, next: NextFunction) {
    try {
        //Default values
        const env = process.env.NODE_ENV || 'development';
        let status = 500;
        let message = 'Internal Server Error';
        let details: unknown = undefined;


        //normalize common error shapes
        if (err && typeof err === 'object') {
            const e = err as any;

            // If the error already carries an http status
            if (typeof e.status === 'number') status = e.status;
            if (typeof e.statusCode === 'number') status = e.statusCode;
            //message
            if (typeof e.message === 'string' && e.message.length > 0) message = e.message;

            //express body pasrser  / JSON parser errors
            // e.type === 'entity.parse.failed' or SyntaxError with body
            if (e.type === 'entity.parse.failed' || (e instanceof SyntaxError && 'body' in e)) {
                status = 400;
                message = 'Invalid JSON payload';
                details = e.message;
            }

            // Validation libraries (Joi, Zod, express-validator) often expose `errors` or `issues`
            if (Array.isArray(e.errors) && e.errors.length) {
                status = status === 500 ? 400 : status;
                details = e.errors;
                // prefer an explicit message if present
                if (!e.message || e.message === 'Error') message = 'Validation failed';
            } else if (Array.isArray(e.issues) && e.issues.length) {
                status = status === 500 ? 400 : status;
                details = e.issues;
                if (!e.message || e.message === 'Error') message = 'Validation failed';
            }
            // Multer or other file-upload libs expose `code`
            if (typeof e.code === 'string') {
                // Common multer codes: LIMIT_FILE_SIZE, LIMIT_UNEXPECTED_FILE, etc
                status = 400;
                details = e.code;
                if (!e.message || e.message.length === 0) message = 'File upload error';
            }
            // If some libraries set `statusText` or `status_message`
            if (typeof e.statusText === 'string' && !e.message) message = e.statusText;
            if (typeof e.status_message === 'string' && !e.message) message = e.status_message;
        }
        else if (typeof err === 'string') {
            message = err;
            status = 400;
        }

        // Log server-side (keep it simple; projects can swap to a real logger)
        // Include request id, path and method if available
        const reqInfo = `${req.method} ${req.originalUrl}`;
        // Try to keep logs compact but informative
        // Avoid logging request body by default to reduce leaking secrets
        // Logging stack when available
        if (err instanceof Error) {
            console.error(`[error] ${status} ${reqInfo} -`, err.stack || err.message);
        } else {
            console.error(`[error] ${status} ${reqInfo} -`, err);
        }
        //constructing the response body
        const body: { success: false, message: string, details?: unknown, stack?: unknown } = {
            success: false,
            message
        }

        if (details !== undefined) body.details = details;

        // In non-production include the stack (when available)
        if (env !== 'production' && err instanceof Error && err.stack) {
            body.stack = err.stack;
        }

        // Ensure status is a valid HTTP status
        if (!Number.isInteger(status) || status < 100 || status > 599) status = 500;

        //returning the response
        res.status(status).json(body);
    }
    catch (err) {
        console.error("Error in middleware", err);
        try {
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            })
        }
        catch (err) {
            console.error("Error in middleware", err);
        }
    }
}