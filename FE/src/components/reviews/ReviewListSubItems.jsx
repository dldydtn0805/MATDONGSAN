import {
  List,
  Avatar,
  ListItemText,
  ListItem,
  ListItemAvatar,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import fail from '../../assets/images/reviews/fail.png';
import reviewStore from '../../stores/reviewStore';
import styles from '../../styles/reviews/ReviewListSubItems.module.css';
import userStore from '../../stores/userStore';

function ReviewListSubItems(props) {
  const { myReviewStore } = reviewStore();
  const { isMyPage } = userStore();
  const { id } = props;
  const { userID } = useParams();
  const navigate = useNavigate();
  const filteredSubItems = myReviewStore.filter(
    (x) => x.id === Number(id)
  );
  const [selectedListItem, setSelectedListItem] = useState();
  return (
    <div>
      <div className={styles.btn}>
        {isMyPage && (
          <Button
            type="submit"
            variant="text"
            onClick={(e) => {
              e.stopPropagation();
              navigate('write');
            }}
            sx={{
              color: 'rgba(55,55,55,0.7)',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <EditIcon />
            기록하기
          </Button>
        )}
      </div>
      {filteredSubItems?.length > 0 ? (
        <div>
          <List>
            {filteredSubItems?.map((x, i) => (
              <ListItem
                key={[filteredSubItems[i].reviewID]}
                className={`${styles.container} ${x.reviewID === selectedListItem ? styles.selected : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`reviews/${x.reviewID}`);
                  setSelectedListItem(x.reviewID);
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt="사진"
                    src={`/assets/random/profile${x.accountReviews[0]?.picture}.png`}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={null}
                  secondary={
                    <Typography component="div">
                      <span className={styles.content}>
                        <span>
                          {x.reviewContent.length > 10
                            ? `${x.reviewContent.substring(0, 10)}...`
                            : x.reviewContent}
                        </span>
                        <span>
                          {dayjs(x.visitDate).format('YYYY-MM-DD')}
                        </span>
                      </span>
                      <span className={styles.info}>
                        {x.accountReviews?.map((z, zI) =>
                          zI < x.accountReviews.length - 1 ? (
                            <span key={z.nickname}>
                              {z.nickname}
                              <span style={{ margin: '0 2px' }}>
                                |
                              </span>
                            </span>
                          ) : (
                            <span key={z.nickname}>{z.nickname}</span>
                          )
                        )}
                        {x.accountReviews.length > 0 &&
                          x.reviewPersonTags.length > 0 && <span> | </span>}
                        {x.reviewPersonTags?.map((y, yI) =>
                          yI < x.reviewPersonTags.length - 1 ? (
                            <span key={y.name}>{y.name} | </span>
                          ) : (
                            <span key={y.name}>{y.name}</span>
                          )
                        )}
                      </span>
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
          <div className={styles.btn}>
            <ArrowDropUpIcon
              onClick={(e) => {
                e.stopPropagation();
                if (isMyPage) {
                  navigate('/main/restaurants');
                } else {
                  navigate(`/main/users/${userID}/restaurants`);
                }
              }}
              sx={{
                color: 'rgba(55,55,55,0.7)',
              }}
            />
          </div>
        </div>
      ) : (
        <div className={styles.btn}>
          <img src={fail} alt="" width={75} />
        </div>
      )}
    </div>
  );
}

export default ReviewListSubItems;
