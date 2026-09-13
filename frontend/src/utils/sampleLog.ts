export const SAMPLE_LOG = `2023-10-27 10:15:30.123  INFO 12345 --- [           main] c.e.d.DebugAssistApplication           : Starting DebugAssistApplication using Java 17.0.8 on server1 with PID 12345 (C:\\app\\target\\classes started by user in C:\\app)
2023-10-27 10:15:30.125  INFO 12345 --- [           main] c.e.d.DebugAssistApplication           : No active profile set, falling back to 1 default profile: "default"
2023-10-27 10:15:31.042  INFO 12345 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data JPA repositories in DEFAULT mode.
2023-10-27 10:15:31.156  INFO 12345 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 105 ms. Found 10 JPA repository interfaces.
2023-10-27 10:15:32.401  INFO 12345 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
2023-10-27 10:15:32.415  INFO 12345 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2023-10-27 10:15:32.416  INFO 12345 --- [           main] o.apache.catalina.core.StandardEngine    : Starting Servlet engine: [Apache Tomcat/10.1.13]
2023-10-27 10:15:32.490  INFO 12345 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2023-10-27 10:15:32.491  INFO 12345 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 2296 ms
2023-10-27 10:15:32.705  WARN 12345 --- [           main] o.s.b.a.f.FreeMarkerAutoConfiguration    : spring.freemarker.allow-request-override is deprecated. Use spring.freemarker.allow-session-override instead.
2023-10-27 10:15:33.201  INFO 12345 --- [           main] o.hibernate.jpa.internal.util.LogHelper  : HHH000204: Processing PersistenceUnitInfo [name: default]
2023-10-27 10:15:33.250  INFO 12345 --- [           main] org.hibernate.Version                    : HHH000412: Hibernate ORM core version 6.2.7.Final
2023-10-27 10:15:33.252  INFO 12345 --- [           main] org.hibernate.cfg.Environment            : HHH000406: Using bytecode reflection optimizer
2023-10-27 10:15:33.450  INFO 12345 --- [           main] z.t.d.s.w.c.s.HikariConnectionPool       : HikariPool-1 - Starting...
2023-10-27 10:15:33.512 FATAL 12345 --- [           main] o.h.e.j.e.i.JdbcEnvironmentInitiator     : HHH000342: Could not obtain connection to query metadata
2023-10-27 10:15:33.515 ERROR 12345 --- [           main] z.t.d.s.w.c.s.HikariConnectionPool       : HikariPool-1 - Exception during pool initialization.
org.postgresql.util.PSQLException: FATAL: password authentication failed for user "postgres"
\tat org.postgresql.core.v3.ConnectionFactoryImpl.doAuthentication(ConnectionFactoryImpl.java:528)
\tat org.postgresql.core.v3.ConnectionFactoryImpl.tryConnect(ConnectionFactoryImpl.java:161)
\tat org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:213)
\tat org.postgresql.core.ConnectionFactory.openConnection(ConnectionFactory.java:54)
\tat org.postgresql.jdbc.PgConnection.<init>(PgConnection.java:238)
\tat org.postgresql.Driver.makeConnection(Driver.java:430)
\tat org.postgresql.Driver.connect(Driver.java:256)
\tat com.zaxxer.hikari.util.DriverDataSource.getConnection(DriverDataSource.java:138)
\tat com.zaxxer.hikari.pool.PoolBase.newConnection(PoolBase.java:359)
\tat com.zaxxer.hikari.pool.PoolBase.newPoolEntry(PoolBase.java:201)
\tat com.zaxxer.hikari.pool.HikariPool.createPoolEntry(HikariPool.java:470)
\tat com.zaxxer.hikari.pool.HikariPool.checkFailFast(HikariPool.java:561)
\tat com.zaxxer.hikari.pool.HikariPool.<init>(HikariPool.java:100)
\tat com.zaxxer.hikari.HikariDataSource.getConnection(HikariDataSource.java:112)
\tat org.springframework.jdbc.datasource.DataSourceUtils.fetchConnection(DataSourceUtils.java:159)
2023-10-27 10:15:33.520  WARN 12345 --- [           main] o.s.b.a.o.j.JpaBaseConfiguration         : Exception encountered during context initialization - cancelling refresh attempt: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'entityManagerFactory' defined in class path resource [org/springframework/boot/autoconfigure/orm/jpa/HibernateJpaConfiguration.class]: Unable to create requested service [org.hibernate.engine.jdbc.env.spi.JdbcEnvironment]
2023-10-27 10:15:33.530  INFO 12345 --- [           main] o.apache.catalina.core.StandardService   : Stopping service [Tomcat]
2023-10-27 10:15:33.545 ERROR 12345 --- [           main] o.s.b.d.LoggingFailureAnalysisReporter   : 

***************************
APPLICATION FAILED TO START
***************************

Description:
Failed to configure a DataSource: 'url' attribute is not specified and no embedded datasource could be configured.
Reason: Failed to determine a suitable driver class

Action:
Consider the following:
\tIf you want an embedded database (H2, HSQL or Derby), please put it on the classpath.
\tIf you have database settings to be loaded from a particular profile you may need to activate it (no profiles are currently active).

2023-10-27 10:16:01.001  INFO 12345 --- [nio-8080-exec-1] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring DispatcherServlet 'dispatcherServlet'
2023-10-27 10:16:01.001  INFO 12345 --- [nio-8080-exec-1] o.s.web.servlet.DispatcherServlet        : Initializing Servlet 'dispatcherServlet'
2023-10-27 10:16:01.002  INFO 12345 --- [nio-8080-exec-1] o.s.web.servlet.DispatcherServlet        : Completed initialization in 1 ms
2023-10-27 10:16:05.123 ERROR 12345 --- [nio-8080-exec-3] c.e.d.s.UserService                      : Failed to update user profile for user id: 9876
java.lang.NullPointerException: Cannot invoke "String.trim()" because "userProfile.getEmail()" is null
\tat com.example.debugassist.service.UserService.updateProfile(UserService.java:85)
\tat com.example.debugassist.controller.UserController.update(UserController.java:42)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)
\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
\tat java.base/java.lang.reflect.Method.invoke(Method.java:568)
\tat org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:205)
\tat org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:150)
\tat org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:117)
\tat org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:895)
\tat org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:808)
\tat org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:87)
\tat org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1071)
\tat org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:964)
2023-10-27 10:16:15.888  WARN 12345 --- [nio-8080-exec-8] z.t.d.s.w.c.s.HikariConnectionPool       : HikariPool-1 - Connection is not available, request timed out after 30005ms.
2023-10-27 10:16:15.890 ERROR 12345 --- [nio-8080-exec-8] o.a.c.c.C.[.[.[/].[dispatcherServlet]    : Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed: org.springframework.transaction.CannotCreateTransactionException: Could not open JPA EntityManager for transaction] with root cause
java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30005ms.
\tat com.zaxxer.hikari.pool.HikariPool.createTimeoutException(HikariPool.java:696)
\tat com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:181)
\tat com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:146)
\tat com.zaxxer.hikari.HikariDataSource.getConnection(HikariDataSource.java:128)
`;
