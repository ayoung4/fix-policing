import * as React from 'react';
import { Icon } from 'semantic-ui-react';
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

export const SocialBar: React.FC = () => (
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
                    url={'https://fixpolicing.com'}
                >
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
                <FacebookShareCount
                    url={'https://fixpolicing.com'}
                />
                <TwitterShareButton
                    url={'https://fixpolicing.com'}
                >
                    <TwitterIcon size={32} round />
                </TwitterShareButton>
                <LinkedinShareButton
                    url={'https://fixpolicing.com'}
                >
                    <LinkedinIcon size={32} round />
                </LinkedinShareButton>
                <RedditShareButton
                    url={'https://fixpolicing.com'}
                    windowWidth={660}
                    windowHeight={460}
                >
                    <RedditIcon size={32} round />
                </RedditShareButton>
                <TumblrShareButton
                    url={'https://fixpolicing.com'}
                >
                    <TumblrIcon size={32} round />
                </TumblrShareButton>
            </div>
        </div>
    </div>
);
