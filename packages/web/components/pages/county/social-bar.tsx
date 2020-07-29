import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import {
    TwitterShareButton,
    TwitterIcon,
    FacebookShareButton,
    FacebookShareCount,
    FacebookIcon,
    LinkedinShareButton,
    LinkedinIcon,
    RedditShareButton,
    RedditIcon,
    TumblrShareButton,
    TumblrIcon,
} from 'react-share';

import * as S from '../../../styles';

type SocialBarProps = {
    path: string;
};

export const ComputerSocialBar: React.FC<SocialBarProps> =
    ({ path }) => (
        <div style={{
            position: 'fixed',
            left: 0,
            width: '3rem',
            height: '100vh',
            zIndex: 999,
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: '#EFE91F',
                }}>
                    <FacebookShareButton
                        url={`https://fixpolicing.com/${path}`}
                    >
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton
                        url={`https://fixpolicing.com/${path}`}
                    >
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <LinkedinShareButton
                        url={`https://fixpolicing.com/${path}`}
                    >
                        <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                    <RedditShareButton
                        url={`https://fixpolicing.com/${path}`}
                        windowWidth={660}
                        windowHeight={460}
                    >
                        <RedditIcon size={32} round />
                    </RedditShareButton>
                    <TumblrShareButton
                        url={`https://fixpolicing.com/${path}`}
                    >
                        <TumblrIcon size={32} round />
                    </TumblrShareButton>
                </div>
            </div>
        </div>
    );

export const MobileSocialBar: React.FC<SocialBarProps> =
    ({ path }) => (
        <Menu fixed='bottom' size='small' widths={5} style={S.bkYellow}>
            <Menu.Item>
                <FacebookShareButton url={`https://fixpolicing.com/${path}`}>
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
            </Menu.Item>
            <Menu.Item>
                <TwitterShareButton url={`https://fixpolicing.com/${path}`}>
                    <TwitterIcon size={32} round />
                </TwitterShareButton>
            </Menu.Item>
            <Menu.Item>
                <LinkedinShareButton url={`https://fixpolicing.com/${path}`}>
                    <LinkedinIcon size={32} round />
                </LinkedinShareButton>
            </Menu.Item>
            <Menu.Item>
                <RedditShareButton
                    url={`https://fixpolicing.com/${path}`}
                    windowWidth={660}
                    windowHeight={460}
                >
                    <RedditIcon size={32} round />
                </RedditShareButton>
            </Menu.Item>
            <Menu.Item>
                <TumblrShareButton url={`https://fixpolicing.com/${path}`}>
                    <TumblrIcon size={32} round />
                </TumblrShareButton>
            </Menu.Item>
        </Menu>
    );
