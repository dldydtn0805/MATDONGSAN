import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemAvatar,
  Divider,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import StarIcon from '@mui/icons-material/Star';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import {
  Route,
  Routes,
  useNavigate,
  useParams,
  useLocation,
} from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import reviewStore from '../../stores/reviewStore';
import styles from '../../styles/reviews/ReviewList.module.css';
import ReviewsListSubItems from './ReviewListSubItems';
import urlStore from '../../stores/urlStore';
import userStore from '../../stores/userStore';
import reviewFilterStore from '../../stores/reviewFilterStore';

function ReviewsList() {
  const {
    restaurantStore,
    sortByVisitCount,
    sortByRecentVisitDate,
    sortByAverageTasteAndKindness,
  } = reviewStore();

  const { loginAccount } = userStore();
  const navigate = useNavigate();
  const location = useLocation();
  const handleScrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const {
    setRestaurantStore,
    setMyReviewStore,
    refresh,
    setRefresh,
  } = reviewStore();
  const { API_URL } = urlStore();
  const { userID } = useParams();
  const {
    selectedFriendID,
    selectedStartDate,
    selectedEndDate,
    selectedBusinessTypes,
    selectedUserLocationID,
    seledtedNoAccountFriendID,
    searchKeyWord,
    setSelectedFriendID,
    setSelectedStartDate,
    setSelectedEndDate,
    setSelectedBusinessTypes,
    setSelectedUserLocationID,
    setSeledtedNoAccountFriendID,
    setSearchKeyWord,
  } = reviewFilterStore();
  const [reviewListSortButton1, setReviewListSortButton1] =
    useState(true);
  const [reviewListSortButton2, setReviewListSortButton2] =
    useState(false);
  const [reviewListSortButton3, setReviewListSortButton3] =
    useState(false);
  const [selectedList, setSelectedList] = useState();
  useEffect(() => {
    const currentPageID =
      userID === undefined ? loginAccount?.id : userID;
    const fetchData = async () => {
      try {
        if (!currentPageID) {
          setRestaurantStore([]);
          setMyReviewStore([]);
          return;
        }
        const reviewResponseData = {
          accountReviews: selectedFriendID?.map((x) => ({
            id: Number(x),
          })),
          reviewPersonTags: seledtedNoAccountFriendID.map((x) => ({
            id: Number(x),
          })),
          restaurantFoodCategories: selectedBusinessTypes?.map(
            (x) => ({
              name: String(x),
            })
          ),
          regionId: Number(selectedUserLocationID),
          visitDate: `${selectedStartDate.format('YYYY-MM-DD')}-${selectedEndDate.format('YYYY-MM-DD')}`,
        };
        const restaurantResponseData = {
          name: String(searchKeyWord),
        };

        const [restaurantData, reviewData, regions] =
          await Promise.all([
            axios(
              searchKeyWord === ''
                ? {
                    method: 'get',
                    url: `${API_URL}/restaurant/v2/${currentPageID}`,
                  }
                : {
                    method: 'post',
                    url: `${API_URL}/review/search/simple/${currentPageID}`,
                    data: restaurantResponseData,
                  }
            ),
            axios({
              method: 'post',
              url: `${API_URL}/review/search/filter/${currentPageID} `,
              data: reviewResponseData,
            }),
            axios.get(`${API_URL}/region`),
          ]);
        setRestaurantStore([]);
        setMyReviewStore([]);
        const restaurantList = restaurantData.data?.map(
          (restaurant) => {
            const filteredRegeion = regions.data?.find(
              (region) => region.id === restaurant.regionId
            );
            const filteredReview = reviewData?.data.filter(
              (review) => review.restaurantId === restaurant.id
            );
            const totalKindnessRating = filteredReview?.reduce(
              (sum, review) => sum + review.kindnessRating,
              0
            );

            const averageKindnessRating =
              filteredReview?.length > 0
                ? totalKindnessRating / filteredReview.length
                : 0;
            const totalTasteRating = filteredReview?.reduce(
              (sum, review) => sum + review.tasteRating,
              0
            );

            const averageTasteRating =
              filteredReview?.length > 0
                ? totalTasteRating / filteredReview.length
                : 0;
            const latestVisitDate =
              filteredReview?.length > 0
                ? dayjs(
                    new Date(
                      Math.max.apply(
                        null,
                        filteredReview.map(
                          (review) => new Date(review.visitDate)
                        )
                      )
                    ).toISOString()
                  )
                : dayjs('2000-01-01');
            return {
              id: restaurant.id,
              restaurantName: restaurant.name,
              district: filteredRegeion?.district,
              restaurantFoodCaregories: restaurant?.restaurantFoodCategories
                ?.map((x) => x.name)
                .join(' / '),
              averageKindnessRating: Math.round(averageKindnessRating),
              averageTasteRating: Math.round(averageTasteRating),
              latestVisitDate: latestVisitDate.format('YYYY-MM-DD'),
              visitCount: filteredReview.length,
              thumUrl: restaurant?.thumUrl,
            };
          }
        );
        setRestaurantStore(restaurantList);
        const reviewList = reviewData?.data.map((review) => {
          const filteredRestaurant = restaurantList.find(
            (x) => Number(x.id) === Number(review.restaurantId)
          );
          return {
            id: review.restaurantId,
            reviewID: review.id,
            restaurantName: filteredRestaurant
              ? filteredRestaurant.restaurantName
              : '',
            averageKindnessRating: review.kindnessRating,
            averageTasteRating: review.tasteRating,
            restaurantFoodCaregories: filteredRestaurant ? filteredRestaurant.restaurantFoodCaregories : '',
            reviewContent: review.content,
            thumUrl: filteredRestaurant?.thumUrl,
            accountReviews: review.accountReviews,
            reviewPersonTags: review.reviewPersonTags,
            visitDate: review.visitDate,
            district: filteredRestaurant ? filteredRestaurant.district : '',
          };
        });
        setMyReviewStore(reviewList);
        if (reviewListSortButton1) sortByRecentVisitDate();
        if (reviewListSortButton2) sortByVisitCount();
        if (reviewListSortButton3) sortByAverageTasteAndKindness();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [
    location,
    loginAccount,
    selectedFriendID,
    selectedStartDate,
    selectedEndDate,
    selectedBusinessTypes,
    selectedUserLocationID,
    seledtedNoAccountFriendID,
    searchKeyWord,
    reviewListSortButton1,
    reviewListSortButton2,
    reviewListSortButton3,
  ]);

  return (
    <div>
      <div>
        <div className={styles.header}>
          <div className={styles.sortBtn}>
            <Button
              variant="text"
              onClick={() => {
                setReviewListSortButton1(true);
                setReviewListSortButton2(false);
                setReviewListSortButton3(false);
                sortByRecentVisitDate();
              }}
              sx={{
                color: reviewListSortButton1 ? '#555558' : '#BFBFBF',
              }}
            >
              • 최신순
            </Button>
            <Button
              variant="text"
              onClick={() => {
                setReviewListSortButton1(false);
                setReviewListSortButton2(true);
                setReviewListSortButton3(false);
                sortByVisitCount();
              }}
              sx={{
                color: reviewListSortButton2 ? '#555558' : '#BFBFBF',
              }}
            >
              • 방문순
            </Button>
            <Button
              variant="text"
              onClick={() => {
                setReviewListSortButton1(false);
                setReviewListSortButton2(false);
                setReviewListSortButton3(true);
                sortByAverageTasteAndKindness();
              }}
              sx={{
                color: reviewListSortButton3 ? '#555558' : '#BFBFBF',
              }}
            >
              • 별점순
            </Button>
          </div>
          <div>
            <IconButton
              onClick={() => {
                setRefresh(!refresh);
                setSelectedFriendID([]);
                setSelectedStartDate(
                  dayjs(dayjs('2024-01-01').format('YYYY-MM-DD'))
                );
                setSelectedEndDate(
                  dayjs(dayjs().format('YYYY-MM-DD'))
                );
                setSelectedBusinessTypes([]);
                setSelectedUserLocationID(undefined);
                seledtedNoAccountFriendID수정([]);
                setSearchKeyWord('');
              }}
            >
              <RefreshIcon />
            </IconButton>
            <IconButton onClick={() => handleScrollToSection(0)}>
              <ArrowUpwardIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() =>
                handleScrollToSection(restaurantStore.length - 1)
              }
            >
              <ArrowDownwardIcon fontSize="small" />
            </IconButton>
          </div>
        </div>

        <List className={styles.container}>
          {restaurantStore?.map((item, i) => (
            <ListItem
              key={restaurantStore[i].id}
              onClick={() => {
                navigate(`${item.id}/detail`, {
                  state: {
                    id: item.id,
                  },
                });
                setSelectedList(item.id);
              }}
              className={styles.content}
              button
              id={i}
            >
              <ListItemText
                className={`${styles.contentList} ${item.id === selectedList ? styles.selected : ''}`}
                primary={null}
                secondary={
                  <Typography component="div">
                    <ListItemAvatar>
                      <Avatar
                        src={restaurantStore[i]?.thumUrl}
                        alt="thumUrl"
                      />
                      {/* thumUrl */}
                    </ListItemAvatar>
                    <span className={styles.itemInfo}>
                      <span className={styles.itemTitle}>
                        {restaurantStore[i]?.restaurantName}
                      </span>
                      <span>
                        <span>
                          친절
                          <StarIcon
                            sx={{
                              fontSize: '10px',
                              color: 'rgba(29, 177, 119, 0.7)',
                            }}
                          />
                          {restaurantStore[i].averageKindnessRating}
                        </span>
                        <span>|</span>
                        <span>
                          averageTasteRating
                          <StarIcon
                            sx={{
                              fontSize: '10px',
                              color: 'rgba(29, 177, 119, 0.7)',
                            }}
                          />
                          {restaurantStore[i].averageTasteRating}
                        </span>
                      </span>
                    </span>
                    <span className={styles.itemInfo}>
                      <span>
                        <span>{restaurantStore[i].district}</span>
                        <span>|</span>
                        <span>{restaurantStore[i].restaurantFoodCaregories}</span>
                      </span>
                      <span>
                        <span>
                          {restaurantStore[i].visitCount}번 방문
                        </span>
                      </span>
                    </span>
                  </Typography>
                }
              />
              <Divider />
              <Routes>
                <Route
                  path={`${item.id}/*`}
                  key={item.id}
                  element={<ReviewsListSubItems id={item.id} />}
                />
              </Routes>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
}
export default ReviewsList;
