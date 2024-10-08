import {LockOutlined, UserOutlined} from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, Radio, Row, Space, Typography } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useEffect} from 'react';
import styled from 'styled-components';
import Header from '../components/home/header';
import { Role, validateMessages } from '../lib/constant';
import { LoginFormValues } from '../lib/model/login';
import apiService from '../lib/services/api-service';
import storage from '../lib/services/storage';