import { AotPlugin } from '@ngtools/webpack';
export declare const getWebpackNonAotConfigPartial: (projectRoot: string, appConfig: any) => {
    resolve: {
        plugins: any[];
    };
    module: {
        rules: {
            test: RegExp;
            loaders: ({
                loader: string;
                query: {
                    forkChecker: boolean;
                    tsconfig: string;
                };
            } | {
                loader: string;
            })[];
            exclude: RegExp[];
        }[];
    };
    plugins: any[];
};
export declare const getWebpackAotConfigPartial: (projectRoot: string, appConfig: any) => {
    module: {
        rules: {
            test: RegExp;
            loader: string;
            exclude: RegExp[];
        }[];
    };
    plugins: AotPlugin[];
};
